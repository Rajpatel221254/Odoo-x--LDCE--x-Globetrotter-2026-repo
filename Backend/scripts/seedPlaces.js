/**
 * seedPlaces.js
 *
 * For every city in MongoDB, fetches up to 20 places from the Geoapify Places API,
 * standardises the data, and upserts into MongoDB.
 *
 * Images: each category has a curated pool of 10 unique Unsplash photos.
 *         A place is assigned one image from the pool using a simple hash of its
 *         name, so the image is always the same for the same place (deterministic)
 *         but different places in the same category get different images.
 *
 * Usage:  npm run seed:places
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import City from '../src/models/City.js';
import Place from '../src/models/Place.js';
import { getPlacesByCategory } from '../src/services/geoapify.service.js';
import { getStandardizedCategory, GEOAPIFY_CATEGORIES } from '../src/services/categoryMapper.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Image pools (10 unique photos per category) ──────────────────────────────
const IMAGE_POOLS = {
  Museum: [
    'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=600&q=80', // Louvre interior
    'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=600&q=80', // art gallery
    'https://images.unsplash.com/photo-1578926288207-a90a5366a863?w=600&q=80', // exhibits
    'https://images.unsplash.com/photo-1585503418537-88331351ad99?w=600&q=80', // museum hall
    'https://images.unsplash.com/photo-1509842368806-70b6e2a1f0ea?w=600&q=80', // natural history
    'https://images.unsplash.com/photo-1571947386934-f7b1b2bfbe41?w=600&q=80', // ancient artifacts
    'https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=600&q=80', // modern art
    'https://images.unsplash.com/photo-1574007557239-acf6863bc375?w=600&q=80', // museum exterior
    'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600&q=80', // gallery corridor
    'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=600&q=80', // sculpture hall
  ],
  Landmark: [
    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80', // arch
    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&q=80', // historic building
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', // Eiffel Tower
    'https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80', // castle
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&q=80', // ancient columns
    'https://images.unsplash.com/photo-1531169509526-f8f1fdaa4a67?w=600&q=80', // monument
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80', // tower
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80', // cathedral
    'https://images.unsplash.com/photo-1548263594-a71ea65a8598?w=600&q=80', // ruins
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80', // palace
  ],
  Park: [
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80', // green meadow
    'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80', // botanical garden
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&q=80', // city park path
    'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=600&q=80', // lake in park
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&q=80', // forest trail
    'https://images.unsplash.com/photo-1510525009512-ad7fc13dac31?w=600&q=80', // flower park
    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80', // park bench
    'https://images.unsplash.com/photo-1597168557014-5fa7c97c4f3b?w=600&q=80', // national park
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80', // autumn park
    'https://images.unsplash.com/photo-1572276596237-5db2c3e16c5d?w=600&q=80', // garden fountain
  ],
  'Tourist attraction': [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80', // city sightseeing
    'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80', // attraction crowd
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80', // travel destination
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', // beach tourism
    'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&q=80', // iconic view
    'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=600&q=80', // tourist spot
    'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=600&q=80', // viewpoint
    'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80', // marina
    'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=600&q=80', // square
    'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80', // cultural site
  ],
  Activity: [
    'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600&q=80', // adventure
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80', // sport arena
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', // swimming
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80', // experience
    'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600&q=80', // amusement
    'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80', // leisure
    'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=80', // outdoor sport
    'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80', // activities
    'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=600&q=80', // entertainment
    'https://images.unsplash.com/photo-1565992441121-4367b2a9f8d1?w=600&q=80', // concert
  ],
};

/**
 * Deterministically pick an image from the category pool using the place name.
 * Same place name → same image. Different names → likely different images.
 */
const getPlaceImage = (placeName, category) => {
  const pool = IMAGE_POOLS[category] || IMAGE_POOLS['Tourist attraction'];

  // Simple djb2-style hash of the place name
  let hash = 5381;
  for (let i = 0; i < placeName.length; i++) {
    hash = (hash * 33) ^ placeName.charCodeAt(i);
  }
  const index = Math.abs(hash) % pool.length;
  return pool[index];
};

// ─── Category helpers ─────────────────────────────────────────────────────────
const getCost = (category) => {
  switch (category) {
    case 'Museum': return 15;
    case 'Activity': return 25;
    case 'Tourist attraction': return 10;
    default: return 0; // Parks & Landmarks are typically free
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

// ─── Main ─────────────────────────────────────────────────────────────────────
const seedPlaces = async () => {
  try {
    await connectDB();

    const cities = await City.find({});
    if (cities.length === 0) {
      console.log('[Seed] No cities found. Run "npm run seed:cities" first.');
      process.exit(0);
    }

    console.log(`\n[Seed] Fetching & seeding places for ${cities.length} cities...\n`);

    let totalSaved = 0;
    let totalSkipped = 0;

    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      process.stdout.write(`[${i + 1}/${cities.length}] ${city.name}, ${city.country} ... `);

      try {
        const features = await getPlacesByCategory(
          city.latitude,
          city.longitude,
          GEOAPIFY_CATEGORIES,
          20,    // max 20 places per city
          10000  // 10 km radius
        );

        const bulkOps = [];

        for (const feature of features) {
          const props = feature.properties;

          // Skip unnamed places
          if (!props.name) { totalSkipped++; continue; }

          const category = getStandardizedCategory(props.categories);
          if (!category) { totalSkipped++; continue; }

          const externalId = props.place_id;

          // Use Geoapify-provided image if available, otherwise pick from pool
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
          totalSaved += bulkOps.length;
          console.log(`✓ ${bulkOps.length} places`);
        } else {
          console.log('- 0 places');
        }
      } catch (err) {
        console.log(`✗ ${err.message}`);
      }

      await sleep(350); // Respect Geoapify rate limits
    }

    console.log('\n─────────────────────────────');
    console.log(`✓ Saved:   ${totalSaved} places`);
    console.log(`- Skipped: ${totalSkipped} items (no name / unmapped category)`);
    console.log('─────────────────────────────\n');
  } catch (err) {
    console.error('[Seed] Fatal error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedPlaces();
