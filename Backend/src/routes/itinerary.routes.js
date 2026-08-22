import express from 'express';
import {
  updateItineraryItem,
  deleteItineraryItem,
} from '../controllers/itinerary.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateItineraryItemSchema } from '../validators/itinerary.validator.js';

const router = express.Router();

// All itinerary routes require authentication
router.use(protect);

/**
 * @route   PATCH /api/itinerary/:itemId
 * @desc    Update an itinerary activity
 * @access  Protected
 */
router.patch('/:itemId', validate(updateItineraryItemSchema), updateItineraryItem);

/**
 * @route   DELETE /api/itinerary/:itemId
 * @desc    Delete an itinerary activity
 * @access  Protected
 */
router.delete('/:itemId', deleteItineraryItem);

export default router;
