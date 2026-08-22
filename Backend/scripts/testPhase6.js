/**
 * testPhase6.js
 *
 * Comprehensive end-to-end test suite for Phase 6:
 * Expenses & Budget Management APIs.
 *
 * Usage:
 *   node scripts/testPhase6.js
 */

import axios from 'axios';

const BASE_URL = process.env.API_URL || 'http://localhost:5001/api';

const runTests = async () => {
  const timestamp = Date.now();
  console.log('====================================================');
  console.log('🧪 STARTING PHASE 6: EXPENSES & BUDGET TESTS');
  console.log('====================================================\n');

  try {
    // ─── 1. Setup Users ───────────────────────────────────────────────────────
    console.log('1️⃣  Creating User A (Owner) and User B (Unauthorized)...');
    const userARes = await axios.post(`${BASE_URL}/auth/register`, {
      firstName: 'Alice',
      lastName: 'Finances',
      phoneNumber: '+14155550201',
      email: `alice_budget_${timestamp}@globetrotter.io`,
      password: 'password123',
    });
    const tokenA = userARes.data.token;

    const userBRes = await axios.post(`${BASE_URL}/auth/register`, {
      firstName: 'Bob',
      lastName: 'Intruder',
      phoneNumber: '+14155550202',
      email: `bob_budget_${timestamp}@globetrotter.io`,
      password: 'password123',
    });
    const tokenB = userBRes.data.token;

    const authA = { headers: { Authorization: `Bearer ${tokenA}` } };
    const authB = { headers: { Authorization: `Bearer ${tokenB}` } };
    console.log('   ✓ Users created with JWT tokens.\n');

    // ─── 2. Setup Trip with 1000 EUR Budget ────────────────────────────────────
    console.log('2️⃣  Creating 10-day Trip for User A (Budget: 1000 EUR, 2026-11-01 to 2026-11-10)...');
    const tripRes = await axios.post(
      `${BASE_URL}/trips`,
      {
        name: 'Autumn Budget Explorer',
        description: 'Testing expenses and budgeting',
        startDate: '2026-11-01',
        endDate: '2026-11-10',
        totalBudget: 1000,
        currency: 'EUR',
      },
      authA
    );
    const tripId = tripRes.data.data._id;
    console.log(`   ✓ Trip created: ID ${tripId}, Budget: 1000 EUR\n`);

    // Get a city and place to add a stop & activity
    const citiesRes = await axios.get(`${BASE_URL}/cities?limit=1`);
    const city = citiesRes.data.data[0];

    const stopRes = await axios.post(
      `${BASE_URL}/trips/${tripId}/stops`,
      {
        cityId: city._id,
        startDate: '2026-11-02',
        endDate: '2026-11-08',
      },
      authA
    );
    const stopId = stopRes.data.data._id;

    const placesRes = await axios.get(`${BASE_URL}/places?cityId=${city._id}&limit=1`);
    const place = placesRes.data.data[0];

    // Add 1 Planned Itinerary Activity with estimatedCost: 50
    const activityRes = await axios.post(
      `${BASE_URL}/trips/${tripId}/itinerary`,
      {
        tripStopId: stopId,
        cityId: city._id,
        placeId: place._id,
        date: '2026-11-03',
        startTime: '10:00',
        endTime: '12:30',
        estimatedCost: 50,
        notes: 'Planned castle museum tour',
      },
      authA
    );
    const itineraryItemId = activityRes.data.data._id;
    console.log(`   ✓ Itinerary item added with planned cost: 50 EUR\n`);

    // ─── 3. Validation Tests ──────────────────────────────────────────────────
    console.log('3️⃣  Testing Expense Validations...');

    // A. Invalid Category
    try {
      await axios.post(
        `${BASE_URL}/trips/${tripId}/expenses`,
        {
          category: 'invalid_category',
          description: 'Shopping',
          amount: 50,
          date: '2026-11-02',
        },
        authA
      );
      console.error('   ✗ FAILED: Should have rejected invalid category.');
    } catch (err) {
      console.log(`   ✓ Correctly rejected invalid category (Status ${err.response.status}): ${err.response.data.message}`);
    }

    // B. Negative / Zero Amount
    try {
      await axios.post(
        `${BASE_URL}/trips/${tripId}/expenses`,
        {
          category: 'food',
          description: 'Dinner',
          amount: -25,
          date: '2026-11-02',
        },
        authA
      );
      console.error('   ✗ FAILED: Should have rejected negative amount.');
    } catch (err) {
      console.log(`   ✓ Correctly rejected negative amount (Status ${err.response.status}): ${err.response.data.message}`);
    }

    // C. Date Outside Trip Window
    try {
      await axios.post(
        `${BASE_URL}/trips/${tripId}/expenses`,
        {
          category: 'food',
          description: 'Dinner',
          amount: 40,
          date: '2026-11-20', // Outside trip window (Nov 1 - Nov 10)
        },
        authA
      );
      console.error('   ✗ FAILED: Should have rejected date outside trip window.');
    } catch (err) {
      console.log(`   ✓ Correctly rejected date outside trip (Status ${err.response.status}): ${err.response.data.message}`);
    }
    console.log('');

    // ─── 4. Log Valid Expenses ────────────────────────────────────────────────
    console.log('4️⃣  Logging 4 valid expenses across categories...');
    const exp1Res = await axios.post(
      `${BASE_URL}/trips/${tripId}/expenses`,
      {
        category: 'accommodation',
        description: 'Boutique Hotel Booking',
        amount: 400,
        currency: 'EUR',
        date: '2026-11-02',
      },
      authA
    );
    const exp1Id = exp1Res.data.data._id;

    const exp2Res = await axios.post(
      `${BASE_URL}/trips/${tripId}/expenses`,
      {
        category: 'transport',
        description: 'Train Tickets',
        amount: 150,
        currency: 'EUR',
        date: '2026-11-01',
      },
      authA
    );

    const exp3Res = await axios.post(
      `${BASE_URL}/trips/${tripId}/expenses`,
      {
        category: 'food',
        description: 'Local Dinner',
        amount: 80,
        currency: 'EUR',
        date: '2026-11-03',
      },
      authA
    );
    const exp3Id = exp3Res.data.data._id;

    const exp4Res = await axios.post(
      `${BASE_URL}/trips/${tripId}/expenses`,
      {
        category: 'activity',
        description: 'Museum Entry Tickets',
        amount: 60,
        currency: 'EUR',
        date: '2026-11-04',
        itineraryItemId,
      },
      authA
    );

    console.log('   ✓ Logged: accommodation (400), transport (150), food (80), activity (60).\n');

    // ─── 5. Update Expense ────────────────────────────────────────────────────
    console.log('5️⃣  Updating Expense 3 (Food: $80 -> $120)...');
    const updateExpRes = await axios.patch(
      `${BASE_URL}/expenses/${exp3Id}`,
      {
        amount: 120,
        notes: 'Includes drinks and dessert',
      },
      authA
    );
    console.log(`   ✓ Expense updated! New amount: ${updateExpRes.data.data.amount} EUR\n`);

    // ─── 6. Query Expenses with Filter ────────────────────────────────────────
    console.log('6️⃣  Querying expenses with category filter (?category=food)...');
    const filteredExpRes = await axios.get(`${BASE_URL}/trips/${tripId}/expenses?category=food`, authA);
    console.log(`   ✓ Returned ${filteredExpRes.data.count} food expense(s): "${filteredExpRes.data.data[0].description}" (${filteredExpRes.data.data[0].amount} EUR)\n`);

    // ─── 7. Test Budget Analytics (Under Budget) ──────────────────────────────
    console.log('7️⃣  Fetching Budget Analytics (GET /api/trips/:tripId/budget)...');
    const budgetRes1 = await axios.get(`${BASE_URL}/trips/${tripId}/budget`, authA);
    const b1 = budgetRes1.data.data;

    console.log('   📊 Budget Analytics Result:');
    console.log(`     - Total Budget:            ${b1.totalBudget} ${b1.currency}`);
    console.log(`     - Actual Expenses:         ${b1.actualExpenses} ${b1.currency} (Expected: 400 + 150 + 120 + 60 = 730)`);
    console.log(`     - Planned Activity Costs:  ${b1.plannedActivityCosts} ${b1.currency} (Expected: 50)`);
    console.log(`     - Estimated Total:         ${b1.estimatedTotal} ${b1.currency} (Expected: 780)`);
    console.log(`     - Remaining Budget:        ${b1.remainingBudget} ${b1.currency} (Expected: 270)`);
    console.log(`     - Percentage Used:         ${b1.percentageUsed}% (Expected: 73%)`);
    console.log(`     - Average Daily Cost:      ${b1.averageDailyCost} ${b1.currency}/day (10 days -> 73/day)`);
    console.log(`     - Is Over Budget:          ${b1.isOverBudget} (Expected: false)`);
    console.log('     - Category Breakdown:');
    for (const [cat, data] of Object.entries(b1.categoryBreakdown)) {
      console.log(`       • ${cat.padEnd(14)}: ${data.total} EUR (${data.percentage}%, ${data.count} items)`);
    }
    console.log('');

    if (b1.actualExpenses !== 730 || b1.remainingBudget !== 270 || b1.isOverBudget !== false) {
      throw new Error('Budget calculation mismatch in Under-Budget scenario.');
    }

    // ─── 8. Test Over-Budget Detection ────────────────────────────────────────
    console.log('8️⃣  Testing Over-Budget Detection (Adding 350 EUR miscellaneous expense -> total 1080 EUR)...');
    const exp5Res = await axios.post(
      `${BASE_URL}/trips/${tripId}/expenses`,
      {
        category: 'miscellaneous',
        description: 'Luxury Souvenirs & Gifts',
        amount: 350,
        date: '2026-11-05',
      },
      authA
    );
    const exp5Id = exp5Res.data.data._id;

    const budgetRes2 = await axios.get(`${BASE_URL}/trips/${tripId}/budget`, authA);
    const b2 = budgetRes2.data.data;

    console.log(`     - Total Budget:       ${b2.totalBudget} ${b2.currency}`);
    console.log(`     - Actual Expenses:    ${b2.actualExpenses} ${b2.currency} (1080 EUR)`);
    console.log(`     - Percentage Used:    ${b2.percentageUsed}% (108%)`);
    console.log(`     - Is Over Budget:     ${b2.isOverBudget} (Expected: true)`);
    console.log(`     - Over Budget Amount: ${b2.overBudgetAmount} ${b2.currency} (Expected: 80 EUR)\n`);

    if (b2.isOverBudget !== true || b2.overBudgetAmount !== 80) {
      throw new Error('Over-budget status calculation mismatch.');
    }

    // ─── 9. Test Unauthorized Access ──────────────────────────────────────────
    console.log('9️⃣  Testing Security & Ownership (User B attempting to view / modify expenses)...');
    try {
      await axios.get(`${BASE_URL}/trips/${tripId}/budget`, authB);
      console.error('   ✗ FAILED: User B should not view User A budget.');
    } catch (err) {
      console.log(`   ✓ Blocked User B from viewing budget (Status ${err.response.status}): ${err.response.data.message}`);
    }

    try {
      await axios.delete(`${BASE_URL}/expenses/${exp1Id}`, authB);
      console.error('   ✗ FAILED: User B should not delete User A expense.');
    } catch (err) {
      console.log(`   ✓ Blocked User B from deleting expense (Status ${err.response.status}): ${err.response.data.message}`);
    }
    console.log('');

    // ─── 10. Delete Expense & Recalculate ──────────────────────────────────────
    console.log('🔟 Deleting the 350 EUR expense and verifying budget recovery...');
    await axios.delete(`${BASE_URL}/expenses/${exp5Id}`, authA);

    const budgetRes3 = await axios.get(`${BASE_URL}/trips/${tripId}/budget`, authA);
    const b3 = budgetRes3.data.data;
    console.log(`   ✓ Expense deleted. Actual expenses back to: ${b3.actualExpenses} EUR`);
    console.log(`   ✓ Is Over Budget: ${b3.isOverBudget} (Expected: false), Remaining: ${b3.remainingBudget} EUR\n`);

    console.log('====================================================');
    console.log('🎉 ALL PHASE 6 EXPENSE & BUDGET TESTS PASSED!');
    console.log('====================================================\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
};

runTests();
