import express from 'express';
import mongoose from 'mongoose';
import Place from '../../models/Place.js';
import City from '../../models/City.js';
import { getPlacesByCategory, geocodeCity } from '../../scripts/geoapify.js';
import { getStandardizedCategory, GEOAPIFY_CATEGORIES } from '../../scripts/categoryMapper.js';

const router = express.Router();

// Helper: category pricing logic
const getEstimatedCostByCategory = (category) => {
  switch (category) {
    case 'Museum': return 15;
    case 'Activity': return 25;
    case 'Tourist attraction': return 10;
    default: return 0;
  }
};

// Helper: category duration logic
const getDurationByCategory = (category) => {
  switch (category) {
    case 'Museum': return 120;
    case 'Activity': return 90;
    case 'Park': return 60;
    case 'Landmark': return 45;
    default: return 60;
  }
};

// Helper: fallback category images
const getFallbackImageByCategory = (category) => {
  switch (category) {
    case 'Museum': return 'https://images.unsplash.com/photo-1574007557239-acf6863bc375?auto=format&fit=crop&w=600&q=80';
    case 'Activity': return 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=600&q=80';
    case 'Park': return 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80';
    case 'Landmark': return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
    default: return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80';
  }
};

/**
 * Helper to fetch places from Geoapify, store them in MongoDB, and return the saved documents.
 */
const fetchAndStorePlaces = async (city) => {
  console.log(`[Cache Miss] Fetching places dynamically from Geoapify for: ${city.name}...`);
  
  const features = await getPlacesByCategory(
    city.latitude,
    city.longitude,
    GEOAPIFY_CATEGORIES,
    20,
    10000
  );

  const bulkOps = [];
  const savedPlaces = [];

  for (const feature of features) {
    const props = feature.properties;

    // Skip places without names
    if (!props.name) continue;

    const category = getStandardizedCategory(props.categories);
    if (!category) continue;

    const image = props.wiki_and_media?.image || getFallbackImageByCategory(category);

    const placePayload = {
      cityId: city._id,
      name: props.name,
      category,
      description: props.description || `Explore ${props.name}, a prominent ${category.toLowerCase()} located in ${city.name}, ${city.country}.`,
      latitude: Number(props.lat),
      longitude: Number(props.lon),
      estimatedCost: getEstimatedCostByCategory(category),
      duration: getDurationByCategory(category),
      image,
      placeId: props.place_id
    };

    bulkOps.push({
      updateOne: {
        filter: { placeId: placePayload.placeId },
        update: { $set: placePayload },
        upsert: true
      }
    });

    savedPlaces.push(placePayload);
  }

  if (bulkOps.length > 0) {
    await Place.bulkWrite(bulkOps);
    console.log(`[Cache Populated] Saved ${bulkOps.length} places to MongoDB for ${city.name}.`);
  }

  // Query database to return full formatted records (with ObjectIds, createdAt, etc.)
  return await Place.find({ cityId: city._id }).populate('cityId', 'name country');
};

/**
 * @route   GET /api/places
 * @desc    Get places with dynamic caching: serves from DB if present, else fetches from API and stores.
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const { cityId, category } = req.query;
    
    // Scenario 1: User requested all places (no cityId filter)
    if (!cityId) {
      const filter = category ? { category } : {};
      const places = await Place.find(filter).populate('cityId', 'name country');
      return res.json({
        success: true,
        source: 'database',
        count: places.length,
        data: places
      });
    }

    // Scenario 2: User requested places for a specific city (ID or name)
    let cityObj = null;

    // Step A: Resolve the city
    if (mongoose.Types.ObjectId.isValid(cityId)) {
      cityObj = await City.findById(cityId);
    } else {
      cityObj = await City.findOne({ name: new RegExp('^' + cityId.trim() + '$', 'i') });
    }

    // If city is not found in MongoDB, dynamically geocode and register it on-the-fly!
    if (!cityObj) {
      console.log(`[Cache Miss] City "${cityId}" not found in DB. Dynamically geocoding...`);
      try {
        const geoCityData = await geocodeCity(cityId, ''); // Search city by name
        
        cityObj = await City.findOneAndUpdate(
          { name: geoCityData.name, country: geoCityData.country },
          {
            name: geoCityData.name,
            country: geoCityData.country,
            region: geoCityData.region,
            latitude: Number(geoCityData.latitude),
            longitude: Number(geoCityData.longitude),
            costIndex: 3,
            popularity: 3
          },
          { upsert: true, new: true }
        );
        console.log(`[Cache Populated] Dynamically saved new city: ${cityObj.name}, ${cityObj.country}`);
      } catch (err) {
        return res.status(404).json({
          success: false,
          message: `Could not dynamically geocode or resolve city: "${cityId}".`
        });
      }
    }

    // Step B: Check if places exist in MongoDB for this city
    const dbPlacesCount = await Place.countDocuments({ cityId: cityObj._id });
    let places = [];
    let source = 'database';

    if (dbPlacesCount > 0) {
      // Serve directly from database
      console.log(`[Cache Hit] Serving places from MongoDB for: ${cityObj.name}`);
      const filter = { cityId: cityObj._id };
      if (category) filter.category = category;
      places = await Place.find(filter).populate('cityId', 'name country');
    } else {
      // Dynamic fetch, seed and return
      places = await fetchAndStorePlaces(cityObj);
      source = 'api';
      
      // If category filter is applied, filter the output
      if (category) {
        places = places.filter(p => p.category === category);
      }
    }

    return res.json({
      success: true,
      source,
      count: places.length,
      data: places
    });

  } catch (error) {
    next(error);
  }
});

export default router;
