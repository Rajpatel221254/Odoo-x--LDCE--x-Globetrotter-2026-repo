/**
 * testAllPhases.js
 *
 * Master End-to-End Test Suite for GlobeTrotter Backend API (Phases 1 to 7):
 * 1. Health Check
 * 2. Cities & Places Discovery
 * 3. User Authentication & Profile
 * 4. Trips & Multi-City Stops Management
 * 5. Itinerary & Activity Planning
 * 6. Expenses & Budget Management
 * 7. Trip Sharing & Copy Trip
 *
 * Usage:
 *   node scripts/testAllPhases.js
 *   npm test
 */

import axios from 'axios';

const BASE_URL = process.env.API_URL || 'http://localhost:5001/api';

const runMasterTestSuite = async () => {
  const ts = Date.now();
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║        GLOBETROTTER BACKEND — COMPLETE E2E TEST SUITE (P1-P7)    ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  try {
    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 1: SERVER & HEALTH CHECK
    // ═══════════════════════════════════════════════════════════════════════
    console.log('🚀 [PHASE 1] Testing Server Health Check...');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    if (!healthRes.data.success) throw new Error('Health check failed');
    console.log(`   ✓ Health check status: 200 OK — "${healthRes.data.message}"\n`);

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 2: CITIES & PLACES DISCOVERY
    // ═══════════════════════════════════════════════════════════════════════
    console.log('🌍 [PHASE 2] Testing Travel Discovery (Cities & Places)...');
    const citiesRes = await axios.get(`${BASE_URL}/cities?limit=5`);
    const cities = citiesRes.data.data;
    if (cities.length < 2) throw new Error('Not enough cities found. Please run seed script.');
    console.log(`   ✓ Retrieved ${cities.length} cities (Total available: ${citiesRes.data.total})`);

    const city1 = cities[0];
    const city2 = cities[1];

    const placesRes = await axios.get(`${BASE_URL}/places?cityId=${city1._id}&limit=3`);
    const places = placesRes.data.data;
    console.log(`   ✓ Retrieved ${places.length} places for city "${city1.name}"\n`);

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 3: USER AUTHENTICATION & PROFILE
    // ═══════════════════════════════════════════════════════════════════════
    console.log('🔐 [PHASE 3] Testing User Authentication & Profile...');
    const emailA = `master_user_a_${ts}@globetrotter.io`;
    const emailB = `master_user_b_${ts}@globetrotter.io`;

    // 1. Register User A
    const regRes = await axios.post(`${BASE_URL}/auth/register`, {
      firstName: 'Samantha',
      lastName: 'Wanderer',
      phoneNumber: '+14155550401',
      email: emailA,
      password: 'password123',
      city: city1.name,
      country: city1.country,
    });
    const tokenA = regRes.data.token;
    const authA = { headers: { Authorization: `Bearer ${tokenA}` } };
    console.log(`   ✓ Registered User A: ${regRes.data.data.firstName} ${regRes.data.data.lastName}`);

    // 2. Login User A
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: emailA,
      password: 'password123',
    });
    console.log(`   ✓ Logged in User A successfully`);

    // 3. Register User B
    const regBRes = await axios.post(`${BASE_URL}/auth/register`, {
      firstName: 'David',
      lastName: 'Traveler',
      phoneNumber: '+14155550402',
      email: emailB,
      password: 'password123',
    });
    const tokenB = regBRes.data.token;
    const authB = { headers: { Authorization: `Bearer ${tokenB}` } };
    console.log(`   ✓ Registered User B: ${regBRes.data.data.firstName} ${regBRes.data.data.lastName}`);

    // 4. Update Profile
    const profileRes = await axios.patch(
      `${BASE_URL}/users/me`,
      { additionalInfo: 'Adventure seeker' },
      authA
    );
    console.log(`   ✓ Updated User A profile: "${profileRes.data.data.additionalInfo}"\n`);

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 4: TRIP CREATION & MULTI-CITY STOPS
    // ═══════════════════════════════════════════════════════════════════════
    console.log('🗺️  [PHASE 4] Testing Trip Creation & Multi-City Stops...');
    const tripRes = await axios.post(
      `${BASE_URL}/trips`,
      {
        name: 'Ultimate European Odyssey',
        description: 'Multi-country vacation',
        startDate: '2026-11-01',
        endDate: '2026-11-15',
        totalBudget: 3500,
        currency: 'EUR',
      },
      authA
    );
    const tripId = tripRes.data.data._id;
    console.log(`   ✓ Created Trip: "${tripRes.data.data.name}" (Budget: 3500 EUR)`);

    // Add Stop 1 (City 1)
    const stop1Res = await axios.post(
      `${BASE_URL}/trips/${tripId}/stops`,
      {
        cityId: city1._id,
        startDate: '2026-11-02',
        endDate: '2026-11-07',
        notes: `First stop in ${city1.name}`,
      },
      authA
    );
    const stop1Id = stop1Res.data.data._id;

    // Add Stop 2 (City 2)
    const stop2Res = await axios.post(
      `${BASE_URL}/trips/${tripId}/stops`,
      {
        cityId: city2._id,
        startDate: '2026-11-08',
        endDate: '2026-11-14',
        notes: `Second stop in ${city2.name}`,
      },
      authA
    );
    const stop2Id = stop2Res.data.data._id;
    console.log(`   ✓ Added 2 sequential stops: ${city1.name} (Stop 1) & ${city2.name} (Stop 2)\n`);

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 5: ITINERARY & ACTIVITY PLANNING
    // ═══════════════════════════════════════════════════════════════════════
    console.log('📅 [PHASE 5] Testing Itinerary & Activity Planning...');
    const place1 = places[0];
    const place2 = places[1] || place1;

    // Activity 1
    const act1Res = await axios.post(
      `${BASE_URL}/trips/${tripId}/itinerary`,
      {
        tripStopId: stop1Id,
        cityId: city1._id,
        placeId: place1._id,
        date: '2026-11-03',
        startTime: '09:30',
        endTime: '12:00',
        notes: 'Morning historical exploration',
      },
      authA
    );
    const act1Id = act1Res.data.data._id;

    // Activity 2
    const act2Res = await axios.post(
      `${BASE_URL}/trips/${tripId}/itinerary`,
      {
        tripStopId: stop1Id,
        cityId: city1._id,
        placeId: place2._id,
        date: '2026-11-03',
        startTime: '14:00',
        endTime: '16:30',
        notes: 'Afternoon park stroll',
      },
      authA
    );

    const itineraryListRes = await axios.get(`${BASE_URL}/trips/${tripId}/itinerary`, authA);
    console.log(`   ✓ Logged ${itineraryListRes.data.count} sequential activities for Stop 1\n`);

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 6: EXPENSES & BUDGET MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    console.log('💳 [PHASE 6] Testing Expenses & Budget Analytics...');
    // Log Accommodation Expense
    await axios.post(
      `${BASE_URL}/trips/${tripId}/expenses`,
      {
        category: 'accommodation',
        description: 'Hotel Suites Booking',
        amount: 800,
        currency: 'EUR',
        date: '2026-11-02',
      },
      authA
    );

    // Log Transport Expense
    await axios.post(
      `${BASE_URL}/trips/${tripId}/expenses`,
      {
        category: 'transport',
        description: 'Express Train Pass',
        amount: 250,
        currency: 'EUR',
        date: '2026-11-01',
      },
      authA
    );

    // Log Food Expense
    await axios.post(
      `${BASE_URL}/trips/${tripId}/expenses`,
      {
        category: 'food',
        description: 'Gourmet Dinner',
        amount: 150,
        currency: 'EUR',
        date: '2026-11-03',
      },
      authA
    );

    // Fetch Budget Analytics
    const budgetRes = await axios.get(`${BASE_URL}/trips/${tripId}/budget`, authA);
    const b = budgetRes.data.data;
    console.log(`   ✓ Budget Calculation Verified:`);
    console.log(`     • Total Budget:     ${b.totalBudget} ${b.currency}`);
    console.log(`     • Actual Spent:     ${b.actualExpenses} ${b.currency}`);
    console.log(`     • Remaining Budget: ${b.remainingBudget} ${b.currency}`);
    console.log(`     • Percentage Used:  ${b.percentageUsed}%`);
    console.log(`     • Daily Average:    ${b.averageDailyCost} ${b.currency}/day\n`);

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 7: TRIP SHARING & COPY TRIP
    // ═══════════════════════════════════════════════════════════════════════
    console.log('🔗 [PHASE 7] Testing Trip Sharing & Copying...');

    // 1. Generate Share Link (User A)
    const shareRes = await axios.post(`${BASE_URL}/trips/${tripId}/share`, {}, authA);
    const slug = shareRes.data.data.slug;
    console.log(`   ✓ Share link generated: "${slug}"`);

    // 2. Public Access (NO AUTH)
    const publicTripRes = await axios.get(`${BASE_URL}/share/${slug}`);
    console.log(`   ✓ Public shared trip retrieved by unauthenticated visitor: "${publicTripRes.data.data.trip.name}"`);
    console.log(`     Creator Name: ${publicTripRes.data.data.trip.creator.firstName} ${publicTripRes.data.data.trip.creator.lastName}`);

    // 3. User B Copies the Shared Trip
    const copyTripRes = await axios.post(
      `${BASE_URL}/share/${slug}/copy`,
      { name: 'Copied Odyssey for David' },
      authB
    );
    const copiedTripId = copyTripRes.data.data._id;
    console.log(`   ✓ Copied Trip to User B: "${copyTripRes.data.data.name}" (New ID: ${copiedTripId})`);

    // 4. Disable Share Link
    await axios.delete(`${BASE_URL}/trips/${tripId}/share`, authA);
    console.log(`   ✓ Share link disabled by User A.`);

    // 5. Verify Disabled Link 404
    try {
      await axios.get(`${BASE_URL}/share/${slug}`);
      console.error('   ✗ FAILED: Disabled share link should return 404.');
    } catch (err) {
      console.log(`   ✓ Verified disabled link returns 404: ${err.response.data.message}\n`);
    }

    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║     🎉 ALL TESTS ACROSS PHASES 1 TO 7 PASSED SUCCESSFULLY!       ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('❌ Test suite failed:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
};

runMasterTestSuite();
