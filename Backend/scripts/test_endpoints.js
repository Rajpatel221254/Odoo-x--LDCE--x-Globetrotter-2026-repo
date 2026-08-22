import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

async function runTests() {
  console.log('--- STARTING API VERIFICATION TESTS ---');

  try {
    // 1. Health check
    console.log('\n[1/7] Testing health check...');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    console.log('Health check response:', JSON.stringify(healthRes.data, null, 2));

    // 2. Fetch cities
    console.log('\n[2/7] Testing cities list...');
    const citiesRes = await axios.get(`${BASE_URL}/cities?limit=2`);
    console.log('Cities list sample shape:', JSON.stringify(citiesRes.data, null, 2));

    // 3. Resolve a city by ID
    const sampleCity = citiesRes.data.data[0];
    if (sampleCity) {
      console.log(`\n[3/7] Testing get city by ID: ${sampleCity._id} (${sampleCity.name})...`);
      const cityByIdRes = await axios.get(`${BASE_URL}/cities/${sampleCity._id}`);
      console.log('Get city response shape:', JSON.stringify(cityByIdRes.data, null, 2));
    }

    // 4. Fetch places for sample city
    if (sampleCity) {
      console.log(`\n[4/7] Testing get places for city: ${sampleCity.name}...`);
      const placesRes = await axios.get(`${BASE_URL}/places?cityId=${encodeURIComponent(sampleCity.name)}&limit=2`);
      console.log('Places response shape:', JSON.stringify(placesRes.data, null, 2));
    }

    // 5. Test Register / Login (Auth flow)
    console.log('\n[5/7] Testing auth flow...');
    const testEmail = `testuser_${Date.now()}@example.com`;
    const registerPayload = {
      firstName: 'Integration',
      lastName: 'Tester',
      phoneNumber: '+14155552671',
      email: testEmail,
      password: 'password123',
      city: 'San Francisco',
      country: 'United States'
    };

    console.log('Registering user...');
    const registerRes = await axios.post(`${BASE_URL}/auth/register`, registerPayload);
    console.log('Register response shape:', JSON.stringify(registerRes.data, null, 2));
    const token = registerRes.data.token;

    // 6. Test GET /auth/me with Bearer token
    console.log('\n[6/7] Testing GET /auth/me (authenticated)...');
    const meRes = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('GET /auth/me response shape:', JSON.stringify(meRes.data, null, 2));

    // 7. Test Trip Creation and Fetching
    if (sampleCity) {
      console.log('\n[7/7] Testing trip creation & list...');
      const tripPayload = {
        name: 'Summer Adventure',
        description: 'Testing trip integration',
        startDate: '2026-08-01',
        endDate: '2026-08-10',
        totalBudget: 1500,
        currency: 'USD',
        status: 'planning'
      };

      console.log('Creating a trip...');
      const createTripRes = await axios.post(`${BASE_URL}/trips`, tripPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Create trip response shape:', JSON.stringify(createTripRes.data, null, 2));

      console.log('Fetching all trips...');
      const tripsListRes = await axios.get(`${BASE_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Trips list response shape:', JSON.stringify(tripsListRes.data, null, 2));
    }

    console.log('\n✅ ALL API TESTS COMPLETED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ API Test failed:', error.response ? {
      status: error.response.status,
      data: error.response.data
    } : error.message);
  }
}

runTests();
