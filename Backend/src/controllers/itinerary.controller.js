import mongoose from 'mongoose';
import ItineraryItem from '../models/ItineraryItem.js';
import Trip from '../models/Trip.js';
import TripStop from '../models/TripStop.js';
import Place from '../models/Place.js';
import City from '../models/City.js';

// Helper to normalize a Date to YYYY-MM-DD string for comparison
const toDateString = (d) => new Date(d).toISOString().slice(0, 10);

/**
 * POST /api/trips/:tripId/itinerary
 * Protected — Add an activity/itinerary item to a trip
 */
export const addItineraryItem = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { tripStopId, cityId, placeId, date, startTime, endTime, order, notes, estimatedCost } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      const err = new Error(`Invalid Trip ID format: "${tripId}"`);
      err.statusCode = 400;
      return next(err);
    }

    // 1. Verify trip exists and is owned by user
    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      const err = new Error('Trip not found or you do not have permission to modify it.');
      err.statusCode = 404;
      return next(err);
    }

    // 2. Verify tripStopId exists and belongs to this trip
    const tripStop = await TripStop.findOne({ _id: tripStopId, tripId: trip._id });
    if (!tripStop) {
      const err = new Error(`Trip stop "${tripStopId}" does not belong to this trip.`);
      err.statusCode = 404;
      return next(err);
    }

    // 3. Verify cityId matches the stop's city
    if (tripStop.cityId.toString() !== cityId.toString()) {
      const err = new Error(
        `City "${cityId}" does not match the selected trip stop city (${tripStop.cityId}).`
      );
      err.statusCode = 400;
      return next(err);
    }

    // 4. Verify place exists and belongs to this cityId
    const place = await Place.findById(placeId);
    if (!place) {
      const err = new Error(`Place does not exist: "${placeId}"`);
      err.statusCode = 404;
      return next(err);
    }

    if (place.cityId.toString() !== cityId.toString()) {
      const err = new Error(
        `Place "${place.name}" does not belong to the selected city (${cityId}).`
      );
      err.statusCode = 400;
      return next(err);
    }

    // 5. Validate date is within the selected trip stop's start/end dates
    const activityDate = new Date(date);
    const stopStartStr = toDateString(tripStop.startDate);
    const stopEndStr = toDateString(tripStop.endDate);
    const activityDateStr = toDateString(activityDate);

    if (activityDateStr < stopStartStr || activityDateStr > stopEndStr) {
      const err = new Error(
        `Activity date (${activityDateStr}) must be within the trip stop date window (${stopStartStr} to ${stopEndStr}).`
      );
      err.statusCode = 400;
      return next(err);
    }

    // 6. Prevent overlapping itinerary items for the same trip and date
    // Overlap condition: startA < endB && endA > startB
    const sameDateItems = await ItineraryItem.find({
      tripId: trip._id,
      date: {
        $gte: new Date(`${activityDateStr}T00:00:00.000Z`),
        $lte: new Date(`${activityDateStr}T23:59:59.999Z`),
      },
    }).populate('placeId', 'name');

    for (const existing of sameDateItems) {
      if (startTime < existing.endTime && endTime > existing.startTime) {
        const placeName = existing.placeId?.name || 'another activity';
        const err = new Error(
          `Time slot (${startTime} - ${endTime}) overlaps with existing activity "${placeName}" (${existing.startTime} - ${existing.endTime}) on ${activityDateStr}.`
        );
        err.statusCode = 400;
        return next(err);
      }
    }

    // 7. Auto-assign order if not provided
    let itemOrder = order;
    if (!itemOrder) {
      const highestOrder = await ItineraryItem.findOne({
        tripId: trip._id,
        date: {
          $gte: new Date(`${activityDateStr}T00:00:00.000Z`),
          $lte: new Date(`${activityDateStr}T23:59:59.999Z`),
        },
      }).sort({ order: -1 });

      itemOrder = highestOrder ? highestOrder.order + 1 : 1;
    }

    // 8. Auto-populate estimatedCost from place if not provided
    const cost = estimatedCost !== undefined ? Number(estimatedCost) : place.estimatedCost || 0;

    // 9. Create Itinerary Item
    const newItem = await ItineraryItem.create({
      tripId: trip._id,
      tripStopId: tripStop._id,
      cityId: tripStop.cityId,
      placeId: place._id,
      date: activityDate,
      startTime,
      endTime,
      order: itemOrder,
      notes: notes || null,
      estimatedCost: cost,
    });

    const populatedItem = await ItineraryItem.findById(newItem._id)
      .populate('placeId', 'name category description duration estimatedCost currency image latitude longitude')
      .populate('cityId', 'name country region image')
      .populate('tripStopId', 'startDate endDate order');

    res.status(201).json({
      success: true,
      message: 'Itinerary activity added successfully.',
      data: populatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/trips/:tripId/itinerary
 * Protected — Get all itinerary items for a trip ordered by date, then order
 */
export const getTripItinerary = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      const err = new Error(`Invalid Trip ID format: "${tripId}"`);
      err.statusCode = 400;
      return next(err);
    }

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      const err = new Error('Trip not found or unauthorized.');
      err.statusCode = 404;
      return next(err);
    }

    const items = await ItineraryItem.find({ tripId: trip._id })
      .sort({ date: 1, order: 1, startTime: 1 })
      .populate('placeId', 'name category description duration estimatedCost currency image latitude longitude')
      .populate('cityId', 'name country region image')
      .populate('tripStopId', 'startDate endDate order');

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/itinerary/:itemId
 * Protected — Update an itinerary activity
 */
export const updateItineraryItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      const err = new Error(`Invalid Itinerary Item ID format: "${itemId}"`);
      err.statusCode = 400;
      return next(err);
    }

    const item = await ItineraryItem.findById(itemId)
      .populate('tripId')
      .populate('tripStopId');

    if (!item) {
      const err = new Error('Itinerary item not found.');
      err.statusCode = 404;
      return next(err);
    }

    // Verify trip ownership
    if (item.tripId.userId.toString() !== req.user._id.toString()) {
      const err = new Error('You do not have permission to modify this itinerary item.');
      err.statusCode = 403;
      return next(err);
    }

    const { tripStopId, cityId, placeId, date, startTime, endTime, order, notes, estimatedCost } =
      req.body;

    let targetStop = item.tripStopId;
    if (tripStopId && tripStopId.toString() !== item.tripStopId._id.toString()) {
      targetStop = await TripStop.findOne({ _id: tripStopId, tripId: item.tripId._id });
      if (!targetStop) {
        const err = new Error(`Trip stop "${tripStopId}" does not belong to this trip.`);
        err.statusCode = 404;
        return next(err);
      }
      item.tripStopId = targetStop._id;
    }

    const targetCityId = cityId || item.cityId;
    if (cityId) {
      if (targetStop.cityId.toString() !== cityId.toString()) {
        const err = new Error(
          `City "${cityId}" does not match the selected trip stop city (${targetStop.cityId}).`
        );
        err.statusCode = 400;
        return next(err);
      }
      item.cityId = cityId;
    }

    if (placeId && placeId.toString() !== item.placeId.toString()) {
      const place = await Place.findById(placeId);
      if (!place) {
        const err = new Error(`Place does not exist: "${placeId}"`);
        err.statusCode = 404;
        return next(err);
      }
      if (place.cityId.toString() !== targetCityId.toString()) {
        const err = new Error(`Place "${place.name}" does not belong to the selected city.`);
        err.statusCode = 400;
        return next(err);
      }
      item.placeId = place._id;
    }

    const targetDate = date ? new Date(date) : item.date;
    const targetDateStr = toDateString(targetDate);
    const stopStartStr = toDateString(targetStop.startDate);
    const stopEndStr = toDateString(targetStop.endDate);

    if (targetDateStr < stopStartStr || targetDateStr > stopEndStr) {
      const err = new Error(
        `Activity date (${targetDateStr}) must be within the trip stop window (${stopStartStr} to ${stopEndStr}).`
      );
      err.statusCode = 400;
      return next(err);
    }

    const targetStart = startTime || item.startTime;
    const targetEnd = endTime || item.endTime;

    if (targetStart >= targetEnd) {
      const err = new Error('startTime must be earlier than endTime.');
      err.statusCode = 400;
      return next(err);
    }

    // Check overlap with other activities on the same date for this trip
    if (date || startTime || endTime) {
      const sameDateItems = await ItineraryItem.find({
        tripId: item.tripId._id,
        _id: { $ne: item._id },
        date: {
          $gte: new Date(`${targetDateStr}T00:00:00.000Z`),
          $lte: new Date(`${targetDateStr}T23:59:59.999Z`),
        },
      }).populate('placeId', 'name');

      for (const existing of sameDateItems) {
        if (targetStart < existing.endTime && targetEnd > existing.startTime) {
          const placeName = existing.placeId?.name || 'another activity';
          const err = new Error(
            `Time slot (${targetStart} - ${targetEnd}) overlaps with activity "${placeName}" (${existing.startTime} - ${existing.endTime}) on ${targetDateStr}.`
          );
          err.statusCode = 400;
          return next(err);
        }
      }
    }

    if (date) item.date = targetDate;
    if (startTime) item.startTime = targetStart;
    if (endTime) item.endTime = targetEnd;
    if (order !== undefined) item.order = order;
    if (notes !== undefined) item.notes = notes;
    if (estimatedCost !== undefined) item.estimatedCost = Number(estimatedCost);

    await item.save();

    const populated = await ItineraryItem.findById(item._id)
      .populate('placeId', 'name category description duration estimatedCost currency image latitude longitude')
      .populate('cityId', 'name country region image')
      .populate('tripStopId', 'startDate endDate order');

    res.status(200).json({
      success: true,
      message: 'Itinerary activity updated successfully.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/itinerary/:itemId
 * Protected — Delete an itinerary activity
 */
export const deleteItineraryItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      const err = new Error(`Invalid Itinerary Item ID format: "${itemId}"`);
      err.statusCode = 400;
      return next(err);
    }

    const item = await ItineraryItem.findById(itemId).populate('tripId');
    if (!item) {
      const err = new Error('Itinerary item not found.');
      err.statusCode = 404;
      return next(err);
    }

    if (item.tripId.userId.toString() !== req.user._id.toString()) {
      const err = new Error('You do not have permission to delete this itinerary item.');
      err.statusCode = 403;
      return next(err);
    }

    const tripId = item.tripId._id;
    const itemDateStr = toDateString(item.date);
    await item.deleteOne();

    // Re-sequence remaining items on that same date
    const remainingOnDate = await ItineraryItem.find({
      tripId,
      date: {
        $gte: new Date(`${itemDateStr}T00:00:00.000Z`),
        $lte: new Date(`${itemDateStr}T23:59:59.999Z`),
      },
    }).sort({ order: 1 });

    for (let i = 0; i < remainingOnDate.length; i++) {
      if (remainingOnDate[i].order !== i + 1) {
        remainingOnDate[i].order = i + 1;
        await remainingOnDate[i].save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Itinerary activity deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/trips/:tripId/itinerary/reorder
 * Protected — Reorder activities within a trip
 */
export const reorderItineraryItems = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { itemIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      const err = new Error(`Invalid Trip ID format: "${tripId}"`);
      err.statusCode = 400;
      return next(err);
    }

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      const err = new Error('Trip not found or unauthorized.');
      err.statusCode = 404;
      return next(err);
    }

    const existingItems = await ItineraryItem.find({ tripId: trip._id });
    if (existingItems.length !== itemIds.length) {
      const err = new Error(
        `Expected ${existingItems.length} item IDs to reorder, but received ${itemIds.length}.`
      );
      err.statusCode = 400;
      return next(err);
    }

    const existingIds = new Set(existingItems.map((item) => item._id.toString()));
    for (const id of itemIds) {
      if (!existingIds.has(id.toString())) {
        const err = new Error(`Itinerary Item ID "${id}" does not belong to this trip.`);
        err.statusCode = 400;
        return next(err);
      }
    }

    const bulkOps = itemIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, tripId: trip._id },
        update: { $set: { order: index + 1 } },
      },
    }));

    await ItineraryItem.bulkWrite(bulkOps);

    const updatedItems = await ItineraryItem.find({ tripId: trip._id })
      .sort({ date: 1, order: 1, startTime: 1 })
      .populate('placeId', 'name category description duration estimatedCost currency image latitude longitude')
      .populate('cityId', 'name country region image')
      .populate('tripStopId', 'startDate endDate order');

    res.status(200).json({
      success: true,
      message: 'Itinerary activities reordered successfully.',
      data: updatedItems,
    });
  } catch (error) {
    next(error);
  }
};
