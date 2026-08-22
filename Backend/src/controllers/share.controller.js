import crypto from 'crypto';
import mongoose from 'mongoose';
import ShareLink from '../models/ShareLink.js';
import Trip from '../models/Trip.js';
import TripStop from '../models/TripStop.js';
import ItineraryItem from '../models/ItineraryItem.js';
import Expense from '../models/Expense.js';

const getClientUrl = () => process.env.CLIENT_URL || 'http://localhost:5173';

/**
 * POST /api/trips/:tripId/share
 * Protected — Create or get an active share link for a trip
 */
export const createShareLink = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { expiresAt, customSlug } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      const err = new Error(`Invalid Trip ID format: "${tripId}"`);
      err.statusCode = 400;
      return next(err);
    }

    // 1. Verify trip exists and is owned by the authenticated user
    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      const err = new Error('Trip not found or you do not have permission to share it.');
      err.statusCode = 404;
      return next(err);
    }

    // 2. Check if an active, non-expired share link already exists
    const existingActive = await ShareLink.findOne({ tripId: trip._id, isActive: true });
    if (existingActive) {
      if (!existingActive.expiresAt || new Date() < new Date(existingActive.expiresAt)) {
        return res.status(200).json({
          success: true,
          message: 'Active share link already exists for this trip.',
          shareUrl: `${getClientUrl()}/share/${existingActive.slug}`,
          data: existingActive,
        });
      } else {
        // Expired active link -> mark as inactive
        existingActive.isActive = false;
        await existingActive.save();
      }
    }

    // 3. Generate unique slug
    let slug = customSlug;
    if (slug) {
      const slugExists = await ShareLink.findOne({ slug });
      if (slugExists) {
        const err = new Error(`Custom slug "${slug}" is already taken. Please choose another.`);
        err.statusCode = 409;
        return next(err);
      }
    } else {
      const cleanName = trip.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 20);
      slug = `${cleanName || 'trip'}-${crypto.randomBytes(4).toString('hex')}`;
    }

    // 4. Create ShareLink
    const shareLink = await ShareLink.create({
      tripId: trip._id,
      createdBy: req.user._id,
      slug,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Share link created successfully.',
      shareUrl: `${getClientUrl()}/share/${slug}`,
      data: shareLink,
    });
  } catch (error) {
    if (error.code === 11000) {
      const err = new Error('Share link slug collision. Please try again.');
      err.statusCode = 409;
      return next(err);
    }
    next(error);
  }
};

/**
 * GET /api/share/:slug
 * Public — View a shared trip without authentication
 */
export const getSharedTrip = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // 1. Look up active share link
    const shareLink = await ShareLink.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
    });

    if (!shareLink) {
      const err = new Error('Share link not found or has been disabled.');
      err.statusCode = 404;
      return next(err);
    }

    // 2. Check expiration
    if (shareLink.expiresAt && new Date() > new Date(shareLink.expiresAt)) {
      const err = new Error('This share link has expired.');
      err.statusCode = 404;
      return next(err);
    }

    // 3. Fetch Trip and creator public details
    const trip = await Trip.findById(shareLink.tripId).populate(
      'userId',
      'firstName lastName profilePhoto'
    );

    if (!trip) {
      const err = new Error('Shared trip no longer exists.');
      err.statusCode = 404;
      return next(err);
    }

    // 4. Fetch Stops with City Details
    const stops = await TripStop.find({ tripId: trip._id })
      .sort({ order: 1 })
      .populate('cityId', 'name country region image latitude longitude costIndex popularity');

    // 5. Fetch Itinerary Activities with Place and City Details
    const itinerary = await ItineraryItem.find({ tripId: trip._id })
      .sort({ date: 1, order: 1, startTime: 1 })
      .populate(
        'placeId',
        'name category description duration estimatedCost currency image latitude longitude'
      )
      .populate('cityId', 'name country region image')
      .populate('tripStopId', 'startDate endDate order');

    // 6. Assemble safe public response (No private personal info, passwords, emails, or phone numbers)
    const publicTrip = {
      _id: trip._id,
      name: trip.name,
      description: trip.description,
      startDate: trip.startDate,
      endDate: trip.endDate,
      coverImage: trip.coverImage,
      totalBudget: trip.totalBudget,
      currency: trip.currency,
      status: trip.status,
      creator: trip.userId
        ? {
            firstName: trip.userId.firstName,
            lastName: trip.userId.lastName,
            profilePhoto: trip.userId.profilePhoto,
          }
        : null,
      createdAt: trip.createdAt,
    };

    res.status(200).json({
      success: true,
      data: {
        trip: publicTrip,
        stops,
        itinerary,
        shareInfo: {
          slug: shareLink.slug,
          createdAt: shareLink.createdAt,
          expiresAt: shareLink.expiresAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/trips/:tripId/share
 * Protected — Disable all active share links for a trip
 */
export const disableShareLink = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      const err = new Error(`Invalid Trip ID format: "${tripId}"`);
      err.statusCode = 400;
      return next(err);
    }

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      const err = new Error('Trip not found or you do not have permission to modify its share status.');
      err.statusCode = 404;
      return next(err);
    }

    // Disable all active share links for this trip
    const result = await ShareLink.updateMany(
      { tripId: trip._id, isActive: true },
      { $set: { isActive: false } }
    );

    res.status(200).json({
      success: true,
      message: 'Share link disabled successfully.',
      disabledCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/share/:slug/copy
 * Protected — Copy a shared trip, stops, and activities to the authenticated user's account
 */
export const copySharedTrip = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;

    // 1. Verify active share link
    const shareLink = await ShareLink.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
    });

    if (!shareLink) {
      const err = new Error('Share link not found or has been disabled.');
      err.statusCode = 404;
      return next(err);
    }

    if (shareLink.expiresAt && new Date() > new Date(shareLink.expiresAt)) {
      const err = new Error('This share link has expired and cannot be copied.');
      err.statusCode = 404;
      return next(err);
    }

    // 2. Fetch original trip documents
    const originalTrip = await Trip.findById(shareLink.tripId);
    if (!originalTrip) {
      const err = new Error('Original trip no longer exists.');
      err.statusCode = 404;
      return next(err);
    }

    const originalStops = await TripStop.find({ tripId: originalTrip._id }).sort({ order: 1 });
    const originalItinerary = await ItineraryItem.find({ tripId: originalTrip._id });
    const originalExpenses = await Expense.find({ tripId: originalTrip._id });

    // 3. Create NEW Trip for authenticated user (new _id, assigned to req.user._id)
    const newTrip = await Trip.create({
      userId: req.user._id,
      name: name || `${originalTrip.name} (Copy)`,
      description: originalTrip.description,
      startDate: originalTrip.startDate,
      endDate: originalTrip.endDate,
      coverImage: originalTrip.coverImage,
      totalBudget: originalTrip.totalBudget,
      currency: originalTrip.currency,
      status: 'planning',
    });

    // 4. Clone TripStops and build map (oldStopId -> newStopId)
    const stopIdMap = {};
    for (const stop of originalStops) {
      const newStop = await TripStop.create({
        tripId: newTrip._id,
        cityId: stop.cityId,
        startDate: stop.startDate,
        endDate: stop.endDate,
        order: stop.order,
        notes: stop.notes,
      });
      stopIdMap[stop._id.toString()] = newStop._id;
    }

    // 5. Clone ItineraryItems with mapped stop IDs
    for (const item of originalItinerary) {
      const mappedStopId = stopIdMap[item.tripStopId.toString()];
      if (mappedStopId) {
        await ItineraryItem.create({
          tripId: newTrip._id,
          tripStopId: mappedStopId,
          cityId: item.cityId,
          placeId: item.placeId,
          date: item.date,
          startTime: item.startTime,
          endTime: item.endTime,
          order: item.order,
          notes: item.notes,
          estimatedCost: item.estimatedCost,
        });
      }
    }

    // 6. Clone relevant Expenses
    for (const exp of originalExpenses) {
      await Expense.create({
        tripId: newTrip._id,
        category: exp.category,
        description: exp.description,
        amount: exp.amount,
        currency: exp.currency,
        date: exp.date,
        notes: exp.notes,
      });
    }

    // 7. Re-fetch complete populated new trip
    const populatedNewTrip = await Trip.findById(newTrip._id).populate({
      path: 'stops',
      options: { sort: { order: 1 } },
      populate: {
        path: 'cityId',
        select: 'name country region image latitude longitude costIndex popularity',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Trip copied successfully to your account.',
      data: populatedNewTrip,
    });
  } catch (error) {
    next(error);
  }
};
