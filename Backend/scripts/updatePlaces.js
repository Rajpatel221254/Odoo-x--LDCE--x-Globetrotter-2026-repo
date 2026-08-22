import 'dotenv/config';
import connectDB from '../config/db.js';
import City from '../models/City.js';
import Place from '../models/Place.js';
import { getPlacesByCategory } from './geoapify.js';
import { getStandardizedCategory, GEOAPIFY_CATEGORIES } from './categoryMapper.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getEstimatedCostByCategory = (category) => {
  switch (category) {
    case 'Museum': return 15;
    case 'Activity': return 25;
    case 'Tourist attraction': return 10;
    default: return 0;
  }
};

const getDurationByCategory = (category) => {
  switch (category) {
    case 'Museum': return 120;
    case 'Activity': return 90;
    case 'Park': return 60;
    case 'Landmark': return 45;
    default: return 60;
  }
};

const getFallbackImageByCategory = (category) => {
  switch (category) {
    case 'Museum': return 'https://images.unsplash.com/photo-1574007557239-acf6863bc375?auto=format&fit=crop&w=600&q=80';
    case 'Activity': return 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=600&q=80';
    case 'Park': return 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80';
    case 'Landmark': return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
    default: return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80';
  }
};

const updatePlaces = async () => {
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

    console.log(`Starting Places database synchronization across ${cities.length} cities...`);
    let totalUpserted = 0;
    let totalModified = 0;
    let totalSkipped = 0;

    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      console.log(`[${i + 1}/${cities.length}] Refreshing places for ${city.name}, ${city.country}...`);

      try {
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

          if (!props.name) {
            totalSkipped++;
            continue;
          }

          const category = getStandardizedCategory(props.categories);
          if (!category) {
            totalSkipped++;
            continue;
          }

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

          // Push bulk write operation
          bulkOps.push({
            updateOne: {
              filter: { placeId: placePayload.placeId },
              update: { $set: placePayload },
              upsert: true
            }
          });
        }

        if (bulkOps.length > 0) {
          // Perform bulk write operation for efficiency
          const result = await Place.bulkWrite(bulkOps);
          
          const upserted = result.upsertedCount;
          const modified = result.modifiedCount;
          
          totalUpserted += upserted;
          totalModified += modified;

          console.log(` -> Saved: ${upserted} new, ${modified} updated`);
        } else {
          console.log(` -> No places to update`);
        }

      } catch (error) {
        console.error(`❌ Error updating places for city ${city.name}:`, error.message);
      }

      await sleep(350);
    }

    console.log('\n--- Sync Places Summary ---');
    console.log(`New Places Inserted: ${totalUpserted}`);
    console.log(`Existing Places Updated: ${totalModified}`);
    console.log(`Skipped Items: ${totalSkipped}`);
    console.log('---------------------------');

  } catch (error) {
    console.error('Fatal error during places synchronization:', error.message);
  } finally {
    if (dbConnection) {
      console.log('Closing database connection...');
      await dbConnection.disconnect();
      console.log('Database connection closed.');
    }
    process.exit(0);
  }
};

updatePlaces();
