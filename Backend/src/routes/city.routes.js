import express from 'express';
import { getCities, getCityById } from '../controllers/cities.controller.js';

const router = express.Router();

/**
 * @route   GET /api/cities
 * @desc    List cities with optional search (?search=), country/region filters, and pagination
 * @access  Public
 */
router.get('/', getCities);

/**
 * @route   GET /api/cities/:cityId
 * @desc    Get a single city by MongoDB ObjectId or city name
 * @access  Public
 */
router.get('/:cityId', getCityById);

export default router;
