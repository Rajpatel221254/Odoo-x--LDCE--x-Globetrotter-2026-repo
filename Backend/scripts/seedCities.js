/**
 * seedCities.js
 *
 * Reads src/data/cities.json, geocodes each city via the Geoapify Geocoding API,
 * and upserts the results into MongoDB. Duplicate-safe via findOneAndUpdate + upsert.
 *
 * Usage:  npm run seed:cities
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../src/config/db.js';
import City from '../src/models/City.js';
import { geocodeCity } from '../src/services/geoapify.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// City card images — one per cost-index level (1 = budget … 5 = luxury)
const CITY_IMAGES = [
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80', // budget city skyline
  'https://images.unsplash.com/photo-1499856374561-0e408178b827?w=800&q=80', // mid-range city
  'https://images.unsplash.com/photo-1514565131-fce0801e6785?w=800&q=80', // upper-mid city
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', // premium city
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80', // luxury city at night
];

const getCityImage = (costIndex) =>
  CITY_IMAGES[Math.max(0, Math.min(4, (Number(costIndex) || 3) - 1))];

// ─── Main ─────────────────────────────────────────────────────────────────────
const seedCities = async () => {
  try {
    await connectDB();

    const filePath = path.join(__dirname, '../src/data/cities.json');
    const citiesList = JSON.parse(await fs.readFile(filePath, 'utf8'));

    console.log(`\n[Seed] Geocoding & seeding ${citiesList.length} cities...\n`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < citiesList.length; i++) {
      const raw = citiesList[i];
      process.stdout.write(`[${i + 1}/${citiesList.length}] ${raw.name}, ${raw.country} ... `);

      try {
        const geo = await geocodeCity(raw.name, raw.country);

        await City.findOneAndUpdate(
          { name: geo.name, country: geo.country },
          {
            name: geo.name,
            country: geo.country,
            region: geo.region || raw.region || null,
            latitude: Number(geo.latitude),
            longitude: Number(geo.longitude),
            costIndex: Number(raw.costIndex) || 3,
            popularity: Number(raw.popularity) || 3,
            image: raw.image || getCityImage(raw.costIndex),
            description:
              raw.description ||
              `Discover ${geo.name}, a vibrant destination in ${geo.country} waiting to be explored.`,
          },
          { upsert: true, new: true, runValidators: true }
        );

        console.log('✓');
        success++;
      } catch (err) {
        console.log(`✗  ${err.message}`);
        failed++;
      }

      await sleep(350); // Respect Geoapify rate limits
    }

    console.log('\n─────────────────────────────');
    console.log(`✓ Seeded:  ${success} cities`);
    console.log(`✗ Failed:  ${failed} cities`);
    console.log('─────────────────────────────\n');
  } catch (err) {
    console.error('[Seed] Fatal error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedCities();
