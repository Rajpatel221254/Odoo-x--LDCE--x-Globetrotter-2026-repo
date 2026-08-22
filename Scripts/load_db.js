/**
 * load_into_mongodb.js
 *
 * Loads Geoapify tourism data (output/*.json) into MongoDB.
 * Creates / updates two collections: cities and places.
 *
 * Prerequisites:
 *   npm install mongodb
 *
 * Usage:
 *   export MONGO_URI="mongodb://localhost:27017"
 *   export DB_NAME="travel_db"
 *   node load_into_mongodb.js
 */

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// -------------------- CONFIG --------------------
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME   = process.env.DB_NAME   || 'travel_db';
const DATA_DIR  = path.join(__dirname, 'output2');

// -------------------- HELPERS --------------------

function getDataFiles(dir) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Output directory not found: ${dir}`);
  }
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .map(f => path.join(dir, f));
}

function averageCoords(coords) {
  if (!coords.length) return { latitude: null, longitude: null };
  const lat = coords.reduce((s, c) => s + c.lat, 0) / coords.length;
  const lon = coords.reduce((s, c) => s + c.lon, 0) / coords.length;
  return {
    latitude:  parseFloat(lat.toFixed(6)),
    longitude: parseFloat(lon.toFixed(6)),
  };
}

// -------------------- MAIN --------------------

async function main() {
  console.log(`Connecting to MongoDB …`);
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const citiesColl  = db.collection('cities');
  const placesColl  = db.collection('places');

  // Ensure indexes for fast, idempotent imports
  console.log('Ensuring indexes …');
  await citiesColl.createIndex({ name: 1, countryCode: 1 }, { unique: true });
  await placesColl.createIndex({ placeId: 1 }, { unique: true, sparse: true });
  await placesColl.createIndex({ cityId: 1 });
  await placesColl.createIndex({ category: 1 });

  const files = getDataFiles(DATA_DIR);
  console.log(`Found ${files.length} country files to import.\n`);

  // =====================================================================
  // PASS 1 — Aggregate in memory
  // =====================================================================
  const cityMap = new Map(); // key: "cityName|countryCode"
  const places  = [];

  for (const file of files) {
    let data;
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch (err) {
      console.error(`[SKIP] ${path.basename(file)} — ${err.message}`);
      continue;
    }

    const countryCode = (data.country_code || '').toUpperCase();
    const countryName = data.country_name || countryCode;

    for (const p of data.places || []) {
      if (!p.name) continue;                 // skip unnamed features

      const cityName = p.city || 'Unknown';
      const cityKey  = `${cityName}|${countryCode}`;

      // --- accumulate city ---------------------------------------------
      if (!cityMap.has(cityKey)) {
        cityMap.set(cityKey, {
          name: cityName,
          country: countryName,
          countryCode,
          region: null,      // Geoapify Places API does not return state/region
          coords: [],
          costIndex: null,   // not present in source data
          popularity: null,  // not present in source data
        });
      }
      const cityEntry = cityMap.get(cityKey);
      if (p.coordinates?.lat != null && p.coordinates?.lon != null) {
        cityEntry.coords.push({ lat: p.coordinates.lat, lon: p.coordinates.lon });
      }

      // --- build place record -----------------------------------------
      const categories = Array.isArray(p.categories) ? p.categories : [];
      places.push({
        _sourcePlaceId: p.place_id,   // used for upsert filter
        cityKey,
        name: p.name,
        category: categories[0] || 'tourism',
        categories,                   // keep full array for future use
        description: p.description || null,
        latitude: p.coordinates?.lat ?? null,
        longitude: p.coordinates?.lon ?? null,
        estimatedCost: null,          // not present in source data
        duration: null,               // not present in source data
        image: p.image || null,
      });
    }
  }

  console.log(`Aggregated ${cityMap.size} cities and ${places.length} places.\n`);

  // =====================================================================
  // PASS 2 — Upsert cities
  // =====================================================================
  console.log('Upserting cities …');
  const cityBulkOps = [];

  for (const [key, c] of cityMap) {
    const { latitude, longitude } = averageCoords(c.coords);
    cityBulkOps.push({
      updateOne: {
        filter: { name: c.name, countryCode: c.countryCode },
        update: {
          $set: {
            name: c.name,
            country: c.country,
            countryCode: c.countryCode,
            region: c.region,
            latitude,
            longitude,
            costIndex: c.costIndex,
            popularity: c.popularity,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        upsert: true,
      },
    });
  }

  if (cityBulkOps.length) {
    const result = await citiesColl.bulkWrite(cityBulkOps, { ordered: false });
    console.log(`  matched=${result.matchedCount}  upserted=${result.upsertedCount}\n`);
  }

  // Build a lookup: "cityName|countryCode" -> ObjectId
  const allCities = await citiesColl
    .find({}, { projection: { _id: 1, name: 1, countryCode: 1 } })
    .toArray();

  const cityKeyToId = new Map();
  for (const c of allCities) {
    cityKeyToId.set(`${c.name}|${c.countryCode}`, c._id);
  }

  // =====================================================================
  // PASS 3 — Upsert places
  // =====================================================================
  console.log('Upserting places …');
  const placeBulkOps = [];
  let orphaned = 0;

  for (const p of places) {
    const cityId = cityKeyToId.get(p.cityKey);
    if (!cityId) {
      orphaned++;
      continue;
    }

    const filter = p._sourcePlaceId
      ? { placeId: p._sourcePlaceId }
      : { name: p.name, cityId, latitude: p.latitude, longitude: p.longitude };

    placeBulkOps.push({
      updateOne: {
        filter,
        update: {
          $set: {
            cityId,
            name: p.name,
            category: p.category,
            categories: p.categories,
            description: p.description,
            latitude: p.latitude,
            longitude: p.longitude,
            estimatedCost: p.estimatedCost,
            duration: p.duration,
            image: p.image,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            placeId: p._sourcePlaceId,
            createdAt: new Date(),
          },
        },
        upsert: true,
      },
    });
  }

  if (orphaned) {
    console.log(`  Warning: ${orphaned} places skipped (no matching city).`);
  }

  if (placeBulkOps.length) {
    // MongoDB bulkWrite has a ~100k ops limit, so chunk if necessary
    const CHUNK = 8000;
    let totalMatched = 0, totalUpserted = 0;

    for (let i = 0; i < placeBulkOps.length; i += CHUNK) {
      const chunk = placeBulkOps.slice(i, i + CHUNK);
      const res = await placesColl.bulkWrite(chunk, { ordered: false });
      totalMatched  += res.matchedCount;
      totalUpserted += res.upsertedCount;
      process.stdout.write(
        `  Progress: ${Math.min(i + CHUNK, placeBulkOps.length).toLocaleString()}` +
        ` / ${placeBulkOps.length.toLocaleString()}\r`
      );
    }
    console.log(`\n  matched=${totalMatched}  upserted=${totalUpserted}`);
  }

  // =====================================================================
  // Summary
  // =====================================================================
  const cityCount  = await citiesColl.countDocuments();
  const placeCount = await placesColl.countDocuments();
  console.log(`\nDone. DB now contains: ${cityCount} cities, ${placeCount} places.`);

  await client.close();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});