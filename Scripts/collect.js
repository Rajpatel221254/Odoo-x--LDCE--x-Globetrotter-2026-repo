/**
 * fetch_geoapify_dataset.js
 *
 * Builds a rich per-country dataset of tourism-related places using the
 * Geoapify Geocoding API + Places API + Place Details API.
 *
 * IMPORTANT FIX vs earlier version:
 * Geoapify's Places API `filter` parameter only accepts:
 *   circle | rect | geometry | place
 * There is NO `countrycode:` filter type. To filter places by country you
 * need a country *boundary place_id*, which you get from the Geocoding
 * API first (this is exactly what the `place:511dd0b8...` hash was in
 * your very first query). So this script now does two steps per country:
 *
 *   1. Geocode the country name -> get its boundary `place_id`
 *      (cached to output/_country_place_ids.json so this only runs once)
 *   2. Query Places API with `filter=place:<that_place_id>`, paginating
 *      with `offset` as before.
 *
 * For each place it collects:
 *   - City
 *   - Country / country code
 *   - Coordinates (lat/lon)
 *   - Categories (tourist attractions, museums, landmarks, activities, etc.)
 *   - Place ID
 *   - Description (from wiki_and_media, when available)
 *   - Image (from wiki_and_media, when available)
 *
 * Usage:
 *   node fetch_geoapify_dataset.js
 *
 * Requires Node.js 18+ (built-in fetch + Intl.DisplayNames).
 *
 * -----------------------------------------------------------------------
 * COST / RATE LIMIT WARNING
 * -----------------------------------------------------------------------
 * Setting ENRICH_WITH_DETAILS = true adds ONE EXTRA API CALL PER PLACE.
 * Test with a small COUNTRY_CODES list first before running all ~195.
 */

const fs = require('fs');
const path = require('path');

// ---- CONFIG ---------------------------------------------------------
const API_KEY = 'b4febf285e88425eb0b274ee3eb941cc';

// Broad category set: general tourism, attractions/sights, museums &
// culture, and heritage/landmarks (e.g. UNESCO sites, monuments).
const CATEGORIES = 'tourism,entertainment,heritage';

const PAGE_LIMIT = 40;
const MAX_OFFSET = 460;           // safety cap on pagination depth per country
const REQUEST_DELAY_MS = 350;     // delay between list-page requests
const DETAIL_DELAY_MS = 400;      // delay between detail-enrichment requests
const GEOCODE_DELAY_MS = 300;     // delay between country geocode lookups
const COUNTRY_DELAY_MS = 1000;    // delay between countries

// MODIFIED: Now enabled by default to include descriptions & images
const ENRICH_WITH_DETAILS = true;

const OUTPUT_DIR = path.join(__dirname, 'output2');
const PLACE_ID_CACHE_FILE = path.join(OUTPUT_DIR, '_country_place_ids.json');

// Set this to a small list first to test, e.g. ['in', 'fr', 'jp'].
// Leave as the full list below to run everything.
const COUNTRY_CODES = [
//  'ad','ae','af','ag','ai','al','am','ao','ar','as','at','au','aw','az',
//  'ba','bb','bd','be','bf','bg','bh','bi','bj','bn','bo','br','bs','bt','bw','by','bz',
//  'ca','cd','cf','cg','ch','ci','cl','cm','cn','co','cr','cu','cv','cy','cz',
//  'de','dj','dk','dm','do','dz',
//  'ec','ee','eg','er','es','et',
//  'fi','fj','fm','fr',
//  'ga','gb','gd','ge','gh','gm','gn','gq','gr','gt','gw','gy',
//  'hn','hr','ht','hu',
//  'id','ie','il',
'in',
//'iq','ir','is','it',
//  'jm','jo','jp',
//  'ke','kg','kh','ki','km','kn','kp','kr','kw','kz',
//  'la','lb','lc','li','lk','lr','ls','lt','lu','lv','ly',
//  'ma','mc','md','me','mg','mh','mk','ml','mm','mn','mr','mt','mu','mv','mw','mx','my','mz',
//  'na','ne','ng','ni','nl','no','np','nr','nz',
//  'om',
//  'pa','pe','pg','ph','pk','pl','pt','pw','py',
//  'qa',
//  'ro','rs','ru','rw',
//  'sa','sb','sc','sd','se','sg','si','sk','sl','sm','sn','so','sr','ss','st','sv','sy','sz',
//  'td','tg','th','tj','tl','tm','tn','to','tr','tt','tv','tz',
//  'ua','ug','us','uy','uz',
//  'va','vc','ve','vn','vu',
//  'ws',
//  'ye',
//  'za','zm','zw'
];

// ----------------------------------------------------------------------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Request failed (status ${res.status}): ${body}`);
  }
  return res.json();
}

function loadPlaceIdCache() {
  if (fs.existsSync(PLACE_ID_CACHE_FILE)) {
    return JSON.parse(fs.readFileSync(PLACE_ID_CACHE_FILE, 'utf-8'));
  }
  return {};
}

function savePlaceIdCache(cache) {
  fs.writeFileSync(PLACE_ID_CACHE_FILE, JSON.stringify(cache, null, 2));
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

function countryNameForCode(countryCode) {
  return regionNames.of(countryCode.toUpperCase()) || countryCode;
}

/** Geocode a country name to its Geoapify boundary place_id. */
async function getCountryPlaceId(countryCode, cache) {
  if (cache[countryCode]) {
    return cache[countryCode];
  }

  const countryName = countryNameForCode(countryCode);
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(countryName)}&type=country&format=json&limit=1&apiKey=${API_KEY}`;

  const data = await fetchJson(url);
  const result = data.results?.[0];

  if (!result || !result.place_id) {
    throw new Error(`No boundary place_id found for country "${countryName}" (${countryCode})`);
  }

  cache[countryCode] = result.place_id;
  savePlaceIdCache(cache);
  await sleep(GEOCODE_DELAY_MS);

  return result.place_id;
}

async function fetchPlacesPage(boundaryPlaceId, offset) {
  const url = `https://api.geoapify.com/v2/places?categories=${CATEGORIES}&filter=place:${boundaryPlaceId}&limit=${PAGE_LIMIT}&offset=${offset}&apiKey=${API_KEY}`;
  return fetchJson(url);
}

async function fetchPlaceDetails(placeId) {
  const url = `https://api.geoapify.com/v2/place-details?id=${placeId}&features=details,wiki_and_media&apiKey=${API_KEY}`;
  return fetchJson(url);
}

/** Pull a description + image URL out of a place-details response, if present. */
function extractDescriptionAndImage(detailsData) {
  let description = null;
  let image = null;

  try {
    const props = detailsData?.features?.[0]?.properties || {};
    const wiki = props.wiki_and_media || {};

    description =
      wiki.wikipedia_extract?.text ||
      wiki.description ||
      props.description ||
      null;

    image =
      wiki.image ||
      wiki.wikimedia_commons ||
      props.image ||
      null;
  } catch (e) {
    // leave as null if the shape is unexpected
  }

  return { description, image };
}

/** Normalize a single Geoapify feature into our flat record shape. */
function normalizeFeature(feature) {
  const p = feature.properties || {};
  const [lon, lat] = feature.geometry?.coordinates || [null, null];

  return {
    place_id: p.place_id || null,
    name: p.name || p.address_line1 || null,
    city: p.city || p.county || null,
    country: p.country || null,
    country_code: p.country_code || null,
    coordinates: { lat, lon },
    categories: p.categories || [],
    formatted_address: p.formatted || null,
    description: null,  // filled in later if ENRICH_WITH_DETAILS is true
    image: null,         // filled in later if ENRICH_WITH_DETAILS is true
  };
}

async function fetchAllPlacesForCountry(boundaryPlaceId, countryCode) {
  let offset = 0;
  let allRecords = [];
  let page = 1;

  while (offset <= MAX_OFFSET) {
    const data = await fetchPlacesPage(boundaryPlaceId, offset);
    const features = data.features || [];

    if (features.length === 0) break;

    const records = features.map(normalizeFeature);
    allRecords = allRecords.concat(records);

    console.log(`  [${countryCode}] page ${page} (offset=${offset}) -> ${features.length} places (total: ${allRecords.length})`);

    if (features.length < PAGE_LIMIT) break;

    offset += PAGE_LIMIT;
    page += 1;
    await sleep(REQUEST_DELAY_MS);
  }

  return allRecords;
}

async function enrichRecordsWithDetails(records, countryCode) {
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (!record.place_id) continue;

    try {
      const details = await fetchPlaceDetails(record.place_id);
      const { description, image } = extractDescriptionAndImage(details);
      record.description = description;
      record.image = image;
    } catch (err) {
      console.warn(`  [${countryCode}] details failed for ${record.place_id}: ${err.message}`);
    }

    if ((i + 1) % 10 === 0) {
      console.log(`  [${countryCode}] enriched ${i + 1}/${records.length} places`);
    }

    await sleep(DETAIL_DELAY_MS);
  }

  return records;
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const placeIdCache = loadPlaceIdCache();
  const summary = [];

  for (const countryCode of COUNTRY_CODES) {
    const outFile = path.join(OUTPUT_DIR, `${countryCode}.json`);

    if (fs.existsSync(outFile)) {
      console.log(`Skipping ${countryCode} (already fetched: ${outFile})`);
      continue;
    }

    console.log(`\nFetching places for: ${countryCode.toUpperCase()} (${countryNameForCode(countryCode)})`);

    try {
      const boundaryPlaceId = await getCountryPlaceId(countryCode, placeIdCache);
      let records = await fetchAllPlacesForCountry(boundaryPlaceId, countryCode);

      if (ENRICH_WITH_DETAILS && records.length > 0) {
        console.log(`  Enriching ${records.length} places with descriptions/images...`);
        records = await enrichRecordsWithDetails(records, countryCode);
      }

      const output = {
        country_code: countryCode,
        country_name: countryNameForCode(countryCode),
        boundary_place_id: boundaryPlaceId,
        count: records.length,
        places: records,
      };

      fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
      console.log(`Saved ${records.length} places -> ${outFile}`);
      summary.push({ country: countryCode, count: records.length });
    } catch (err) {
      console.error(`Error fetching ${countryCode}: ${err.message}`);
      summary.push({ country: countryCode, count: 0, error: err.message });
    }

    await sleep(COUNTRY_DELAY_MS);
  }

  const summaryFile = path.join(OUTPUT_DIR, '_summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
  console.log(`\nAll done. Summary written to ${summaryFile}`);
}

main();