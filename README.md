🌍 GlobeTrotter

«Personalized Multi-City Travel Planning Platform»

GlobeTrotter is a full-stack travel planning application that helps users create, organize, visualize, and share personalized multi-city trips from a single platform.

Users can discover destinations and activities, build day-wise itineraries, estimate trip costs, visualize their journey, and share their travel plans with others.

---

🎯 Problem

Planning a multi-city trip often requires switching between multiple platforms for destinations, activities, schedules, budgets, and sharing.

GlobeTrotter brings these workflows together into one unified travel-planning experience.

---

💡 Solution

GlobeTrotter allows users to:

- 🔐 Create and manage their account
- 🗺️ Discover cities and destinations
- 🏙️ Add multiple cities to a trip
- 🎯 Discover activities and attractions
- 📅 Assign dates and activities to each destination
- 🧭 Build a day-wise itinerary
- 💰 Automatically calculate estimated trip costs
- 📊 Track budget and identify over-budget plans
- 📆 View trips using timeline/calendar views
- 🔗 Share itineraries using public links
- 📋 Copy shared itineraries and customize them

---

✨ Core Features

Authentication

- User registration
- Login/logout
- JWT-based authentication
- Protected routes

Trip Management

- Create trips
- Set travel dates
- Add descriptions
- Manage multiple trips
- Add and reorder destinations

City & Activity Discovery

- Search cities
- Filter destinations
- Discover activities and attractions
- Filter activities by category, cost, and duration

Itinerary Builder

- Day-wise planning
- Add activities to specific dates
- Set activity times
- Reorder activities
- Timeline/list visualization

Smart Budgeting

- Activity cost calculation
- Trip expense breakdown
- Estimated daily cost
- Budget tracking
- Over-budget alerts

Trip Sharing

- Generate public itinerary links
- Read-only shared itinerary
- Copy an existing trip and customize it

---

🏗️ Architecture

                         ┌──────────────────┐
                         │     React        │
                         │    Frontend      │
                         └────────┬─────────┘
                                  │
                              REST API
                                  │
                         ┌────────▼─────────┐
                         │    Backend API   │
                         │ Node.js / Express│
                         └────────┬─────────┘
                                  │
                              Mongoose
                                  │
                         ┌────────▼─────────┐
                         │     MongoDB      │
                         └──────────────────┘
                                  ▲
                                  │
                         ┌────────┴─────────┐
                         │   Geoapify API   │
                         │ Cities / Places  │
                         └──────────────────┘

---

🗄️ Data Model

The application uses MongoDB for dynamic application data.

Main Collections

users
cities
places
trips
tripStops
itineraryItems
expenses
shareLinks

Relationships

User
 │
 └── Trips
      │
      ├── Trip Stops
      │      │
      │      └── City
      │
      ├── Itinerary Items
      │      │
      │      └── Place / Activity
      │
      └── Expenses

---

🌐 Travel Data

GlobeTrotter uses external travel/location data sources to populate destination and place information.

The collected data is processed and stored in MongoDB so that the application can provide dynamic search and trip-planning functionality through its own backend APIs.

---

🛠️ Tech Stack

Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- REST APIs

External Services

- Geoapify
- Image hosting/storage service

Development

- Git
- GitHub
- Postman

---

📂 Project Structure

globetrotter/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── scripts/
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md

---

🚀 Getting Started

1. Clone the repository

git clone https://github.com/<organization-or-team>/globetrotter.git

cd globetrotter

2. Setup Backend

cd backend
npm install

Create a ".env" file:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEOAPIFY_API_KEY=your_geoapify_api_key

Start the backend:

npm run dev

3. Setup Frontend

cd frontend
npm install
npm run dev

---

🔌 Core API Modules

/api/auth
/api/users
/api/cities
/api/places
/api/trips
/api/trip-stops
/api/itinerary
/api/expenses
/api/share

---

👥 Team Contributions

Member 1 — Travel Data & Database

- Geoapify integration
- City data collection
- Place/activity data collection
- Data processing
- MongoDB travel-data collections

Member 2 — Backend

- Authentication
- User management
- Trip management
- Trip stops
- Backend architecture
- REST APIs

Member 3 — Frontend

- Authentication UI
- Dashboard
- Trip creation
- My Trips
- City discovery
- Trip management UI

Member 4 — Itinerary & Budget

- Activity discovery
- Itinerary builder
- Timeline/calendar
- Budget calculation
- Expense breakdown
- Public trip sharing

---

🔒 Environment Variables

Never commit secrets to GitHub.

Use ".env.example" as a reference:

PORT=
MONGODB_URI=
JWT_SECRET=
GEOAPIFY_API_KEY=

---

🎥 Demo

A complete product demonstration is available here:

Demo Video: "<ADD_DEMO_VIDEO_LINK>"

---

📌 Hackathon

Odoo Hackathon 2026

Problem Statement

GlobeTrotter — Empowering Personalized Travel Planning

The application focuses on personalized multi-city itinerary creation, destination and activity discovery, budget estimation, itinerary visualization, and trip sharing.

---

🚀 Future Improvements

- AI-powered itinerary generation
- Personalized destination recommendations
- Collaborative trip planning
- Real-time travel information
- Weather integration
- Hotel and transportation recommendations
- Advanced travel analytics

---

📜 License

This project was developed as part of the Odoo Hackathon 2026.
