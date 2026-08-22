import express from 'express';
import { getPlacesController, getPlaceById } from '../controllers/places.controller.js';

const router = express.Router();

/**
 * @route   GET /api/places
 * @desc    List places with optional filters:
 *            ?cityId=      — filter by city (ObjectId or name)
 *            ?category=    — filter by category
 *            ?maxCost=     — filter by max estimatedCost
 *            ?maxDuration= — filter by max duration (minutes)
 *            ?page=        — pagination page
 *            ?limit=       — results per page
 * @access  Public
 */
router.get('/', getPlacesController);

/**
 * @route   GET /api/places/:placeId
 * @desc    Get a single place by MongoDB ObjectId, externalId, or placeId
 * @access  Public
 */
router.get('/:placeId', getPlaceById);

export default router;
