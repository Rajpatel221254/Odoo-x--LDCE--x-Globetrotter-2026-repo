import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import connectDB from '../config/db.js';
import City from '../models/City.js';
import { geocodeCity } from './geoapify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const importCities = async () => {
  let dbConnection;
  try {
    // Connect to database
    dbConnection = await connectDB();

    // Read cities source file
    const citiesPath = path.join(__dirname, '../data/cities.json');
    const rawData = await fs.readFile(citiesPath, 'utf8');
    const citiesList = JSON.parse(rawData);

    console.log(`Starting import for ${citiesList.length} cities...`);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < citiesList.length; i++) {
      const cityInfo = citiesList[i];
      try {
        console.log(`[${i + 1}/${citiesList.length}] Processing: ${cityInfo.name}, ${cityInfo.country}...`);
        
        // Geocode coordinates and region using Geoapify helper
        const geoData = await geocodeCity(cityInfo.name, cityInfo.country);

        // Standardize and merge original properties with geocoded ones
        const cityPayload = {
          name: geoData.name,
          country: geoData.country,
          region: geoData.region || cityInfo.region || null,
          latitude: Number(geoData.latitude),
          longitude: Number(geoData.longitude),
          costIndex: Number(cityInfo.costIndex) || 3,
          popularity: Number(cityInfo.popularity) || 3
        };

        // Use findOneAndUpdate with upsert to prevent duplicates
        await City.findOneAndUpdate(
          { name: cityPayload.name, country: cityPayload.country },
          cityPayload,
          { upsert: true, new: true, runValidators: true }
        );

        console.log(` Successfully saved: ${cityPayload.name}, ${cityPayload.country}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to import city "${cityInfo.name}":`, error.message);
        failCount++;
      }

      // Add a small delay between requests to prevent hitting Geoapify rate limits
      await sleep(350);
    }

    console.log('\n--- Import Cities Summary ---');
    console.log(`Successfully imported/updated: ${successCount} cities`);
    console.log(`Failed: ${failCount} cities`);
    console.log('-----------------------------');

  } catch (error) {
    console.error('Fatal error during city import process:', error.message);
  } finally {
    if (dbConnection) {
      console.log('Closing database connection...');
      await dbConnection.disconnect();
      console.log('Database connection closed.');
    }
    process.exit(0);
  }
};

importCities();
