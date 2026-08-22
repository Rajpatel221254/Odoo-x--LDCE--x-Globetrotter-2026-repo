import express from 'express';
import City from '../../models/City.js';

const router = express.Router();

/**
 * @route   GET /api/cities
 * @desc    Get all cities from the database
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const cities = await City.find({}).sort({ name: 1 });
    res.json({
      success: true,
      count: cities.length,
      data: cities
    });
  } catch (error) {
    next(error);
  }
});

export default router;
