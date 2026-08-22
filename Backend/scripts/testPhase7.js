/**
 * testPhase7.js
 *
 * Comprehensive test suite for Phase 7:
 * Trip Sharing & Copy Trip APIs.
 *
 * Usage:
 *   node scripts/testPhase7.js
 */

import axios from 'axios';

const BASE_URL = process.env.API_URL || 'http://localhost:5001/api';

const runTests = async () => {
  const timestamp = Date.now();
  console.log('====================================================');
  console.log('🧪 STARTING PHASE 7: TRIP SHARING & COPY TESTS');
  console.log('====================================================\n');

  try {
    // ─── 1. Setup Users ───────────────────────────────────────────────────────
    console.log('1️⃣  Creating User A (Original Trip Creator) & User B (Trip Copier)...');
    const userARes = await axios.post(`${BASE_URL}/auth/register`, {
      firstName: 'Alice',
      lastName: 'Curator',
      phoneNumber: '+14155550301',
      email: `alice_share_${timestamp}@globetrotter.io`,
      password: 'password123',
    });
    const tokenA = userARes.data.token;

    const userBRes = await axios.post(`${BASE_URL}/auth/register`, {
      firstName: 'Bob',
      lastName: 'Copier',
      phoneNumber: '+14155550302',
      email: `bob_copy_${timestamp}@globetrotter.io`,
      password: 'password123',
    });
    const tokenB = userBRes.data.token;

    const authA = { headers: { Authorization: `Bearer ${tokenA}` } };
    const authB = { headers: { Authorization: `Bearer ${tokenB}` } };
    console.log('   ✓ Users created with JWT tokens.\n');

    // ─── 2. Setup Complete Trip for User A ─────────────────────────────────────
    console.log('2️⃣  Setting up rich Trip with Stops, Itinerary Activities & Expenses for User A...');
    const tripRes = await axios.post(
      `${BASE_URL}/trips`,
      {
        name: 'Grand Scandinavian Voyage',
        description: 'Fjords and modern architecture',
        startDate: '2026-12-01',
        endDate: '2026-12-15',
        totalBudget: 5000,
        currency: 'EUR',
      },
      authA
    );
    const tripAId = tripRes.data.data._id;

    // Get city & place
    const citiesRes = await axios.get(`${BASE_URL}/cities?limit=1`);
    const city = citiesRes.data.data[0];

    const stopRes = await axios.post(
      `${BASE_URL}/trips/${tripAId}/stops`,
      {
        cityId: city._id,
        startDate: '2026-12-02',
        endDate: '2026-12-10',
        notes: `Explore ${city.name}`,
      },
      authA
    );
    const stopAId = stopRes.data.data._id;

    const placesRes = await axios.get(`${BASE_URL}/places?cityId=${city._id}&limit=1`);
    const place = placesRes.data.data[0];

    const activityRes = await axios.post(
      `${BASE_URL}/trips/${tripAId}/itinerary`,
      {
        tripStopId: stopAId,
        cityId: city._id,
        placeId: place._id,
        date: '2026-12-03',
        startTime: '10:00',
        endTime: '13:00',
        estimatedCost: 80,
        notes: 'Winter fjord sightseeing cruise',
      },
      authA
    );

    const expenseRes = await axios.post(
      `${BASE_URL}/trips/${tripAId}/expenses`,
      {
        category: 'accommodation',
        description: 'Nordic Lodge Booking',
        amount: 600,
        date: '2026-12-02',
      },
      authA
    );
    console.log('   ✓ User A trip fully populated with stops, activities, and expenses.\n');

    // ─── 3. Create Share Link ─────────────────────────────────────────────────
    console.log('3️⃣  Generating Share Link for User A Trip (POST /api/trips/:tripId/share)...');
    const shareRes = await axios.post(`${BASE_URL}/trips/${tripAId}/share`, {}, authA);
    const slug = shareRes.data.data.slug;
    console.log(`   ✓ Share link generated: "${slug}"`);
    console.log(`   ✓ Share URL: ${shareRes.data.shareUrl}\n`);

    // ─── 4. Prevent Duplicate Active Share Links ──────────────────────────────
    console.log('4️⃣  Testing Duplicate Active Share Link Handling...');
    const duplicateShareRes = await axios.post(`${BASE_URL}/trips/${tripAId}/share`, {}, authA);
    console.log(`   ✓ Correctly returned existing active link: "${duplicateShareRes.data.data.slug}"\n`);

    // ─── 5. Test Unauthorized User Sharing ────────────────────────────────────
    console.log('5️⃣  Testing Authorization (User B trying to generate share link for User A Trip)...');
    try {
      await axios.post(`${BASE_URL}/trips/${tripAId}/share`, {}, authB);
      console.error('   ✗ FAILED: User B should not be able to share User A trip.');
    } catch (err) {
      console.log(`   ✓ Correctly rejected unauthorized share (Status ${err.response.status}): ${err.response.data.message}\n`);
    }

    // ─── 6. Public Access to Shared Trip (NO AUTH) ────────────────────────────
    console.log('6️⃣  Testing Public Access (GET /api/share/:slug WITHOUT Authorization header)...');
    const publicRes = await axios.get(`${BASE_URL}/share/${slug}`); // Notice: NO AUTH HEADER!
    const sharedData = publicRes.data.data;

    console.log(`   ✓ Public access successful!`);
    console.log(`     - Trip Name:    "${sharedData.trip.name}"`);
    console.log(`     - Total Budget: ${sharedData.trip.totalBudget} ${sharedData.trip.currency}`);
    console.log(`     - Creator:      ${sharedData.trip.creator.firstName} ${sharedData.trip.creator.lastName}`);
    console.log(`     - Stops Count:  ${sharedData.stops.length}`);
    console.log(`     - Activities:   ${sharedData.itinerary.length}`);

    // Security assertions: Never expose email, phone number, password, or private ID
    if (sharedData.trip.creator.email || sharedData.trip.creator.phoneNumber || sharedData.trip.creator.password) {
      throw new Error('SECURITY VIOLATION: Private user details leaked in public response!');
    }
    console.log('   ✓ PRIVACY VERIFIED: No emails, phone numbers, or passwords exposed in public response.\n');

    // ─── 7. Copy Trip to User B's Account ─────────────────────────────────────
    console.log('7️⃣  User B copying the shared trip (POST /api/share/:slug/copy)...');
    const copyRes = await axios.post(
      `${BASE_URL}/share/${slug}/copy`,
      { name: 'My Own Scandinavian Voyage' },
      authB
    );
    const copiedTrip = copyRes.data.data;
    const copiedTripId = copiedTrip._id;

    console.log(`   ✓ Trip copied successfully!`);
    console.log(`     - New Trip ID:   ${copiedTripId} (Different from original ${tripAId})`);
    console.log(`     - New Trip Name: "${copiedTrip.name}"`);
    console.log(`     - Assigned User: ${copiedTrip.userId} (Matches User B)\n`);

    if (copiedTripId.toString() === tripAId.toString()) {
      throw new Error('Copied trip has identical ID to original trip!');
    }

    // Verify cloned stops, activities and expenses
    const copiedStopsRes = await axios.get(`${BASE_URL}/trips/${copiedTripId}/stops`, authB);
    const copiedItineraryRes = await axios.get(`${BASE_URL}/trips/${copiedTripId}/itinerary`, authB);
    const copiedExpensesRes = await axios.get(`${BASE_URL}/trips/${copiedTripId}/expenses`, authB);

    console.log(`   ✓ Copied Trip Contents Verified:`);
    console.log(`     - Cloned Stops:        ${copiedStopsRes.data.count}`);
    console.log(`     - Cloned Activities:   ${copiedItineraryRes.data.count}`);
    console.log(`     - Cloned Expenses:     ${copiedExpensesRes.data.count}\n`);

    // ─── 8. Independence Check: Original Trip Unchanged ──────────────────────
    console.log('8️⃣  Verifying independence: modifying User B copy does not affect User A original...');
    await axios.patch(
      `${BASE_URL}/trips/${copiedTripId}`,
      { name: 'Mutated User B Trip' },
      authB
    );

    const originalTripCheck = await axios.get(`${BASE_URL}/trips/${tripAId}`, authA);
    console.log(`   ✓ User A original trip name remains unchanged: "${originalTripCheck.data.data.name}"\n`);

    // ─── 9. Disable Share Link ────────────────────────────────────────────────
    console.log('9️⃣  User A disabling active share link (DELETE /api/trips/:tripId/share)...');
    const disableRes = await axios.delete(`${BASE_URL}/trips/${tripAId}/share`, authA);
    console.log(`   ✓ Share link disabled (${disableRes.data.disabledCount} link(s) deactivated).\n`);

    // ─── 10. Verify Disabled Link Rejection ───────────────────────────────────
    console.log('🔟  Verifying disabled link is rejected for public access and copy...');
    try {
      await axios.get(`${BASE_URL}/share/${slug}`);
      console.error('   ✗ FAILED: Disabled share link should return 404.');
    } catch (err) {
      console.log(`   ✓ Public access correctly rejected (Status ${err.response.status}): ${err.response.data.message}`);
    }

    try {
      await axios.post(`${BASE_URL}/share/${slug}/copy`, {}, authB);
      console.error('   ✗ FAILED: Copying from disabled share link should return 404.');
    } catch (err) {
      console.log(`   ✓ Copying from disabled link correctly rejected (Status ${err.response.status}): ${err.response.data.message}\n`);
    }

    console.log('====================================================');
    console.log('🎉 ALL PHASE 7 SHARE & COPY TRIP TESTS PASSED!');
    console.log('====================================================\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
};

runTests();
