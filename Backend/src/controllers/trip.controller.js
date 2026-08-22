import path from 'path';
import mongoose from 'mongoose';
import Trip from '../models/Trip.js';
import TripStop from '../models/TripStop.js';
import { uploadImageToImageKit } from '../services/imagekit.service.js';

/**
 * POST /api/trips
 * Protected — Create a new trip for authenticated user
 * Accepts JSON or multipart/form-data with coverImage file
 */
export const createTrip = async (req, res, next) => {
  try {
    const { name, description, startDate, endDate, totalBudget, currency, status } = req.body;
    let coverImage = req.body.coverImage || null;

    // If an image file was attached via FormData, upload to ImageKit
    if (req.file) {
      const ext = path.extname(req.file.originalname) || '.jpg';
      const fileName = `trip_${req.user._id}_${Date.now()}${ext}`;
      const uploadResult = await uploadImageToImageKit(
        req.file.buffer,
        fileName,
        'globetrotter/trips'
      );
      coverImage = uploadResult.url;
    }

    const trip = await Trip.create({
      userId: req.user._id,
      name,
      description: description || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      coverImage,
      totalBudget: totalBudget !== undefined ? Number(totalBudget) : 0,
      currency: currency || 'USD',
      status: status || 'planning',
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully.',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/trips
 * Protected — Get all trips belonging to authenticated user
 */
export const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'stops',
        options: { sort: { order: 1 } },
        populate: {
          path: 'cityId',
          select: 'name country region image latitude longitude costIndex popularity',
        },
      });

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/trips/:tripId
 * Protected — Get single trip by ID with ordered stops and city details
 */
export const getTripById = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      const err = new Error(`Invalid Trip ID format: "${tripId}"`);
      err.statusCode = 400;
      return next(err);
    }

    const trip = await Trip.findOne({
      _id: tripId,
      userId: req.user._id,
    }).populate({
      path: 'stops',
      options: { sort: { order: 1 } },
      populate: {
        path: 'cityId',
        select: 'name country region image latitude longitude costIndex popularity',
      },
    });

    if (!trip) {
      const err = new Error('Trip not found or you do not have permission to view it.');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/trips/:tripId
 * Protected — Update trip details (accepts JSON or FormData with optional coverImage file)
 */
export const updateTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      const err = new Error(`Invalid Trip ID format: "${tripId}"`);
      err.statusCode = 400;
      return next(err);
    }

    const trip = await Trip.findOne({
      _id: tripId,
      userId: req.user._id,
    });

    if (!trip) {
      const err = new Error('Trip not found or you do not have permission to modify it.');
      err.statusCode = 404;
      return next(err);
    }

    const { name, description, startDate, endDate, totalBudget, currency, status } = req.body;

    const newStartDate = startDate ? new Date(startDate) : trip.startDate;
    const newEndDate = endDate ? new Date(endDate) : trip.endDate;

    if (newStartDate > newEndDate) {
      const err = new Error('Trip start date must be before or equal to end date.');
      err.statusCode = 400;
      return next(err);
    }

    // If dates changed, verify all existing stops remain within the new trip date range
    if (startDate || endDate) {
      const existingStops = await TripStop.find({ tripId: trip._id });
      for (const stop of existingStops) {
        if (stop.startDate < newStartDate || stop.endDate > newEndDate) {
          const err = new Error(
            `Cannot update trip dates: existing stop (${stop.startDate.toISOString().slice(0, 10)} to ${stop.endDate.toISOString().slice(0, 10)}) falls outside the new trip window (${newStartDate.toISOString().slice(0, 10)} to ${newEndDate.toISOString().slice(0, 10)}).`
          );
          err.statusCode = 400;
          return next(err);
        }
      }
    }

    // If a new cover image file was uploaded via FormData, upload to ImageKit
    if (req.file) {
      const ext = path.extname(req.file.originalname) || '.jpg';
      const fileName = `trip_${trip._id}_${Date.now()}${ext}`;
      const uploadResult = await uploadImageToImageKit(
        req.file.buffer,
        fileName,
        'globetrotter/trips'
      );
      trip.coverImage = uploadResult.url;
    } else if (req.body.coverImage !== undefined) {
      trip.coverImage = req.body.coverImage;
    }

    if (name !== undefined) trip.name = name;
    if (description !== undefined) trip.description = description;
    if (startDate !== undefined) trip.startDate = newStartDate;
    if (endDate !== undefined) trip.endDate = newEndDate;
    if (totalBudget !== undefined) trip.totalBudget = Number(totalBudget);
    if (currency !== undefined) trip.currency = currency;
    if (status !== undefined) trip.status = status;

    await trip.save();

    // Re-fetch populated trip
    const populatedTrip = await Trip.findById(trip._id).populate({
      path: 'stops',
      options: { sort: { order: 1 } },
      populate: {
        path: 'cityId',
        select: 'name country region image latitude longitude costIndex popularity',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully.',
      data: populatedTrip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/trips/:tripId
 * Protected — Delete trip and cascade delete all its stops
 */
export const deleteTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      const err = new Error(`Invalid Trip ID format: "${tripId}"`);
      err.statusCode = 400;
      return next(err);
    }

    const trip = await Trip.findOne({
      _id: tripId,
      userId: req.user._id,
    });

    if (!trip) {
      const err = new Error('Trip not found or you do not have permission to delete it.');
      err.statusCode = 404;
      return next(err);
    }

    // Cascade delete all stops associated with this trip
    await TripStop.deleteMany({ tripId: trip._id });
    await trip.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Trip and associated stops deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
