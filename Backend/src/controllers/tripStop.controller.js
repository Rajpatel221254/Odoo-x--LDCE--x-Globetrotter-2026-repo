import mongoose from 'mongoose';
import Trip from '../models/Trip.js';
import TripStop from '../models/TripStop.js';
import City from '../models/City.js';

/**
 * POST /api/trips/:tripId/stops
 * Protected — Add a stop to an owned trip
 */
export const addTripStop = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { cityId, startDate, endDate, order, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      const err = new Error(`Invalid Trip ID format: "${tripId}"`);
      err.statusCode = 400;
      return next(err);
    }

    // 1. Verify trip exists and is owned by user
    const trip = await Trip.findOne({
      _id: tripId,
      userId: req.user._id,
    });

    if (!trip) {
      const err = new Error('Trip not found or you do not have permission to modify it.');
      err.statusCode = 404;
      return next(err);
    }

    // 2. Validate that referenced cityId exists
    const city = await City.findById(cityId);
    if (!city) {
      const err = new Error(`Referenced city does not exist in database: "${cityId}"`);
      err.statusCode = 404;
      return next(err);
    }

    // 3. Prevent duplicate cities within the same trip
    const existingCityStop = await TripStop.findOne({
      tripId: trip._id,
      cityId: city._id,
    });

    if (existingCityStop) {
      const err = new Error(`City "${city.name}" is already a stop in this trip.`);
      err.statusCode = 409;
      return next(err);
    }

    // 4. Validate stop dates are within the trip's date range
    const stopStart = new Date(startDate);
    const stopEnd = new Date(endDate);

    if (stopStart < trip.startDate || stopEnd > trip.endDate) {
      const err = new Error(
        `Stop dates (${stopStart.toISOString().slice(0, 10)} to ${stopEnd.toISOString().slice(0, 10)}) must be within the trip date window (${trip.startDate.toISOString().slice(0, 10)} to ${trip.endDate.toISOString().slice(0, 10)}).`
      );
      err.statusCode = 400;
      return next(err);
    }

    // 5. Prevent overlapping city stops (stops must form a sequential journey)
    const existingStops = await TripStop.find({ tripId: trip._id }).populate('cityId', 'name');
    for (const existing of existingStops) {
      if (stopStart < existing.endDate && stopEnd > existing.startDate) {
        const err = new Error(
          `Stop dates overlap with an existing stop in "${existing.cityId?.name || 'another city'}" (${existing.startDate.toISOString().slice(0, 10)} to ${existing.endDate.toISOString().slice(0, 10)}). Stops must form a sequential journey.`
        );
        err.statusCode = 400;
        return next(err);
      }
    }

    // 6. Automatically assign stop order if not specified
    let stopOrder = order;
    if (!stopOrder) {
      const highestOrderStop = await TripStop.findOne({ tripId: trip._id }).sort({ order: -1 });
      stopOrder = highestOrderStop ? highestOrderStop.order + 1 : 1;
    }

    // 7. Create stop
    const newStop = await TripStop.create({
      tripId: trip._id,
      cityId: city._id,
      startDate: stopStart,
      endDate: stopEnd,
      order: stopOrder,
      notes: notes || null,
    });

    const populatedStop = await TripStop.findById(newStop._id).populate(
      'cityId',
      'name country region image latitude longitude costIndex popularity'
    );

    res.status(201).json({
      success: true,
      message: 'Trip stop added successfully.',
      data: populatedStop,
    });
  } catch (error) {
    if (error.code === 11000) {
      const err = new Error('City is already added as a stop in this trip.');
      err.statusCode = 409;
      return next(err);
    }
    next(error);
  }
};

/**
 * GET /api/trips/:tripId/stops
 * Protected — Get all ordered stops for an owned trip
 */
export const getTripStops = async (req, res, next) => {
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
      const err = new Error('Trip not found or unauthorized.');
      err.statusCode = 404;
      return next(err);
    }

    const stops = await TripStop.find({ tripId: trip._id })
      .sort({ order: 1 })
      .populate('cityId', 'name country region image latitude longitude costIndex popularity');

    res.status(200).json({
      success: true,
      count: stops.length,
      data: stops,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/stops/:stopId
 * Protected — Update a stop (verifies ownership via trip)
 */
export const updateTripStop = async (req, res, next) => {
  try {
    const { stopId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(stopId)) {
      const err = new Error(`Invalid Stop ID format: "${stopId}"`);
      err.statusCode = 400;
      return next(err);
    }

    const stop = await TripStop.findById(stopId).populate('tripId');
    if (!stop) {
      const err = new Error('Trip stop not found.');
      err.statusCode = 404;
      return next(err);
    }

    // Verify ownership through parent trip
    if (stop.tripId.userId.toString() !== req.user._id.toString()) {
      const err = new Error('You do not have permission to modify this trip stop.');
      err.statusCode = 403;
      return next(err);
    }

    const trip = stop.tripId;
    const { cityId, startDate, endDate, order, notes } = req.body;

    // Validate city if changing
    if (cityId && cityId.toString() !== stop.cityId.toString()) {
      const city = await City.findById(cityId);
      if (!city) {
        const err = new Error(`Referenced city does not exist: "${cityId}"`);
        err.statusCode = 404;
        return next(err);
      }

      const duplicate = await TripStop.findOne({
        tripId: trip._id,
        cityId: city._id,
        _id: { $ne: stop._id },
      });
      if (duplicate) {
        const err = new Error(`City "${city.name}" is already a stop in this trip.`);
        err.statusCode = 409;
        return next(err);
      }
      stop.cityId = city._id;
    }

    const newStart = startDate ? new Date(startDate) : stop.startDate;
    const newEnd = endDate ? new Date(endDate) : stop.endDate;

    if (newStart > newEnd) {
      const err = new Error('Stop start date must be before or equal to end date.');
      err.statusCode = 400;
      return next(err);
    }

    // Validate within trip date range
    if (newStart < trip.startDate || newEnd > trip.endDate) {
      const err = new Error(
        `Stop dates (${newStart.toISOString().slice(0, 10)} to ${newEnd.toISOString().slice(0, 10)}) must be within the trip window (${trip.startDate.toISOString().slice(0, 10)} to ${trip.endDate.toISOString().slice(0, 10)}).`
      );
      err.statusCode = 400;
      return next(err);
    }

    // Check overlap with other stops in this trip
    if (startDate || endDate) {
      const otherStops = await TripStop.find({
        tripId: trip._id,
        _id: { $ne: stop._id },
      }).populate('cityId', 'name');

      for (const other of otherStops) {
        if (newStart < other.endDate && newEnd > other.startDate) {
          const err = new Error(
            `Stop dates overlap with existing stop in "${other.cityId?.name || 'another city'}" (${other.startDate.toISOString().slice(0, 10)} to ${other.endDate.toISOString().slice(0, 10)}).`
          );
          err.statusCode = 400;
          return next(err);
        }
      }
    }

    if (startDate !== undefined) stop.startDate = newStart;
    if (endDate !== undefined) stop.endDate = newEnd;
    if (order !== undefined) stop.order = order;
    if (notes !== undefined) stop.notes = notes;

    await stop.save();

    const populated = await TripStop.findById(stop._id).populate(
      'cityId',
      'name country region image latitude longitude costIndex popularity'
    );

    res.status(200).json({
      success: true,
      message: 'Trip stop updated successfully.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/stops/:stopId
 * Protected — Delete a trip stop and resequence remaining stops
 */
export const deleteTripStop = async (req, res, next) => {
  try {
    const { stopId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(stopId)) {
      const err = new Error(`Invalid Stop ID format: "${stopId}"`);
      err.statusCode = 400;
      return next(err);
    }

    const stop = await TripStop.findById(stopId).populate('tripId');
    if (!stop) {
      const err = new Error('Trip stop not found.');
      err.statusCode = 404;
      return next(err);
    }

    if (stop.tripId.userId.toString() !== req.user._id.toString()) {
      const err = new Error('You do not have permission to delete this trip stop.');
      err.statusCode = 403;
      return next(err);
    }

    const tripId = stop.tripId._id;
    await stop.deleteOne();

    // Resequence remaining stops (1, 2, 3...)
    const remainingStops = await TripStop.find({ tripId }).sort({ order: 1 });
    for (let i = 0; i < remainingStops.length; i++) {
      if (remainingStops[i].order !== i + 1) {
        remainingStops[i].order = i + 1;
        await remainingStops[i].save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Trip stop deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/trips/:tripId/stops/reorder
 * Protected — Reorder all stops for a trip
 */
export const reorderTripStops = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { stopIds } = req.body;

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
      const err = new Error('Trip not found or unauthorized.');
      err.statusCode = 404;
      return next(err);
    }

    const existingStops = await TripStop.find({ tripId: trip._id });
    if (existingStops.length !== stopIds.length) {
      const err = new Error(
        `Expected ${existingStops.length} stop IDs to reorder, but received ${stopIds.length}.`
      );
      err.statusCode = 400;
      return next(err);
    }

    const existingIds = new Set(existingStops.map((s) => s._id.toString()));
    for (const id of stopIds) {
      if (!existingIds.has(id.toString())) {
        const err = new Error(`Stop ID "${id}" does not belong to this trip.`);
        err.statusCode = 400;
        return next(err);
      }
    }

    // Bulk update orders based on array index (1-indexed)
    const bulkOps = stopIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, tripId: trip._id },
        update: { $set: { order: index + 1 } },
      },
    }));

    await TripStop.bulkWrite(bulkOps);

    const updatedStops = await TripStop.find({ tripId: trip._id })
      .sort({ order: 1 })
      .populate('cityId', 'name country region image latitude longitude costIndex popularity');

    res.status(200).json({
      success: true,
      message: 'Trip stops reordered successfully.',
      data: updatedStops,
    });
  } catch (error) {
    next(error);
  }
};
