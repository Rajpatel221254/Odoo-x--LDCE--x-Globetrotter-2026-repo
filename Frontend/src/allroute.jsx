import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Authentication Pages (Screen 1 & 2)
import Login from './components/authentication/pages/login.jsx';

// Main Landing Page (Screen 3)
import LandingPage from './components/landing/LandingPage.jsx';

// Create a New Trip Page (Screen 4)
import CreateTripPage from './components/trips/CreateTripPage.jsx';

// Build Itinerary Screen (Screen 5)
import BuildItineraryPage from './components/trips/BuildItineraryPage.jsx';

// User Trip Listing Screen (Screen 6)
import TripListingPage from './components/trips/TripListingPage.jsx';

// User Profile Screen (Screen 7)
import UserProfilePage from './components/profile/UserProfilePage.jsx';

// Activity / City Search Page (Screen 8)
import ActivitySearchPage from './components/explore/ActivitySearchPage.jsx';

// Itinerary View Screen with Budget Section (Screen 9)
import ItineraryDetailsPage from './components/trips/ItineraryDetailsPage.jsx';

// Community Tab Screen (Screen 10)
import CommunityPage from './components/community/CommunityPage.jsx';

// Calendar View Screen (Screen 11)
import CalendarViewPage from './components/calendar/CalendarViewPage.jsx';

const AllRoutes = () => {
  return (
    <Routes>
      {/* Screen 3: Landing Page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/dashboard" element={<LandingPage />} />

      {/* Screen 1 & 2: Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />
      <Route path="/sign-up" element={<Login />} />
      <Route path="/register" element={<Login />} />

      {/* Screen 4: Create a New Trip (Protected) */}
      <Route path="/create-trip" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />
      <Route path="/plan-trip" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />

      {/* Screen 5: Build Itinerary (Protected) */}
      <Route path="/build-itinerary" element={<ProtectedRoute><BuildItineraryPage /></ProtectedRoute>} />

      {/* Screen 6: User Trip Listing (Protected) */}
      <Route path="/trips" element={<ProtectedRoute><TripListingPage /></ProtectedRoute>} />
      <Route path="/my-trips" element={<ProtectedRoute><TripListingPage /></ProtectedRoute>} />

      {/* Screen 7: User Profile (Protected) */}
      <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      <Route path="/user-profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />

      {/* Screen 8: Activity / City Search */}
      <Route path="/explore" element={<ActivitySearchPage />} />
      <Route path="/search" element={<ActivitySearchPage />} />
      <Route path="/activities" element={<ActivitySearchPage />} />

      {/* Screen 9: Itinerary View with Budget (Protected) */}
      <Route path="/itinerary-view" element={<ProtectedRoute><ItineraryDetailsPage /></ProtectedRoute>} />
      <Route path="/itinerary" element={<ProtectedRoute><ItineraryDetailsPage /></ProtectedRoute>} />

      {/* Screen 10: Community Tab */}
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/feed" element={<CommunityPage />} />

      {/* Screen 11: Calendar View (Protected) */}
      <Route path="/calendar" element={<ProtectedRoute><CalendarViewPage /></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><CalendarViewPage /></ProtectedRoute>} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AllRoutes;
