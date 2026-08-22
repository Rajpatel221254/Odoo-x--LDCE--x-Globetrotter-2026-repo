import express from 'express';
import {
  getSharedTrip,
  copySharedTrip,
} from '../controllers/share.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { copyTripSchema } from '../validators/share.validator.js';

const router = express.Router();

/**
 * @route   GET /api/share/:slug
 * @desc    Public endpoint to view a shared trip (No authentication required)
 * @access  Public
 */
router.get('/:slug', getSharedTrip);

/**
 * @route   POST /api/share/:slug/copy
 * @desc    Copy a shared trip, stops, and activities to the authenticated user's account
 * @access  Protected
 */
router.post('/:slug/copy', protect, validate(copyTripSchema), copySharedTrip);

export default router;
