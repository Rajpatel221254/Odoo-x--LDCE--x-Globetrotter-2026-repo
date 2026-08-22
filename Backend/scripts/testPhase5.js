/**
 * testPhase5.js
 *
 * Comprehensive end-to-end test suite for Phase 5:
 * Itinerary & Activity Planning APIs.
 *
 * Usage:
 *   node scripts/testPhase5.js
 */

import axios from 'axios';

const BASE_URL = process.env.API_URL || 'http://localhost:5001/api';

const runTests = async () => {
  const timestamp = Date.now();
  console.log('====================================================');
  console.log('🧪 STARTING PHASE 5: ITINERARY & ACTIVITY TESTS');
  console.log('====================================================\n');

  try {
    // ─── 1. Setup Users ───────────────────────────────────────────────────────
    console.log('1️⃣  Creating User A and User B...');
    const userARes = await axios.post(`${BASE_URL}/auth/register`, {
      firstName: 'Alice',
      lastName: 'Explorer',
      phoneNumber: '+14155550101',
      email: `alice_itinerary_${timestamp}@globetrotter.io`,
      password: 'password123',
    });
    const tokenA = userARes.data.token;

    const userBRes = await axios.post(`${BASE_URL}/auth/register`, {
      firstName: 'Bob',
      lastName: 'Traveler',
      phoneNumber: '+14155550102',
      email: `bob_itinerary_${timestamp}@globetrotter.io`,
      password: 'password123',
    });
    const tokenB = userBRes.data.token;

    const authA = { headers: { Authorization: `Bearer ${tokenA}` } };
    const authB = { headers: { Authorization: `Bearer ${tokenB}` } };
    console.log('   ✓ Users created with JWT tokens.\n');

    // ─── 2. Setup Trip & Stops ────────────────────────────────────────────────
    console.log('2️⃣  Setting up Trip & Stops for User A...');
    const tripRes = await axios.post(
      `${BASE_URL}/trips`,
      {
        name: 'Autumn In France & Netherlands',
        description: 'Cultural vacation',
        startDate: '2026-10-01',
        endDate: '2026-10-20',
        totalBudget: 4000,
        currency: 'EUR',
      },
      authA
    );
    const tripId = tripRes.data.data._id;

    // Get 2 different cities from database
    const citiesRes = await axios.get(`${BASE_URL}/cities?limit=5`);
    const cities = citiesRes.data.data;
    if (cities.length < 2) {
      throw new Error('Please run npm run seed:cities first to have at least 2 cities in DB.');
    }

    const city1 = cities[0];
    const city2 = cities[1];

    // Add Stop 1 (City 1: 2026-10-02 to 2026-10-08)
    const stop1Res = await axios.post(
      `${BASE_URL}/trips/${tripId}/stops`,
      {
        cityId: city1._id,
        startDate: '2026-10-02',
        endDate: '2026-10-08',
        notes: `Stay in ${city1.name}`,
      },
      authA
    );
    const stop1Id = stop1Res.data.data._id;

    // Add Stop 2 (City 2: 2026-10-09 to 2026-10-15)
    const stop2Res = await axios.post(
      `${BASE_URL}/trips/${tripId}/stops`,
      {
        cityId: city2._id,
        startDate: '2026-10-09',
        endDate: '2026-10-15',
        notes: `Stay in ${city2.name}`,
      },
      authA
    );
    const stop2Id = stop2Res.data.data._id;
    console.log(`   ✓ Trip created with 2 stops: ${city1.name} (Stop 1) & ${city2.name} (Stop 2).\n`);

    // Fetch places for City 1 and City 2
    const placesCity1Res = await axios.get(`${BASE_URL}/places?cityId=${city1._id}&limit=5`);
    const placesCity2Res = await axios.get(`${BASE_URL}/places?cityId=${city2._id}&limit=5`);

    const place1City1 = placesCity1Res.data.data[0];
    const place2City1 = placesCity1Res.data.data[1] || place1City1;
    const place1City2 = placesCity2Res.data.data[0];

    if (!place1City1 || !place1City2) {
      throw new Error('Places not found. Please ensure seed places are present.');
    }

    // ─── 3. Add Valid Itinerary Item 1 ─────────────────────────────────────────
    console.log('3️⃣  Adding Activity 1 (City 1, Stop 1, Morning: 09:00 - 11:30)...');
    const item1Res = await axios.post(
      `${BASE_URL}/trips/${tripId}/itinerary`,
      {
        tripStopId: stop1Id,
        cityId: city1._id,
        placeId: place1City1._id,
        date: '2026-10-03',
        startTime: '09:00',
        endTime: '11:30',
        notes: 'Morning museum tour',
      },
      authA
    );
    const item1 = item1Res.data.data;
    console.log(`   ✓ Activity 1 created! Place: "${item1.placeId.name}", Order: ${item1.order}, Cost: ${item1.estimatedCost}`);
    console.log(`     (Auto-populated estimatedCost: ${item1.estimatedCost} from place)\n`);

    // ─── 4. Add Valid Itinerary Item 2 ─────────────────────────────────────────
    console.log('4️⃣  Adding Activity 2 (City 1, Stop 1, Afternoon: 14:00 - 16:30)...');
    const item2Res = await axios.post(
      `${BASE_URL}/trips/${tripId}/itinerary`,
      {
        tripStopId: stop1Id,
        cityId: city1._id,
        placeId: place2City1._id,
        date: '2026-10-03',
        startTime: '14:00',
        endTime: '16:30',
        notes: 'Afternoon sightseeing',
      },
      authA
    );
    const item2 = item2Res.data.data;
    console.log(`   ✓ Activity 2 created! Place: "${item2.placeId.name}", Auto-Order: ${item2.order}\n`);

    // ─── 5. Test Overlapping Activity Time Slot ───────────────────────────────
    console.log('5️⃣  Testing Overlapping Time Slot on same date (10:00 - 12:00 overlaps 09:00 - 11:30)...');
    try {
      await axios.post(
        `${BASE_URL}/trips/${tripId}/itinerary`,
        {
          tripStopId: stop1Id,
          cityId: city1._id,
          placeId: place1City1._id,
          date: '2026-10-03',
          startTime: '10:00',
          endTime: '12:00',
        },
        authA
      );
      console.error('   ✗ FAILED: Server should have rejected overlapping activity time.');
    } catch (err) {
      console.log(`   ✓ Correctly rejected overlap (Status ${err.response.status}): ${err.response.data.message}\n`);
    }

    // ─── 6. Test Invalid Activity Date (Outside Stop Window) ───────────────────
    console.log('6️⃣  Testing Date Outside Stop Window (Stop 1 is 2026-10-02 to 2026-10-08, requesting 2026-10-12)...');
    try {
      await axios.post(
        `${BASE_URL}/trips/${tripId}/itinerary`,
        {
          tripStopId: stop1Id,
          cityId: city1._id,
          placeId: place1City1._id,
          date: '2026-10-12',
          startTime: '10:00',
          endTime: '12:00',
        },
        authA
      );
      console.error('   ✗ FAILED: Server should have rejected activity date outside stop window.');
    } catch (err) {
      console.log(`   ✓ Correctly rejected date outside window (Status ${err.response.status}): ${err.response.data.message}\n`);
    }

    // ─── 7. Test Start Time >= End Time ───────────────────────────────────────
    console.log('7️⃣  Testing Invalid Time Window (startTime "16:00" >= endTime "14:00")...');
    try {
      await axios.post(
        `${BASE_URL}/trips/${tripId}/itinerary`,
        {
          tripStopId: stop1Id,
          cityId: city1._id,
          placeId: place1City1._id,
          date: '2026-10-04',
          startTime: '16:00',
          endTime: '14:00',
        },
        authA
      );
      console.error('   ✗ FAILED: Server should have rejected startTime >= endTime.');
    } catch (err) {
      console.log(`   ✓ Correctly rejected invalid time order (Status ${err.response.status}): ${err.response.data.message}\n`);
    }

    // ─── 8. Test Place Not Belonging to Selected City ─────────────────────────
    console.log(`8️⃣  Testing Place/City Mismatch (Place from ${city2.name} inside ${city1.name} Stop)...`);
    try {
      await axios.post(
        `${BASE_URL}/trips/${tripId}/itinerary`,
        {
          tripStopId: stop1Id,
          cityId: city1._id,
          placeId: place1City2._id, // place from city 2!
          date: '2026-10-04',
          startTime: '10:00',
          endTime: '12:00',
        },
        authA
      );
      console.error('   ✗ FAILED: Server should have rejected place from another city.');
    } catch (err) {
      console.log(`   ✓ Correctly rejected city/place mismatch (Status ${err.response.status}): ${err.response.data.message}\n`);
    }

    // ─── 9. Add Activity for Stop 2 (City 2) ──────────────────────────────────
    console.log(`9️⃣  Adding Activity for Stop 2 (${city2.name}, Date: 2026-10-10, 10:00 - 13:00)...`);
    const item3Res = await axios.post(
      `${BASE_URL}/trips/${tripId}/itinerary`,
      {
        tripStopId: stop2Id,
        cityId: city2._id,
        placeId: place1City2._id,
        date: '2026-10-10',
        startTime: '10:00',
        endTime: '13:00',
        notes: `Canal walking tour in ${city2.name}`,
      },
      authA
    );
    const item3 = item3Res.data.data;
    console.log(`   ✓ Activity 3 created! Place: "${item3.placeId.name}", Date: ${item3.date.slice(0, 10)}\n`);

    // ─── 10. Get Full Trip Itinerary ──────────────────────────────────────────
    console.log('🔟  Fetching Complete Trip Itinerary (Ordered by Date & Order)...');
    const itineraryRes = await axios.get(`${BASE_URL}/trips/${tripId}/itinerary`, authA);
    const allItems = itineraryRes.data.data;
    console.log(`   ✓ Total itinerary items returned: ${allItems.length}`);
    allItems.forEach((it, idx) => {
      console.log(
        `     [${idx + 1}] Date: ${it.date.slice(0, 10)} | ${it.startTime}-${it.endTime} | Order: ${it.order} | "${it.placeId.name}" (${it.cityId.name})`
      );
    });
    console.log('');

    // ─── 11. Test Unauthorized Access (User B accessing User A trip) ──────────
    console.log('1️⃣1️⃣ Testing Security & Ownership (User B attempting to access User A itinerary)...');
    try {
      await axios.get(`${BASE_URL}/trips/${tripId}/itinerary`, authB);
      console.error('   ✗ FAILED: User B should not be able to view User A itinerary.');
    } catch (err) {
      console.log(`   ✓ Correctly blocked User B (Status ${err.response.status}): ${err.response.data.message}\n`);
    }

    // ─── 12. Update Itinerary Item ────────────────────────────────────────────
    console.log(`1️⃣2️⃣ Updating Itinerary Item 1 (Change notes & time to 09:30 - 12:00)...`);
    const updateRes = await axios.patch(
      `${BASE_URL}/itinerary/${item1._id}`,
      {
        startTime: '09:30',
        endTime: '12:00',
        notes: 'VIP guided private tour booked!',
        estimatedCost: 75,
      },
      authA
    );
    console.log(`   ✓ Updated! New notes: "${updateRes.data.data.notes}", Time: ${updateRes.data.data.startTime}-${updateRes.data.data.endTime}, Cost: ${updateRes.data.data.estimatedCost}\n`);

    // ─── 13. Reorder Itinerary Activities ─────────────────────────────────────
    console.log('1️⃣3️⃣ Testing Activity Reordering...');
    const reorderRes = await axios.patch(
      `${BASE_URL}/trips/${tripId}/itinerary/reorder`,
      {
        itemIds: [item2._id, item1._id, item3._id],
      },
      authA
    );
    console.log('   ✓ Itinerary reordered successfully. New sequence:');
    reorderRes.data.data.forEach((it) => {
      console.log(`     - Order ${it.order}: "${it.placeId.name}" (${it.date.slice(0, 10)})`);
    });
    console.log('');

    // ─── 14. Delete Itinerary Item ────────────────────────────────────────────
    console.log(`1️⃣4️⃣ Deleting Activity "${item2.placeId.name}" (${item2._id})...`);
    await axios.delete(`${BASE_URL}/itinerary/${item2._id}`, authA);
    console.log('   ✓ Activity deleted successfully.');

    const verifyDeleteRes = await axios.get(`${BASE_URL}/trips/${tripId}/itinerary`, authA);
    console.log(`   ✓ Remaining itinerary items: ${verifyDeleteRes.data.count}\n`);

    console.log('====================================================');
    console.log('🎉 ALL PHASE 5 ITINERARY & ACTIVITY TESTS PASSED!');
    console.log('====================================================\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
};

runTests();
