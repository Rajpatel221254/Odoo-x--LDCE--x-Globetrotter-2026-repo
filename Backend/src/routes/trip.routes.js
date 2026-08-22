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
import {
  addItineraryItem,
  getTripItinerary,
  reorderItineraryItems,
} from '../controllers/itinerary.controller.js';
import {
  addExpense,
  getTripExpenses,
} from '../controllers/expense.controller.js';
import { getTripBudget } from '../controllers/budget.controller.js';
import {
  createShareLink,
  disableShareLink,
} from '../controllers/share.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { uploadCoverImage } from '../middleware/upload.middleware.js';
import {
  createTripSchema,
  updateTripSchema,
  createTripStopSchema,
  reorderTripStopsSchema,
} from '../validators/trip.validator.js';
import {
  createItineraryItemSchema,
  reorderItinerarySchema,
} from '../validators/itinerary.validator.js';
import { createExpenseSchema } from '../validators/expense.validator.js';
import { createShareLinkSchema } from '../validators/share.validator.js';

const router = express.Router();

// All trip routes require authentication
router.use(protect);

// ─── Trip CRUD ────────────────────────────────────────────────────────────────

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

// ─── Trip Stops ───────────────────────────────────────────────────────────────

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

// ─── Itinerary Activities ─────────────────────────────────────────────────────

/**
 * @route   POST /api/trips/:tripId/itinerary
 * @desc    Add an activity to the trip itinerary
 * @access  Protected
 */
router.post('/:tripId/itinerary', validate(createItineraryItemSchema), addItineraryItem);

/**
 * @route   GET /api/trips/:tripId/itinerary
 * @desc    Get all activities in the trip itinerary (ordered by date and time)
 * @access  Protected
 */
router.get('/:tripId/itinerary', getTripItinerary);

/**
 * @route   PATCH /api/trips/:tripId/itinerary/reorder
 * @desc    Reorder activities in the trip itinerary
 * @access  Protected
 */
router.patch('/:tripId/itinerary/reorder', validate(reorderItinerarySchema), reorderItineraryItems);

// ─── Expenses & Budget ────────────────────────────────────────────────────────

/**
 * @route   POST /api/trips/:tripId/expenses
 * @desc    Log a new expense for a trip
 * @access  Protected
 */
router.post('/:tripId/expenses', validate(createExpenseSchema), addExpense);

/**
 * @route   GET /api/trips/:tripId/expenses
 * @desc    Get all expenses for a trip (supports category, startDate, endDate filters)
 * @access  Protected
 */
router.get('/:tripId/expenses', getTripExpenses);

/**
 * @route   GET /api/trips/:tripId/budget
 * @desc    Get budget analytics, planned activity costs, and category breakdown for a trip
 * @access  Protected
 */
router.get('/:tripId/budget', getTripBudget);

// ─── Trip Sharing ─────────────────────────────────────────────────────────────

/**
 * @route   POST /api/trips/:tripId/share
 * @desc    Create or retrieve an active share link for a trip
 * @access  Protected
 */
router.post('/:tripId/share', validate(createShareLinkSchema), createShareLink);

/**
 * @route   DELETE /api/trips/:tripId/share
 * @desc    Disable active share links for a trip
 * @access  Protected
 */
router.delete('/:tripId/share', disableShareLink);

export default router;
