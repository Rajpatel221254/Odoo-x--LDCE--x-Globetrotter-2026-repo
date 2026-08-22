import express from 'express';
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from '../controllers/trip.controller.js';
import {
  addTripStop,
  getTripStops,
  reorderTripStops,
} from '../controllers/tripStop.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { uploadCoverImage } from '../middleware/upload.middleware.js';
import {
  createTripSchema,
  updateTripSchema,
  createTripStopSchema,
  reorderTripStopsSchema,
} from '../validators/trip.validator.js';

const router = express.Router();

// All trip routes require authentication
router.use(protect);

/**
 * @route   POST /api/trips
 * @desc    Create a new trip (supports JSON or multipart/form-data with coverImage)
 * @access  Protected
 */
router.post('/', uploadCoverImage, validate(createTripSchema), createTrip);

/**
 * @route   GET /api/trips
 * @desc    Get all trips for authenticated user
 * @access  Protected
 */
router.get('/', getTrips);

/**
 * @route   GET /api/trips/:tripId
 * @desc    Get single trip by ID with ordered stops and city details
 * @access  Protected
 */
router.get('/:tripId', getTripById);

/**
 * @route   PATCH /api/trips/:tripId
 * @desc    Update trip details (supports JSON or multipart/form-data with coverImage)
 * @access  Protected
 */
router.patch('/:tripId', uploadCoverImage, validate(updateTripSchema), updateTrip);

/**
 * @route   DELETE /api/trips/:tripId
 * @desc    Delete trip and cascade delete its stops
 * @access  Protected
 */
router.delete('/:tripId', deleteTrip);

/**
 * @route   POST /api/trips/:tripId/stops
 * @desc    Add a stop to a trip
 * @access  Protected
 */
router.post('/:tripId/stops', validate(createTripStopSchema), addTripStop);

/**
 * @route   GET /api/trips/:tripId/stops
 * @desc    Get all ordered stops for a trip
 * @access  Protected
 */
router.get('/:tripId/stops', getTripStops);

/**
 * @route   PATCH /api/trips/:tripId/stops/reorder
 * @desc    Reorder stops within a trip
 * @access  Protected
 */
router.patch('/:tripId/stops/reorder', validate(reorderTripStopsSchema), reorderTripStops);

export default router;
