# 🌍 TripMate

> A personalized multi-city travel planning platform that helps users discover destinations, build day-wise itineraries, manage travel budgets, and share complete trips.

## 🚀 Overview

GlobeTrotter is a full-stack travel planning platform designed to make multi-city trip planning simple, structured, and personalized.

Users can discover cities and activities, create customized trips, organize destinations and activities into day-wise itineraries, track expenses, monitor their budget, and share their complete itinerary with others.

The platform focuses on turning scattered travel planning into one centralized experience.

---

## ✨ Key Features

### 🔐 Authentication & Profile

- User registration and login
- JWT-based authentication
- Secure password hashing
- User profile management
- Profile photo support
- Location and additional profile information

### 🌍 City & Activity Discovery

- Search cities
- Filter cities by country and region
- Discover activities and places
- Filter activities by:
  - Category
  - Cost
  - Duration
- Real travel data stored in MongoDB
- Public discovery APIs without authentication

### ✈️ Multi-City Trip Planning

- Create customized trips
- Add multiple cities
- Assign dates to destinations
- Reorder destinations
- Manage trip details
- Trip ownership and authorization

### 🗓️ Day-Wise Itinerary

- Add activities to specific trip days
- Assign start and end times
- Add notes
- Reorder activities
- Activity cost estimation
- Prevent conflicting activities
- Validate activities against city and trip dates

### 💰 Budget & Expense Management

- Set trip budget
- Add and manage expenses
- Categorize expenses
- Track actual spending
- Calculate planned activity costs
- Calculate estimated trip cost
- Category-wise expense breakdown
- Average daily cost
- Remaining budget
- Over-budget detection

### 🔗 Trip Sharing

- Generate unique public trip links
- Public read-only itinerary
- Share complete trip plans
- Disable sharing
- Copy shared trips into another user's account

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      Frontend        │
                    │    React + Vite      │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │       Backend        │
                    │  Node.js + Express   │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌───────────┐   ┌────────────┐   ┌────────────┐
        │ MongoDB   │   │ Geoapify   │   │  ImageKit  │
        │  Atlas    │   │ Data Source│   │   Images   │
        └───────────┘   └────────────┘   └────────────┘

## Live url -: https://odoo-x-ldce-x-globetrotter-2026-rep.vercel.app/
