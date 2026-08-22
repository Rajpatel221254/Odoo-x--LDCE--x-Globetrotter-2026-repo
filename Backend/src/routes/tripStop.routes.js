import express from 'express';
import {
  updateTripStop,
  deleteTripStop,
} from '../controllers/tripStop.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateTripStopSchema } from '../validators/trip.validator.js';

const router = express.Router();

// All stop routes require authentication
router.use(protect);

/**
 * @route   PATCH /api/stops/:stopId
 * @desc    Update a trip stop
 * @access  Protected
 */
router.patch('/:stopId', validate(updateTripStopSchema), updateTripStop);

/**
 * @route   DELETE /api/stops/:stopId
 * @desc    Delete a trip stop
 * @access  Protected
 */
router.delete('/:stopId', deleteTripStop);

export default router;
