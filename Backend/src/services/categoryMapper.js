/**
 * Maps raw Geoapify category strings to our standardized Place categories.
 */
const CATEGORY_MAPPING = {
  'tourism.attraction': 'Tourist attraction',
  'tourism.sights': 'Tourist attraction',
  'tourism.sights.place_of_worship': 'Tourist attraction',
  'entertainment.museum': 'Museum',
  'building.historic': 'Landmark',
  'building.historic.monument': 'Landmark',
  'building.historic.ruins': 'Landmark',
  'building.historic.castle': 'Landmark',
  'leisure.park': 'Park',
  'natural.forest': 'Park',
  'leisure.playground': 'Park',
  'sport': 'Activity',
};

/**
 * Returns a standardized category string from a Geoapify categories array,
 * or null if no mapping is found.
 *
 * @param {string[]} categories - Raw Geoapify category strings
 * @returns {string|null}
 */
export const getStandardizedCategory = (categories) => {
  if (!categories || !Array.isArray(categories)) return null;

  // Exact match first
  for (const cat of categories) {
    if (CATEGORY_MAPPING[cat]) return CATEGORY_MAPPING[cat];
  }

  // Partial match fallback
  for (const cat of categories) {
    if (cat.startsWith('tourism.')) return 'Tourist attraction';
    if (cat.includes('museum')) return 'Museum';
    if (cat.includes('historic') || cat.includes('monument')) return 'Landmark';
    if (cat.includes('park') || cat.startsWith('natural.')) return 'Park';
    if (cat.startsWith('sport.') || cat.startsWith('leisure.')) return 'Activity';
  }

  return null;
};

/**
 * The set of Geoapify API category strings we query for place discovery.
 */
export const GEOAPIFY_CATEGORIES = [
  'tourism.attraction',
  'entertainment.museum',
  'building.historic',
  'tourism.sights',
  'leisure.park',
  'natural.forest',
  'leisure.playground',
  'sport',
];
