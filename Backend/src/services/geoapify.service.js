import axios from 'axios';

// Reads API key at call-time so dotenv has already loaded
const getApiKey = () => {
  const key = process.env.GEOAPIFY_API || process.env.GEOPIFY_API;
  if (!key) {
    console.warn('[Geoapify] WARNING: GEOAPIFY_API key is not set in environment variables.');
  }
  return key;
};

/**
 * Axios request with retry + exponential backoff.
 * Retries on 429 (rate-limit) and 5xx server errors.
 */
const requestWithRetry = async (config, retries = 3, delay = 1000) => {
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const isRateLimit = status === 429;
    const isServerError = status >= 500;

    if ((isRateLimit || isServerError) && retries > 0) {
      console.warn(`[Geoapify] Request failed (${status}). Retrying in ${delay}ms... (${retries} left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return requestWithRetry(config, retries - 1, delay * 2);
    }
    throw error;
  }
};

/**
 * Geocode a city name+country to get coordinates and region details.
 *
 * @param {string} cityName
 * @param {string} countryName
 * @returns {Promise<{ name, country, region, latitude, longitude }>}
 */
export const geocodeCity = async (cityName, countryName) => {
  const query = countryName ? `${cityName}, ${countryName}` : cityName;

  const data = await requestWithRetry({
    method: 'get',
    url: 'https://api.geoapify.com/v1/geocode/search',
    params: { text: query, apiKey: getApiKey(), limit: 1 },
  });

  if (!data.features || data.features.length === 0) {
    throw new Error(`No geocoding results found for "${query}"`);
  }

  const props = data.features[0].properties;
  const [lon, lat] = data.features[0].geometry.coordinates;

  return {
    name: props.city || cityName,
    country: props.country || countryName,
    region: props.state || props.region || null,
    latitude: lat,
    longitude: lon,
  };
};

/**
 * Fetch places from Geoapify Places API within a radius of given coordinates.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @param {string[]} categories  - Geoapify category strings
 * @param {number} limit         - Max results (default 20)
 * @param {number} radiusMeters  - Search radius (default 10 km)
 * @returns {Promise<object[]>}  - Raw GeoJSON features array
 */
export const getPlacesByCategory = async (
  latitude,
  longitude,
  categories,
  limit = 20,
  radiusMeters = 10000
) => {
  const data = await requestWithRetry({
    method: 'get',
    url: 'https://api.geoapify.com/v2/places',
    params: {
      categories: categories.join(','),
      filter: `circle:${longitude},${latitude},${radiusMeters}`,
      limit,
      apiKey: getApiKey(),
    },
  });

  return data.features || [];
};
