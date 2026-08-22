/**
 * Map of Geoapify categories to our project's standardized categories.
 */
const CATEGORY_MAPPING = {
  'tourism.attraction': 'Tourist attraction',
  'entertainment.museum': 'Museum',
  'building.historic': 'Landmark',
  'tourism.sights': 'Landmark',
  'leisure.park': 'Park',
  'natural.forest': 'Park',
  'leisure.playground': 'Activity',
  'sport': 'Activity',
  'entertainment.culture': 'Activity'
};

/**
 * Standardizes a Geoapify place's categories into one of our predefined enum values:
 * 'Tourist attraction', 'Museum', 'Landmark', 'Park', 'Activity'.
 * 
 * @param {Array<string>} categories - Array of category strings returned by Geoapify
 * @returns {string|null} - Standardized category or null if no mapping found
 */
export const getStandardizedCategory = (categories) => {
  if (!categories || !Array.isArray(categories)) return null;
  
  // Find the first category in the array that matches our mapping
  for (const category of categories) {
    if (CATEGORY_MAPPING[category]) {
      return CATEGORY_MAPPING[category];
    }
  }

  // Fallback mappings using partial matches if exact match is not found
  for (const category of categories) {
    if (category.startsWith('tourism.')) return 'Tourist attraction';
    if (category.includes('museum')) return 'Museum';
    if (category.includes('historic') || category.includes('monument')) return 'Landmark';
    if (category.includes('park') || category.startsWith('natural.')) return 'Park';
    if (category.startsWith('sport.') || category.startsWith('leisure.')) return 'Activity';
  }

  return null;
};

/**
 * The query categories to request from the Geoapify API.
 */
export const GEOAPIFY_CATEGORIES = [
  'tourism.attraction',
  'entertainment.museum',
  'building.historic',
  'tourism.sights',
  'leisure.park',
  'natural.forest',
  'leisure.playground',
  'sport'
];
