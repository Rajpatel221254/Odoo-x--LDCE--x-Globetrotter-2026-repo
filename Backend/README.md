# GlobeTrotter Backend - Travel Data Foundation

Welcome to the production-ready Travel Data Foundation service for GlobeTrotter. This backend service collects city coordinates and points of interest (places) using the Geoapify API, standardizes categories, maps data parameters, enforces validation rules, and stores/caches the results dynamically in MongoDB.

---

## 📂 Project Structure

```text
Backend/
├── config/
│   └── db.js                 # MongoDB connection setup via Mongoose
├── data/
│   └── cities.json           # Raw input seed list of 60 worldwide cities
├── models/
│   ├── City.js               # City schema definitions & unique indexes
│   └── Place.js              # Place schema definitions, enums & defaults
├── scripts/
│   ├── categoryMapper.js     # Decodes & normalizes Geoapify categories
│   ├── geoapify.js           # API client with exponential backoff retries
│   ├── importCities.js       # Seeds the database with cities geocoded data
│   ├── importPlaces.js       # Seeds the database with points of interest
│   ├── updatePlaces.js       # Syncs existing places and inserts new ones
│   └── verifyDb.js           # Validates counts and checks for duplicates
├── src/
│   ├── app.js                # Express app setup and middleware configuration
│   ├── routes/
│   │   ├── city.routes.js    # Cities REST API endpoint
│   │   ├── health.routes.js  # Server health status route
│   │   ├── index.js          # Main express routes registry
│   │   └── place.routes.js   # Dynamic cache-on-demand places API route
│   └── server.js             # Dev server entry point listening on PORT 5001
├── .env                      # Database cluster & Geoapify API key configurations
└── package.json              # Script runners and npm dependencies declaration
```

---

## ⚙️ Requirements & Installation

1.  **Node.js**: Ensure you have Node.js installed (v18+ recommended).
2.  **MongoDB Atlas**: Set up a cluster and copy the connection string.
3.  **Geoapify API Key**: Get a free API key from [Geoapify](https://www.geoapify.com/).

### Installation Steps

Clone the repository, navigate to the `Backend` directory, and install dependencies:

```bash
cd Backend
npm install
```

Create a `.env` file in the root of the `Backend/` directory and configure the environment variables:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string/geopify
GEOPIFY_API=your_geoapify_api_key
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Execution Script Runners

We have configured several scripts in `package.json` to make running and seeding the backend easy:

### 1. Seeding Cities
Geocodes all cities in `data/cities.json` and stores them in MongoDB (upserts by name + country to avoid duplicates):
```bash
npm run import:cities
```

### 2. Seeding Places
Iterates through all saved cities in MongoDB, fetches local places from Geoapify, standardizes categories, clean coordinates, adds defaults, and inserts them:
```bash
npm run import:places
```

### 3. Sync & Update
Refreshes the parameters of existing places and adds new ones in highly optimized bulk database operations:
```bash
npm run update:places
```

### 4. Database Verification
Runs a validation suite in Mongoose to verify record counts, output random sample documents, and execute an aggregation query verifying that there are **0 duplicate `placeId`s**:
```bash
npm run verify
```

### 5. Running the API Server
Starts the Express API server watching for file changes using `nodemon` on port **`5001`**:
```bash
npm run dev
```

---

## 📡 REST API Routes (Testing in Postman)

Once the server is running (`npm run dev`), import these URLs into Postman to test:

### 1. Health Status
*   **Method**: `GET`
*   **URL**: `http://localhost:5001/api/health`
*   **Description**: Confirms the server is alive and MongoDB is connected.

### 2. Get All Cities
*   **Method**: `GET`
*   **URL**: `http://localhost:5001/api/cities`
*   **Description**: Retrieves all 60 cities seeded in the database.

### 3. Get Places (All)
*   **Method**: `GET`
*   **URL**: `http://localhost:5001/api/places`
*   **Description**: Returns all places currently stored in the database.

### 4. Smart Cache-on-Demand Places (By City Name or ID)
*   **Method**: `GET`
*   **URL**: `http://localhost:5001/api/places?cityId=Madrid`
*   **Description**: 
    *   **Cache Hit**: If the city has places in MongoDB, they are returned instantly (`"source": "database"`).
    *   **Cache Miss & Lazy Load**: If the city does not have places in MongoDB (or if the city itself is not yet in the DB), it dynamically geocodes it, calls the Geoapify API, stores the places in MongoDB, and returns them (`"source": "api"`). Subequent calls will be cache hits.
*   **Try filtering by category**: Add `&category=Park` (e.g. `http://localhost:5001/api/places?cityId=New York&category=Park`).

---

## 🛠️ Key Technical Highlights
*   **ES Modules (ESM)**: Built using standard `import/export` syntax throughout the application.
*   **Exponential Backoff Retries**: Geoapify HTTP requests handle `429 Too Many Requests` limits by waiting and retrying with exponential delays.
*   **Bulk Database Operations**: `updatePlaces.js` uses `Place.bulkWrite()` for maximum performance instead of repeating sequential queries.
*   **Strict Clean Data Rules**: We reject nameless places, cast coordinate strings into `Number`s, map complex category tags into standard project enums, and define dynamic default prices and durations by category.
