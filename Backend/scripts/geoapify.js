import axios from 'axios';

// Get API key from environment variables
const API_KEY = process.env.GEOPIFY_API;

if (!API_KEY) {
  console.warn("WARNING: GEOPIFY_API key is not defined in your environment variables.");
}

/**
 * Executes an Axios request with retry logic (exponential backoff) for handling rate limits (429) or transient network errors.
 * 
 * @param {object} config - Axios request config object
 * @param {number} retries - Number of remaining retries (defaults to 3)
 * @param {number} delay - Base delay in milliseconds (defaults to 1000ms)
 * @returns {Promise<any>} - Axios response data
 */
const requestWithRetry = async (config, retries = 3, delay = 1000) => {
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    const isRateLimit = error.response && error.response.status === 429;
    const isServerError = error.response && error.response.status >= 500;
    
    if ((isRateLimit || isServerError) && retries > 0) {
      console.warn(`Geoapify API request failed (${error.response.status}). Retrying in ${delay}ms... (Retries left: ${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return requestWithRetry(config, retries - 1, delay * 2);
    }
    throw error;
  }
};

/**
 * Geocodes a city name and country name to retrieve its geographic details.
 * 
 * @param {string} cityName - Name of the city
 * @param {string} countryName - Name of the country
 * @returns {Promise<object>} - Cleaned object containing name, country, region, lat, lon
 */
export const geocodeCity = async (cityName, countryName) => {
  const query = `${cityName}, ${countryName}`;
  const config = {
    method: 'get',
    url: 'https://api.geoapify.com/v1/geocode/search',
    params: {
      text: query,
      apiKey: API_KEY,
      limit: 1
    }
  };

  try {
    const data = await requestWithRetry(config);
    
    if (!data.features || data.features.length === 0) {
      throw new Error(`No geocoding results found for "${query}"`);
    }

    const properties = data.features[0].properties;
    const coordinates = data.features[0].geometry.coordinates; // [lon, lat]

    return {
      name: properties.city || cityName,
      country: properties.country || countryName,
      region: properties.state || properties.region || null,
      latitude: coordinates[1],
      longitude: coordinates[0]
    };
  } catch (error) {
    console.error(`Geocoding error for "${query}":`, error.message);
    throw error;
  }
};

/**
 * Fetches places in specified categories within a certain radius of coordinates.
 * 
 * @param {number} latitude - Center latitude
 * @param {number} longitude - Center longitude
 * @param {Array<string>} categories - List of categories to query
 * @param {number} limit - Maximum number of places to return (default 20)
 * @param {number} radiusMeters - Circle search radius in meters (default 10000m / 10km)
 * @returns {Promise<Array<object>>} - Raw places features list from Geoapify
 */
export const getPlacesByCategory = async (latitude, longitude, categories, limit = 20, radiusMeters = 10000) => {
  const categoriesParam = categories.join(',');
  const filterParam = `circle:${longitude},${latitude},${radiusMeters}`;
  
  const config = {
    method: 'get',
    url: 'https://api.geoapify.com/v2/places',
    params: {
      categories: categoriesParam,
      filter: filterParam,
      limit: limit,
      apiKey: API_KEY
    }
  };

  try {
    const data = await requestWithRetry(config);
    return data.features || [];
  } catch (error) {
    console.error(`Places fetching error for coordinates [${latitude}, ${longitude}]:`, error.message);
    throw error;
  }
};
