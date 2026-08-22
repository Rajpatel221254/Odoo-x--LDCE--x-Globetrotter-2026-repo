# 🌍 GlobeTrotter Backend API Documentation

Welcome to the **GlobeTrotter** REST API specification. This document details all endpoints, authentication requirements, request payloads, query parameters, response structures, and HTTP status codes across all 7 functional modules.

---

## 📑 Table of Contents
1. [Base URL & Response Standards](#-base-url--response-standards)
2. [Health & System](#1-health--system)
3. [Travel Data & Discovery](#2-travel-data--discovery)
4. [User Authentication & Profile](#3-user-authentication--profile)
5. [Trip Management & Multi-City Stops](#4-trip-management--multi-city-stops)
6. [Itinerary & Activity Planning](#5-itinerary--activity-planning)
7. [Expenses & Budget Management](#6-expenses--budget-management)
8. [Trip Sharing & Copying](#7-trip-sharing--copying)
9. [Error Handling & Status Codes](#-error-handling--status-codes)

---

## 🌐 Base URL & Response Standards

- **Base URL**: `http://localhost:5001/api`
- **Default Content-Type**: `application/json` (or `multipart/form-data` for file uploads)
- **Standard Success Response**:
  ```json
  {
    "success": true,
    "message": "Optional descriptive message",
    "data": { ... }
  }
  ```
- **Standard Error Response**:
  ```json
  {
    "success": false,
    "message": "Human-readable error description"
  }
  ```

---

## 1. Health & System

### `GET /api/health`
Checks API server and database connectivity status.
- **Access**: Public
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "GlobeTrotter API is healthy and operational",
    "timestamp": "2026-08-22T08:00:00.000Z",
    "environment": "development"
  }
  ```

---

## 2. Travel Data & Discovery

### `GET /api/cities`
List and search cities with pagination and filters.
- **Access**: Public
- **Query Parameters**:
  - `page`: (Number, default `1`)
  - `limit`: (Number, default `20`, max `100`)
  - `search`: (String, text search across name, country, region)
  - `country`: (String, exact country filter)
  - `region`: (String, exact region filter)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "total": 202,
    "page": 1,
    "pages": 11,
    "count": 20,
    "data": [
      {
        "_id": "6a894c60d06f631af08134e0",
        "name": "Paris",
        "country": "France",
        "region": "Europe",
        "latitude": 48.8566,
        "longitude": 2.3522,
        "costIndex": 4,
        "popularity": 5,
        "image": "https://...",
        "description": "City of Light and Culture"
      }
    ]
  }
  ```

### `GET /api/cities/:cityId`
Get single city details by MongoDB ObjectId.
- **Access**: Public
- **Response**: `200 OK`

### `GET /api/places`
List and filter places and attractions.
- **Access**: Public
- **Query Parameters**:
  - `cityId`: (String ObjectId, filter places in a city)
  - `category`: (String: `'Tourist attraction'|'Museum'|'Landmark'|'Park'|'Activity'`)
  - `maxCost`: (Number, filter places with `estimatedCost <= maxCost`)
  - `maxDuration`: (Number in minutes, filter places with `duration <= maxDuration`)
  - `page`: (Number, default `1`)
  - `limit`: (Number, default `20`)
- **Response**: `200 OK`

### `GET /api/places/:placeId`
Get single place details by MongoDB ObjectId.
- **Access**: Public
- **Response**: `200 OK`

---

## 3. User Authentication & Profile

### `POST /api/auth/register`
Register a new user account with optional profile photo upload.
- **Access**: Public
- **Content-Type**: `multipart/form-data` or `application/json`
- **Body Fields**:
  - `firstName`: (String, Required)
  - `lastName`: (String, Required)
  - `phoneNumber`: (String E.164 format, Required)
  - `email`: (String Email, Required)
  - `password`: (String, min 6 chars, Required)
  - `city`: (String, Optional)
  - `country`: (String, Optional)
  - `additionalInfo`: (String, Optional)
  - `profilePhoto`: (File binary via Multer or String URL, Optional)
- **Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "Registration successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
      "_id": "6a8957208691e72c0dd0afe4",
      "firstName": "Raj",
      "lastName": "Patel",
      "email": "raj@example.com",
      "phoneNumber": "+919876543210",
      "profilePhoto": "https://ik.imagekit.io/...",
      "createdAt": "2026-08-22T08:00:00.000Z"
    }
  }
  ```

### `POST /api/auth/login`
Authenticate user with email and password.
- **Access**: Public
- **Body**: `{ "email": "raj@example.com", "password": "password123" }`
- **Response**: `200 OK` (Returns JWT token and user profile)

### `GET /api/auth/me`
Get current authenticated user identity.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `POST /api/auth/logout`
Stateless token discard endpoint.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `GET /api/users/me`
Get authenticated user's full profile.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `PATCH /api/users/me`
Update profile information or profile photo.
- **Access**: Protected (`Bearer <token>`)
- **Content-Type**: `multipart/form-data` or `application/json`
- **Allowed Updatable Fields**: `firstName`, `lastName`, `phoneNumber`, `city`, `country`, `additionalInfo`, `profilePhoto` (File or URL).
- **Response**: `200 OK`

---

## 4. Trip Management & Multi-City Stops

### `POST /api/trips`
Create a new trip for the authenticated user.
- **Access**: Protected (`Bearer <token>`)
- **Content-Type**: `multipart/form-data` or `application/json`
- **Body Fields**:
  - `name`: (String, Required)
  - `description`: (String, Optional)
  - `startDate`: (Date String "YYYY-MM-DD", Required)
  - `endDate`: (Date String "YYYY-MM-DD", Required, `>= startDate`)
  - `totalBudget`: (Number, Optional, `>= 0`, default `0`)
  - `currency`: (String, Optional, default `"USD"`)
  - `status`: (String: `'planning'|'ongoing'|'completed'|'cancelled'`, default `'planning'`)
  - `coverImage`: (File binary or URL string, Optional)
- **Response**: `201 Created`

### `GET /api/trips`
List all trips belonging to the authenticated user.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `GET /api/trips/:tripId`
Get single trip by ID with populated ordered stops and city details.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `PATCH /api/trips/:tripId`
Update trip details. Validates that existing stops remain within new date boundaries.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `DELETE /api/trips/:tripId`
Delete a trip and cascade delete all associated stops, itinerary activities, and expenses.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `POST /api/trips/:tripId/stops`
Add a city stop to an owned trip.
- **Access**: Protected (`Bearer <token>`)
- **Body**:
  - `cityId`: (String ObjectId, Required, must exist in DB)
  - `startDate`: (Date String, Required, within trip dates)
  - `endDate`: (Date String, Required, `>= startDate`, within trip dates)
  - `order`: (Number, Optional, auto-assigned if omitted)
  - `notes`: (String, Optional)
- **Rules**: Prevents duplicate cities in same trip; prevents overlapping stop dates.
- **Response**: `201 Created`

### `GET /api/trips/:tripId/stops`
Get all stops for a trip ordered by `order: 1` with populated city data.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `PATCH /api/stops/:stopId`
Update a specific stop (dates, notes, order, city).
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `DELETE /api/stops/:stopId`
Delete a trip stop and automatically re-sequence remaining stops (`1, 2, 3...`).
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `PATCH /api/trips/:tripId/stops/reorder`
Reorder stops for a trip.
- **Access**: Protected (`Bearer <token>`)
- **Body**: `{ "stopIds": ["stopId1", "stopId2", "stopId3"] }`
- **Response**: `200 OK`

---

## 5. Itinerary & Activity Planning

### `POST /api/trips/:tripId/itinerary`
Schedule an activity inside a trip stop.
- **Access**: Protected (`Bearer <token>`)
- **Body**:
  - `tripStopId`: (String ObjectId, Required, must belong to trip)
  - `cityId`: (String ObjectId, Required, must match stop city)
  - `placeId`: (String ObjectId, Required, must belong to cityId)
  - `date`: (Date String, Required, within stop dates)
  - `startTime`: (Time String "HH:mm", Required)
  - `endTime`: (Time String "HH:mm", Required, `> startTime`)
  - `order`: (Number, Optional, auto-assigned)
  - `notes`: (String, Optional)
  - `estimatedCost`: (Number, Optional, auto-populated from Place if omitted)
- **Rules**: Prevents overlapping activity time slots on the same date.
- **Response**: `201 Created`

### `GET /api/trips/:tripId/itinerary`
Get all scheduled activities for a trip, sorted by date, then order/time.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `PATCH /api/itinerary/:itemId`
Update an activity's time, date, notes, cost, or order.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `DELETE /api/itinerary/:itemId`
Delete an activity from the itinerary and resequence remaining items on that date.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `PATCH /api/trips/:tripId/itinerary/reorder`
Reorder itinerary activities.
- **Access**: Protected (`Bearer <token>`)
- **Body**: `{ "itemIds": ["itemId1", "itemId2"] }`
- **Response**: `200 OK`

---

## 6. Expenses & Budget Management

### `POST /api/trips/:tripId/expenses`
Log an actual expense.
- **Access**: Protected (`Bearer <token>`)
- **Body**:
  - `category`: (String: `'transport'|'accommodation'|'food'|'activity'|'miscellaneous'`, Required)
  - `description`: (String, Required)
  - `amount`: (Number, Required, `> 0`)
  - `currency`: (String, Optional, default trip currency)
  - `date`: (Date String, Required, within trip dates)
  - `itineraryItemId`: (String ObjectId, Optional)
  - `notes`: (String, Optional)
- **Response**: `201 Created`

### `GET /api/trips/:tripId/expenses`
Get all expenses for a trip with optional filters.
- **Access**: Protected (`Bearer <token>`)
- **Query Parameters**:
  - `category`: (String filter)
  - `startDate`: (Date String filter)
  - `endDate`: (Date String filter)
- **Response**: `200 OK`

### `PATCH /api/expenses/:expenseId`
Update an expense.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `DELETE /api/expenses/:expenseId`
Delete an expense.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `GET /api/trips/:tripId/budget`
Compute complete backend budget analytics and breakdowns.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "tripId": "6a8968fd3b149eb4826888a4",
      "tripName": "Euro Voyage",
      "currency": "EUR",
      "totalBudget": 3500,
      "actualExpenses": 1200,
      "plannedActivityCosts": 150,
      "estimatedTotal": 1350,
      "remainingBudget": 2300,
      "percentageUsed": 34.29,
      "averageDailyCost": 80,
      "tripDurationDays": 15,
      "isOverBudget": false,
      "overBudgetAmount": 0,
      "categoryBreakdown": {
        "transport": { "total": 250, "percentage": 20.83, "count": 1 },
        "accommodation": { "total": 800, "percentage": 66.67, "count": 1 },
        "food": { "total": 150, "percentage": 12.5, "count": 1 },
        "activity": { "total": 0, "percentage": 0, "count": 0 },
        "miscellaneous": { "total": 0, "percentage": 0, "count": 0 }
      },
      "expenseCount": 3,
      "activityCount": 2
    }
  }
  ```

---

## 7. Trip Sharing & Copying

### `POST /api/trips/:tripId/share`
Create or retrieve an active share link for a trip.
- **Access**: Protected (`Bearer <token>`)
- **Body**:
  - `expiresAt`: (Date String in the future, Optional)
  - `customSlug`: (String alphanumeric with dashes, Optional)
- **Response**: `201 Created` (or `200 OK` if active link exists)
  ```json
  {
    "success": true,
    "message": "Share link created successfully.",
    "shareUrl": "http://localhost:5173/share/euro-voyage-3810df69",
    "data": {
      "slug": "euro-voyage-3810df69",
      "isActive": true,
      "expiresAt": null
    }
  }
  ```

### `GET /api/share/:slug`
Public view of a shared trip.
- **Access**: 🔓 **Public (No Authentication Required)**
- **Response**: `200 OK`
  - Returns trip details, ordered stops, itinerary activities with places.
  - **Privacy**: Exposes only public creator info (`firstName`, `lastName`, `profilePhoto`). Never exposes emails, phone numbers, or passwords.

### `DELETE /api/trips/:tripId/share`
Disable the active share link for a trip.
- **Access**: Protected (`Bearer <token>`)
- **Response**: `200 OK`

### `POST /api/share/:slug/copy`
Clone a shared trip into the caller's account.
- **Access**: Protected (`Bearer <token>`)
- **Body**: `{ "name": "Custom Trip Name (Optional)" }`
- **Response**: `201 Created`
  - Generates a new trip document with new MongoDB IDs for trip, stops, and activities assigned to `req.user._id`.
  - Leaves the original shared trip untouched.

---

## 🛡️ Error Handling & Status Codes

| HTTP Status Code | Meaning | Common Scenario |
|---|---|---|
| **`200 OK`** | Success | Query, update, or delete completed successfully |
| **`201 Created`** | Created | Resource created (User, Trip, Stop, Activity, Expense, Share) |
| **`400 Bad Request`** | Validation Error | Overlapping dates, invalid date ranges, city/place mismatch |
| **`401 Unauthorized`** | Authentication Failure | Missing or invalid JWT token, expired token |
| **`403 Forbidden`** | Authorization Failure | Modifying/deleting resources belonging to another user |
| **`404 Not Found`** | Resource Missing | Non-existent route, city, place, trip, or disabled share link |
| **`409 Conflict`** | Duplicate Resource | Duplicate email, duplicate city in trip, duplicate slug |
| **`422 Unprocessable`** | Schema Validation | Zod schema validation failed (missing required fields, negative values) |
| **`500 Internal Error`** | Server Error | Unhandled runtime exception |

---
