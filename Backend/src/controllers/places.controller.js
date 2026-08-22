import mongoose from 'mongoose';
import Place from '../models/Place.js';
import City from '../models/City.js';
import { getPlacesByCategory, geocodeCity } from '../services/geoapify.service.js';
import { getStandardizedCategory, GEOAPIFY_CATEGORIES } from '../services/categoryMapper.js';

// ─── Image pools (10 unique Unsplash photos per category) ────────────────────
const IMAGE_POOLS = {
  Museum: [
    'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=600&q=80',
    'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=600&q=80',
    'https://images.unsplash.com/photo-1578926288207-a90a5366a863?w=600&q=80',
    'https://images.unsplash.com/photo-1585503418537-88331351ad99?w=600&q=80',
    'https://images.unsplash.com/photo-1509842368806-70b6e2a1f0ea?w=600&q=80',
    'https://images.unsplash.com/photo-1571947386934-f7b1b2bfbe41?w=600&q=80',
    'https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=600&q=80',
    'https://images.unsplash.com/photo-1574007557239-acf6863bc375?w=600&q=80',
    'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600&q=80',
    'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=600&q=80',
  ],
  Landmark: [
    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80',
    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&q=80',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
    'https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80',
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&q=80',
    'https://images.unsplash.com/photo-1531169509526-f8f1fdaa4a67?w=600&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80',
    'https://images.unsplash.com/photo-1548263594-a71ea65a8598?w=600&q=80',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80',
  ],
  Park: [
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80',
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&q=80',
    'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=600&q=80',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&q=80',
    'https://images.unsplash.com/photo-1510525009512-ad7fc13dac31?w=600&q=80',
    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80',
    'https://images.unsplash.com/photo-1597168557014-5fa7c97c4f3b?w=600&q=80',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80',
    'https://images.unsplash.com/photo-1572276596237-5db2c3e16c5d?w=600&q=80',
  ],
  'Tourist attraction': [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
    'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&q=80',
    'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=600&q=80',
    'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=600&q=80',
    'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80',
    'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=600&q=80',
    'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80',
  ],
  Activity: [
    'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600&q=80',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600&q=80',
    'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80',
    'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=80',
    'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80',
    'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=600&q=80',
    'https://images.unsplash.com/photo-1565992441121-4367b2a9f8d1?w=600&q=80',
  ],
};

/**
 * Deterministically pick an image from the pool using the place name.
 * Same name → same image. Different names → different images.
 */
const getPlaceImage = (placeName, category) => {
  const pool = IMAGE_POOLS[category] || IMAGE_POOLS['Tourist attraction'];
  let hash = 5381;
  for (let i = 0; i < placeName.length; i++) {
    hash = (hash * 33) ^ placeName.charCodeAt(i);
  }
  return pool[Math.abs(hash) % pool.length];
};

// ─── Category helpers ─────────────────────────────────────────────────────────
const getCost = (category) => {
  switch (category) {
    case 'Museum': return 15;
    case 'Activity': return 25;
    case 'Tourist attraction': return 10;
    default: return 0;
  }
};

const getDuration = (category) => {
  switch (category) {
    case 'Museum': return 120;
    case 'Activity': return 90;
    case 'Park': return 60;
    case 'Landmark': return 45;
    default: return 60;
  }
};

// ─── Internal: fetch from Geoapify and seed DB ────────────────────────────────
const fetchAndStorePlaces = async (city) => {
  console.log(`[Places] Cache miss — fetching from Geoapify for: ${city.name}`);

  const features = await getPlacesByCategory(
    city.latitude,
    city.longitude,
    GEOAPIFY_CATEGORIES,
    20,
    10000
  );

  const bulkOps = [];

  for (const feature of features) {
    const props = feature.properties;
    if (!props.name) continue;

    const category = getStandardizedCategory(props.categories);
    if (!category) continue;

    const externalId = props.place_id;
    const image = props.wiki_and_media?.image
      ? props.wiki_and_media.image
      : getPlaceImage(props.name, category);

    bulkOps.push({
      updateOne: {
        filter: { placeId: externalId },
        update: {
          $set: {
            cityId: city._id,
            externalId,
            placeId: externalId,
            name: props.name,
            category,
            description:
              props.description ||
              `Explore ${props.name}, a notable ${category.toLowerCase()} in ${city.name}, ${city.country}.`,
            latitude: Number(props.lat),
            longitude: Number(props.lon),
            estimatedCost: getCost(category),
            currency: 'USD',
            duration: getDuration(category),
            image,
          },
        },
        upsert: true,
      },
    });
  }

  if (bulkOps.length > 0) {
    await Place.bulkWrite(bulkOps);
    console.log(`[Places] Saved ${bulkOps.length} places for ${city.name}`);
  }

  return Place.find({ cityId: city._id }).populate('cityId', 'name country').lean();
};

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * GET /api/places
 *
 * Query params:
 *   cityId       — MongoDB ObjectId or city name
 *   category     — exact category filter
 *   maxCost      — max estimatedCost (inclusive)
 *   maxDuration  — max duration in minutes (inclusive)
 *   page         — page number (default 1)
 *   limit        — results per page (default 20, max 100)
 */
export const getPlacesController = async (req, res, next) => {
  try {
    const { cityId, category, maxCost, maxDuration } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    // ── No cityId: serve all places with optional filters ────────────────────
    if (!cityId) {
      const filter = {};
      if (category) filter.category = category;
      if (maxCost !== undefined) filter.estimatedCost = { $lte: Number(maxCost) };
      if (maxDuration !== undefined) filter.duration = { $lte: Number(maxDuration) };

      const [places, total] = await Promise.all([
        Place.find(filter)
          .populate('cityId', 'name country')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Place.countDocuments(filter),
      ]);

      return res.status(200).json({
        success: true,
        source: 'database',
        total,
        page,
        pages: Math.ceil(total / limit),
        count: places.length,
        data: places,
      });
    }

    // ── Resolve city ─────────────────────────────────────────────────────────
    let cityObj = null;

    if (mongoose.Types.ObjectId.isValid(cityId)) {
      cityObj = await City.findById(cityId).lean();
    }
    if (!cityObj) {
      cityObj = await City.findOne({
        name: new RegExp(`^${decodeURIComponent(cityId).trim()}$`, 'i'),
      }).lean();
    }

    // Geocode on-the-fly if city not in DB
    if (!cityObj) {
      console.log(`[Places] City "${cityId}" not in DB — geocoding on-the-fly...`);
      try {
        const geo = await geocodeCity(cityId, '');
        cityObj = await City.findOneAndUpdate(
          { name: geo.name, country: geo.country },
          {
            name: geo.name, country: geo.country,
            region: geo.region,
            latitude: Number(geo.latitude),
            longitude: Number(geo.longitude),
            costIndex: 3, popularity: 3,
          },
          { upsert: true, new: true }
        ).lean();
      } catch {
        const err = new Error(`City not found and could not be geocoded: "${cityId}"`);
        err.statusCode = 404;
        return next(err);
      }
    }

    // ── DB cache check → API fallback ────────────────────────────────────────
    const dbCount = await Place.countDocuments({ cityId: cityObj._id });

    if (dbCount > 0) {
      console.log(`[Places] Cache hit — serving from DB for: ${cityObj.name}`);
      const filter = { cityId: cityObj._id };
      if (category) filter.category = category;
      if (maxCost !== undefined) filter.estimatedCost = { $lte: Number(maxCost) };
      if (maxDuration !== undefined) filter.duration = { $lte: Number(maxDuration) };

      const [results, total] = await Promise.all([
        Place.find(filter)
          .populate('cityId', 'name country')
          .sort({ estimatedCost: 1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Place.countDocuments(filter),
      ]);

      return res.status(200).json({
        success: true,
        source: 'database',
        total,
        page,
        pages: Math.ceil(total / limit),
        count: results.length,
        data: results,
      });
    }

    // Fetch from Geoapify, seed DB, then return
    let results = await fetchAndStorePlaces(cityObj);
    if (category) results = results.filter((p) => p.category === category);
    if (maxCost !== undefined) results = results.filter((p) => p.estimatedCost <= Number(maxCost));
    if (maxDuration !== undefined) results = results.filter((p) => p.duration <= Number(maxDuration));

    const total = results.length;
    const paginated = results.slice(skip, skip + limit);

    return res.status(200).json({
      success: true,
      source: 'api',
      total,
      page,
      pages: Math.ceil(total / limit),
      count: paginated.length,
      data: paginated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/places/:placeId
 *
 * placeId may be a MongoDB ObjectId, externalId, or legacy placeId string.
 */
export const getPlaceById = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    let place = null;

    if (mongoose.Types.ObjectId.isValid(placeId)) {
      place = await Place.findById(placeId).populate('cityId', 'name country region').lean();
    }
    if (!place) {
      place = await Place.findOne({ externalId: placeId })
        .populate('cityId', 'name country region').lean();
    }
    if (!place) {
      place = await Place.findOne({ placeId })
        .populate('cityId', 'name country region').lean();
    }

    if (!place) {
      const err = new Error(`Place not found: "${placeId}"`);
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({ success: true, data: place });
  } catch (error) {
    next(error);
  }
};
