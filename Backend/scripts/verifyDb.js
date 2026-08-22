import 'dotenv/config';
import connectDB from '../config/db.js';
import City from '../models/City.js';
import Place from '../models/Place.js';

const verifyDatabase = async () => {
  let dbConnection;
  try {
    dbConnection = await connectDB();

    console.log('\n================ DATABASE VERIFICATION ================');
    
    // 1. Get collection counts
    const cityCount = await City.countDocuments({});
    const placeCount = await Place.countDocuments({});

    console.log(` Cities Collection Count: ${cityCount} cities`);
    console.log(` Places Collection Count: ${placeCount} places`);

    // 2. Check for duplicate placeIds using MongoDB aggregation
    const duplicates = await Place.aggregate([
      {
        $group: {
          _id: '$placeId',
          count: { $sum: 1 },
          names: { $push: '$name' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    console.log(` Duplicate placeIds: ${duplicates.length}`);
    if (duplicates.length > 0) {
      console.warn('⚠️ WARNING: Found duplicate placeId records in the database:');
      duplicates.forEach(dup => {
        console.warn(`  - placeId "${dup._id}" appears ${dup.count} times: [${dup.names.join(', ')}]`);
      });
    } else {
      console.log('✅ Success: 0 duplicate placeIds found in database.');
    }

    // 3. Print random sample stats
    console.log('\n--- Sample City (Random) ---');
    const sampleCity = await City.findOne({});
    if (sampleCity) {
      console.log(`Name: ${sampleCity.name}`);
      console.log(`Country: ${sampleCity.country}`);
      console.log(`Coordinates: [${sampleCity.latitude}, ${sampleCity.longitude}]`);
    } else {
      console.log('No cities found.');
    }

    console.log('\n--- Sample Place (Random) ---');
    const samplePlace = await Place.findOne({}).populate('cityId', 'name country');
    if (samplePlace) {
      console.log(`Name: ${samplePlace.name}`);
      console.log(`Category: ${samplePlace.category}`);
      console.log(`City Reference: ${samplePlace.cityId?.name || 'Unknown'}`);
      console.log(`Estimated Cost: $${samplePlace.estimatedCost}`);
      console.log(`Duration: ${samplePlace.duration} minutes`);
    } else {
      console.log('No places found.');
    }
    console.log('=======================================================\n');

  } catch (error) {
    console.error('Verification failed due to error:', error.message);
  } finally {
    if (dbConnection) {
      await dbConnection.disconnect();
      console.log('Database connection closed.');
    }
    process.exit(0);
  }
};

verifyDatabase();
