import mongoose from 'mongoose';
import City from '../models/City.js';

/**
 * GET /api/cities
 *
 * Query params:
 *   search   — full-text search across name, country, region
 *   country  — exact filter by country
 *   region   — exact filter by region
 *   page     — page number (default 1)
 *   limit    — results per page (default 20, max 100)
 */
export const getCities = async (req, res, next) => {
  try {
    const { search, country, region } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter = {};

    if (search) {
      // Use MongoDB text index when a search term is provided
      filter.$text = { $search: search };
    }
    if (country) {
      filter.country = { $regex: new RegExp(`^${country.trim()}$`, 'i') };
    }
    if (region) {
      filter.region = { $regex: new RegExp(`^${region.trim()}$`, 'i') };
    }

    const [cities, total] = await Promise.all([
      City.find(filter)
        .sort(search ? { score: { $meta: 'textScore' } } : { popularity: -1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      City.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/cities/:cityId
 *
 * cityId may be a MongoDB ObjectId or a city name string.
 */
export const getCityById = async (req, res, next) => {
  try {
    const { cityId } = req.params;
    let city = null;

    if (mongoose.Types.ObjectId.isValid(cityId)) {
      city = await City.findById(cityId).lean();
    }

    // Fallback: treat cityId as a name (URL-encoded)
    if (!city) {
      city = await City.findOne({
        name: { $regex: new RegExp(`^${decodeURIComponent(cityId).trim()}$`, 'i') },
      }).lean();
    }

    if (!city) {
      const error = new Error(`City not found: "${cityId}"`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: city,
    });
  } catch (error) {
    next(error);
  }
};
