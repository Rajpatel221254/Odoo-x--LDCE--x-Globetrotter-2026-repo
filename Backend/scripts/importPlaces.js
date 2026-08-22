import 'dotenv/config';
import connectDB from '../config/db.js';
import City from '../models/City.js';
import Place from '../models/Place.js';
import { getPlacesByCategory } from './geoapify.js';
import { getStandardizedCategory, GEOAPIFY_CATEGORIES } from './categoryMapper.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Returns dynamic default estimated cost based on category.
 */
const getEstimatedCostByCategory = (category) => {
  switch (category) {
    case 'Museum': return 15;
    case 'Activity': return 25;
    case 'Tourist attraction': return 10;
    default: return 0; // free for Parks & Landmarks
  }
};

/**
 * Returns dynamic default duration in minutes based on category.
 */
const getDurationByCategory = (category) => {
  switch (category) {
    case 'Museum': return 120; // 2 hours
    case 'Activity': return 90;  // 1.5 hours
    case 'Park': return 60;      // 1 hour
    case 'Landmark': return 45;  // 45 mins
    default: return 60;          // 1 hour
  }
};

/**
 * Returns category specific premium unsplash images as fallback.
 */
const getFallbackImageByCategory = (category) => {
  switch (category) {
    case 'Museum': return 'https://images.unsplash.com/photo-1574007557239-acf6863bc375?auto=format&fit=crop&w=600&q=80';
    case 'Activity': return 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=600&q=80';
    case 'Park': return 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80';
    case 'Landmark': return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
    default: return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80';
  }
};

const importPlaces = async () => {
  let dbConnection;
  try {
    // Connect to database
    dbConnection = await connectDB();

    // Fetch all cities from DB
    const cities = await City.find({});
    if (cities.length === 0) {
      console.log('No cities found in database. Run "npm run import:cities" first.');
      process.exit(0);
    }

    console.log(`Loaded ${cities.length} cities. Starting places collection...`);
    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      console.log(`[${i + 1}/${cities.length}] Fetching places for ${city.name}, ${city.country}...`);

      try {
        // Query Geoapify Places API (20 places per city)
        const features = await getPlacesByCategory(
          city.latitude,
          city.longitude,
          GEOAPIFY_CATEGORIES,
          20, // Limit
          10000 // 10km radius
        );

        console.log(`Found ${features.length} raw features. Standardizing and importing...`);

        for (const feature of features) {
          const props = feature.properties;

          // 1. Skip places without names (requirement)
          if (!props.name) {
            skipCount++;
            continue;
          }

          // 2. Standardize categories
          const category = getStandardizedCategory(props.categories);
          if (!category) {
            skipCount++;
            continue; // Skip if it doesn't match any target category
          }

          // 3. Format image (if available in Geoapify metadata, else fallback)
          const image = props.wiki_and_media?.image || getFallbackImageByCategory(category);

          // 4. Construct production-ready place schema payload
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

          // 5. Use findOneAndUpdate with upsert based on placeId to avoid duplicates
          await Place.findOneAndUpdate(
            { placeId: placePayload.placeId },
            placePayload,
            { upsert: true, new: true, runValidators: true }
          );

          successCount++;
        }
        
        console.log(`Finished processing for ${city.name}. Current Total Saved: ${successCount}`);

      } catch (error) {
        console.error(`❌ Error fetching places for city ${city.name}:`, error.message);
      }

      // Respect API rate limits with brief delay
      await sleep(350);
    }

    console.log('\n--- Import Places Summary ---');
    console.log(`Successfully imported/updated: ${successCount} places`);
    console.log(`Skipped (unmapped/no name): ${skipCount} items`);
    console.log('-----------------------------');

  } catch (error) {
    console.error('Fatal error during places import process:', error.message);
  } finally {
    if (dbConnection) {
      console.log('Closing database connection...');
      await dbConnection.disconnect();
      console.log('Database connection closed.');
    }
    process.exit(0);
  }
};

importPlaces();
