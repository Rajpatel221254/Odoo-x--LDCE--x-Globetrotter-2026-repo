import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';
import Footer from '../landing/Footer.jsx';
import axiosInstance from '../../api/axiosInstance.js';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Check,
  X,
  Compass,
  Star,
  Camera,
  Layers,
  Globe,
  Plus,
  Sparkles,
  Share2,
  ExternalLink,
  Coins,
  Users,
  CheckCheck,
  Heart,
  ArrowRight,
  Clock,
  Trash2,
  Bookmark,
  Award,
  Luggage
} from 'lucide-react';
import './style/UserProfilePage.css';

// Preset Authentic High-Definition Explorer Avatars
const PRESET_AVATARS = [
  {
    id: 1,
    name: 'Alpine Trekker',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Mountain Explorer',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    name: 'Landscape Photographer',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 4,
    name: 'Coastal Sailor',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 5,
    name: 'Solo Nomad',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
  }
];

// Initial Curated Preplanned Journeys with Authentic Photography
const DEFAULT_PREPLANNED_TRIPS = [
  {
    id: 'trip-norway-1',
    title: 'Nordic Aurora & Arctic Fjord Kayaking',
    destination: 'Tromsø, Norway',
    city: 'Tromsø',
    dates: '10 Dec - 18 Dec 2026',
    duration: '8 Days',
    badge: 'Ready to Book',
    badgeClass: 'badge-ready',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
    budget: '₹1,85,000',
    travelers: 2,
    highlights: ['Aurora Borealis Camp', 'Fjord Whale Safari', 'Husky Dogsledding']
  },
  {
    id: 'trip-kyoto-2',
    title: 'Kyoto Autumn Zen & Bamboo Groves',
    destination: 'Kyoto, Japan',
    city: 'Kyoto',
    dates: '15 Oct - 25 Oct 2026',
    duration: '10 Days',
    badge: 'In Planning',
    badgeClass: 'badge-planning',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    budget: '₹2,10,000',
    travelers: 2,
    highlights: ['Arashiyama Forest', 'Fushimi Inari Shrine', 'Traditional Tea Ceremony']
  },
  {
    id: 'trip-swiss-3',
    title: 'Swiss Crest Glacier & Matterhorn Expedition',
    destination: 'Zermatt, Switzerland',
    city: 'Zermatt',
    dates: '04 Nov - 12 Nov 2026',
    duration: '8 Days',
    badge: 'Draft Plan',
    badgeClass: 'badge-draft',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    budget: '₹2,40,000',
    travelers: 3,
    highlights: ['Gornergrat Panoramic Train', 'Glacier Ice Caves', 'Alpine Ridge Trek']
  },
  {
    id: 'trip-jaipur-4',
    title: 'Royal Heritage Palaces & Desert Forts',
    destination: 'Jaipur, Rajasthan, India',
    city: 'Jaipur',
    dates: '20 Nov - 28 Nov 2026',
    duration: '8 Days',
    badge: 'Confirmed',
    badgeClass: 'badge-confirmed',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    budget: '₹65,000',
    travelers: 2,
    highlights: ['Amber Fort Courtyard', 'Hawa Mahal Palace', 'Chokhi Dhani Dining']
  }
];

// Initial Curated Visited / Completed Journeys
const DEFAULT_PREVIOUS_TRIPS = [
  {
    id: 'prev-santorini-1',
    title: 'Santorini Sunset Sailing & Aegean Caldera',
    destination: 'Santorini, Greece',
    dates: '01 Jun - 10 Jun 2025',
    duration: '9 Days',
    rating: 4.95,
    reviewsCount: 18,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    budget: '₹1,90,000',
    highlights: ['Oia Blue Domes Sunset', 'Catamaran Cruise', 'Amoudi Bay Seafood']
  },
  {
    id: 'prev-swiss-2',
    title: 'Alpine Crest Summer Expedition',
    destination: 'Interlaken, Switzerland',
    dates: '12 Jul - 20 Jul 2025',
    duration: '8 Days',
    rating: 4.92,
    reviewsCount: 24,
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    budget: '₹2,20,000',
    highlights: ['Jungfraujoch Peak', 'Lauterbrunnen 72 Waterfalls', 'Lake Brienz Cruise']
  },
  {
    id: 'prev-bali-3',
    title: 'Bali Sacred Temples & Ubud Valley',
    destination: 'Bali, Indonesia',
    dates: '10 Apr - 18 Apr 2025',
    duration: '8 Days',
    rating: 4.88,
    reviewsCount: 15,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    budget: '₹85,000',
    highlights: ['Ulun Danu Beratan Temple', 'Tegalalang Terraces', 'Uluwatu Sunset']
  },
  {
    id: 'prev-paris-4',
    title: 'Parisian Art & Seine River Romance',
    destination: 'Paris, France',
    dates: '14 Feb - 21 Feb 2025',
    duration: '7 Days',
    rating: 4.90,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    budget: '₹1,75,000',
    highlights: ['Eiffel Tower Golden Hour', 'Louvre Classical Art', 'Montmartre Cafés']
  }
];

const UserProfilePage = () => {
  const navigate = useNavigate();

  // User Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'planning', 'completed'
  const [toastMessage, setToastMessage] = useState('');

  // Initial user info loaded from localStorage or standard defaults
  const [userData, setUserData] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          firstName: parsed.firstName || 'Alex',
          lastName: parsed.lastName || 'Morgan',
          handle: parsed.username ? `@${parsed.username}` : '@alex_globetrotter',
          email: parsed.email || 'alex.morgan@tripmate.world',
          phone: parsed.phone || '+1 (555) 382-9910',
          city: parsed.city || 'San Francisco',
          country: parsed.country || 'United States',
          bio: parsed.bio || 'Passionate globetrotter & landscape photographer. Focused on high-altitude alpine ridges, heritage tea culture in Asia, and coastal sailing across the Mediterranean.',
          profilePhoto: parsed.profilePhoto || PRESET_AVATARS[0].url
        };
      }
    } catch (e) {
      console.warn('Failed to parse cached user data', e);
    }
    return {
      firstName: 'Alex',
      lastName: 'Morgan',
      handle: '@alex_globetrotter',
      email: 'alex.morgan@tripmate.world',
      phone: '+1 (555) 382-9910',
      city: 'San Francisco',
      country: 'United States',
      bio: 'Passionate globetrotter & landscape photographer. Focused on high-altitude alpine ridges, heritage tea culture in Asia, and coastal sailing across the Mediterranean.',
      profilePhoto: PRESET_AVATARS[0].url
    };
  });

  const [editForm, setEditForm] = useState({ ...userData });
  const [preplannedTrips, setPreplannedTrips] = useState(DEFAULT_PREPLANNED_TRIPS);
  const [previousTrips, setPreviousTrips] = useState(DEFAULT_PREVIOUS_TRIPS);

  // Sync with Backend / Authenticated User Profile & Database Trips
  useEffect(() => {
    const fetchProfileAndTrips = async () => {
      // 1. Fetch live profile if logged in
      try {
        const profileRes = await axiosInstance.get('/api/users/me');
        if (profileRes.data && profileRes.data.data) {
          const u = profileRes.data.data;
          const updated = {
            firstName: u.firstName || userData.firstName,
            lastName: u.lastName || userData.lastName,
            handle: u.username ? `@${u.username}` : userData.handle,
            email: u.email || userData.email,
            phone: u.phone || userData.phone,
            city: u.city || userData.city,
            country: u.country || userData.country,
            bio: u.bio || userData.bio,
            profilePhoto: u.profilePhoto || userData.profilePhoto
          };
          setUserData(updated);
          setEditForm(updated);
        }
      } catch (err) {
        // Fall back gracefully to localStorage or default state
      }

      // 2. Fetch live trips from backend
      try {
        const tripsRes = await axiosInstance.get('/api/trips');
        if (tripsRes.data && Array.isArray(tripsRes.data.data) && tripsRes.data.data.length > 0) {
          const dbTrips = tripsRes.data.data.map((t, idx) => ({
            id: t._id || `db-trip-${idx}`,
            title: t.title || 'Custom Adventure',
            destination: t.destination || 'Global Destination',
            city: t.destination ? t.destination.split(',')[0] : 'Global',
            dates: t.startDate && t.endDate ? `${new Date(t.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${new Date(t.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` : 'Upcoming',
            duration: '7 Days',
            badge: t.status === 'confirmed' ? 'Confirmed' : t.status === 'completed' ? 'Completed' : 'In Planning',
            badgeClass: t.status === 'confirmed' ? 'badge-confirmed' : 'badge-planning',
            image: t.coverImage || (idx % 2 === 0 ? 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80'),
            budget: t.maxBudget ? `₹${t.maxBudget.toLocaleString()}` : '₹1,50,000',
            travelers: t.travelersCount || 2,
            highlights: ['Curated Places', 'Boutique Stays', 'Authentic Dining']
          }));

          // Prepend DB trips to showcase user's created trips
          setPreplannedTrips([...dbTrips, ...DEFAULT_PREPLANNED_TRIPS.slice(0, 2)]);
        }
      } catch (err) {
        // Keeps DEFAULT_PREPLANNED_TRIPS on network error
      }
    };

    fetchProfileAndTrips();
  }, []);

  // Save Profile Handler (Persists to Backend & LocalStorage)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updated = { ...editForm };
    setUserData(updated);
    setIsEditing(false);

    try {
      localStorage.setItem('user', JSON.stringify(updated));
      await axiosInstance.patch('/api/users/me', updated);
      showToast('Profile updated and synchronized successfully!');
    } catch (err) {
      showToast('Profile changes saved locally!');
    }
  };

  // Avatar Selection Handler
  const handleSelectAvatar = (url) => {
    const updated = { ...userData, profilePhoto: url };
    setUserData(updated);
    setEditForm((prev) => ({ ...prev, profilePhoto: url }));
    try {
      localStorage.setItem('user', JSON.stringify(updated));
    } catch (e) {}
    setShowAvatarModal(false);
    showToast('Profile avatar updated!');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Total Statistics Calculations
  const totalTripsCount = preplannedTrips.length + previousTrips.length;
  const countriesCount = 8;
  const citiesCount = 14;
  const totalBudgetManaged = '₹12.6L';

  return (
    <div className="profile-page-container">
      <Navbar />

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="profile-toast-alert">
          <CheckCheck size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="profile-page-main">
        
        {/* Page Top Header */}
        <div className="profile-page-header">
          <div className="header-meta-row">
            <span className="hub-tag">
              <Globe size={13} />
              <span>Traveler Hub & Dashboard</span>
            </span>
            <span className="live-status-pill">
              <span className="live-dot"></span>
              <span>Globetrotter Pro</span>
            </span>
          </div>
          <div className="heading-action-row">
            <h1 className="page-main-heading">User Account & Travel Hub</h1>
            <button 
              type="button" 
              className="plan-new-trip-top-btn"
              onClick={() => navigate('/create-trip')}
            >
              <Plus size={16} />
              <span>Plan Next Trip</span>
            </button>
          </div>
        </div>

        {/* User Profile Hero Card */}
        <section className="user-profile-header-card">
          <div className="user-avatar-col">
            <div className="profile-avatar-box" onClick={() => setShowAvatarModal(true)} title="Click to Change Avatar">
              <img
                src={userData.profilePhoto || PRESET_AVATARS[0].url}
                alt={userData.firstName}
                className="profile-avatar-img"
              />
              <button 
                type="button" 
                className="change-photo-badge" 
                title="Change Avatar Photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAvatarModal(true);
                }}
              >
                <Camera size={15} />
              </button>
            </div>
          </div>

          <div className="user-details-col">
            {!isEditing ? (
              <div className="user-view-details">
                <div className="user-name-row">
                  <div>
                    <h2 className="user-full-name">
                      {userData.firstName} {userData.lastName}
                    </h2>
                    <span className="user-handle">{userData.handle}</span>
                  </div>

                  <div className="header-action-buttons">
                    <button
                      type="button"
                      className="edit-profile-action-btn"
                      onClick={() => {
                        setEditForm({ ...userData });
                        setIsEditing(true);
                      }}
                    >
                      <Edit3 size={15} />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>

                <p className="user-bio-text">{userData.bio}</p>

                <div className="user-info-badges-grid">
                  <div className="user-info-badge">
                    <Mail size={14} color="#a78bfa" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="user-info-badge">
                    <Phone size={14} color="#a78bfa" />
                    <span>{userData.phone}</span>
                  </div>
                  <div className="user-info-badge">
                    <MapPin size={14} color="#a78bfa" />
                    <span>
                      {userData.city}, {userData.country}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="profile-edit-form">
                <div className="edit-form-grid">
                  <div className="form-group-item">
                    <label className="form-field-label">First Name</label>
                    <input
                      type="text"
                      className="custom-form-input"
                      value={editForm.firstName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, firstName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group-item">
                    <label className="form-field-label">Last Name</label>
                    <input
                      type="text"
                      className="custom-form-input"
                      value={editForm.lastName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, lastName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group-item">
                    <label className="form-field-label">Handle / Username</label>
                    <input
                      type="text"
                      className="custom-form-input"
                      value={editForm.handle}
                      onChange={(e) =>
                        setEditForm({ ...editForm, handle: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group-item">
                    <label className="form-field-label">Email Address</label>
                    <input
                      type="email"
                      className="custom-form-input"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group-item">
                    <label className="form-field-label">Phone Number</label>
                    <input
                      type="tel"
                      className="custom-form-input"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group-item">
                    <label className="form-field-label">City</label>
                    <input
                      type="text"
                      className="custom-form-input"
                      value={editForm.city}
                      onChange={(e) =>
                        setEditForm({ ...editForm, city: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group-item">
                    <label className="form-field-label">Country</label>
                    <input
                      type="text"
                      className="custom-form-input"
                      value={editForm.country}
                      onChange={(e) =>
                        setEditForm({ ...editForm, country: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group-item">
                  <label className="form-field-label">Bio & Travel Passion</label>
                  <textarea
                    className="custom-form-input"
                    rows={2}
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                  />
                </div>

                <div className="edit-actions-row">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    <X size={15} />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="save-btn white-btn-black-text"
                  >
                    <Check size={15} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Dynamic Traveler Metrics & Statistics Bar */}
        <section className="traveler-stats-bar-grid">
          <div className="traveler-stat-card">
            <div className="stat-icon-wrap icon-purple">
              <Luggage size={20} />
            </div>
            <div className="stat-text-col">
              <span className="stat-number">{totalTripsCount}</span>
              <span className="stat-label">Total Expeditions</span>
            </div>
          </div>

          <div className="traveler-stat-card">
            <div className="stat-icon-wrap icon-blue">
              <Globe size={20} />
            </div>
            <div className="stat-text-col">
              <span className="stat-number">{countriesCount}</span>
              <span className="stat-label">Countries Explored</span>
            </div>
          </div>

          <div className="traveler-stat-card">
            <div className="stat-icon-wrap icon-emerald">
              <MapPin size={20} />
            </div>
            <div className="stat-text-col">
              <span className="stat-number">{citiesCount}</span>
              <span className="stat-label">Cities Visited</span>
            </div>
          </div>

          <div className="traveler-stat-card">
            <div className="stat-icon-wrap icon-amber">
              <Coins size={20} />
            </div>
            <div className="stat-text-col">
              <span className="stat-number">{totalBudgetManaged}</span>
              <span className="stat-label">Budget Managed</span>
            </div>
          </div>

          <div className="traveler-stat-card">
            <div className="stat-icon-wrap icon-pink">
              <Award size={20} />
            </div>
            <div className="stat-text-col">
              <span className="stat-number">4.94 ★</span>
              <span className="stat-label">Traveler Rating</span>
            </div>
          </div>
        </section>

        {/* Trip Navigation Filter Tabs */}
        <div className="trips-filter-tabs-row">
          <button 
            type="button" 
            className={`filter-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span>All Itineraries ({totalTripsCount})</span>
          </button>
          <button 
            type="button" 
            className={`filter-tab-pill ${activeTab === 'planning' ? 'active' : ''}`}
            onClick={() => setActiveTab('planning')}
          >
            <span>Upcoming & Preplanned ({preplannedTrips.length})</span>
          </button>
          <button 
            type="button" 
            className={`filter-tab-pill ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <span>Completed Memories ({previousTrips.length})</span>
          </button>
        </div>

        {/* Section 1: Preplanned & Active Trips */}
        {(activeTab === 'all' || activeTab === 'planning') && (
          <section className="profile-trips-section">
            <div className="profile-section-header">
              <div className="section-title-wrap">
                <Compass size={22} color="#f05a36" />
                <h2 className="profile-section-title">Preplanned Trips</h2>
              </div>
              <div className="section-divider-line" />
              <span className="profile-count-badge">
                {preplannedTrips.length} Active Itineraries
              </span>
            </div>

            <div className="profile-trips-grid">
              {preplannedTrips.map((trip) => (
                <div key={trip.id} className="profile-trip-card">
                  <div className="profile-trip-img-wrap">
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className="profile-trip-img"
                    />
                    <span className={`preplan-badge ${trip.badgeClass || 'badge-ready'}`}>
                      {trip.badge}
                    </span>
                    <div className="trip-travelers-chip">
                      <Users size={12} />
                      <span>{trip.travelers} Travelers</span>
                    </div>
                  </div>

                  <div className="profile-trip-content">
                    <h3 className="profile-trip-title">{trip.title}</h3>
                    
                    <div className="profile-trip-meta-row">
                      <div className="profile-trip-meta">
                        <MapPin size={13} color="#a78bfa" />
                        <span>{trip.destination}</span>
                      </div>
                      <div className="profile-trip-meta">
                        <Calendar size={13} color="#a78bfa" />
                        <span>{trip.dates}</span>
                      </div>
                    </div>

                    {/* Highlights tags */}
                    {trip.highlights && (
                      <div className="trip-highlights-tags">
                        {trip.highlights.map((h, i) => (
                          <span key={i} className="highlight-tag">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="profile-card-footer">
                      <div className="card-budget-box">
                        <span className="budget-label">Est. Budget</span>
                        <span className="budget-val">{trip.budget}</span>
                      </div>

                      <div className="card-actions-group">
                        <button
                          type="button"
                          className="share-trip-btn"
                          title="Share plan with friends"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.origin + '/create-trip');
                            showToast(`Shareable plan link for ${trip.city} copied to clipboard!`);
                          }}
                        >
                          <Share2 size={14} />
                        </button>
                        <button
                          type="button"
                          className="view-trip-btn"
                          onClick={() => navigate('/create-trip')}
                        >
                          <span>Open Workspace</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Previous Trips (Visited Travel Memories) */}
        {(activeTab === 'all' || activeTab === 'completed') && (
          <section className="profile-trips-section">
            <div className="profile-section-header">
              <div className="section-title-wrap">
                <Award size={22} color="#fbbf24" />
                <h2 className="profile-section-title">Previous Trips</h2>
              </div>
              <div className="section-divider-line" />
              <span className="profile-count-badge">
                {previousTrips.length} Visited Destinations
              </span>
            </div>

            <div className="profile-trips-grid">
              {previousTrips.map((trip) => (
                <div key={trip.id} className="profile-trip-card">
                  <div className="profile-trip-img-wrap">
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className="profile-trip-img"
                    />
                    <div className="profile-trip-rating">
                      <Star size={12} fill="#fbbf24" stroke="none" />
                      <span>{trip.rating} ({trip.reviewsCount})</span>
                    </div>
                    <span className="completed-badge">✓ Completed</span>
                  </div>

                  <div className="profile-trip-content">
                    <h3 className="profile-trip-title">{trip.title}</h3>
                    
                    <div className="profile-trip-meta-row">
                      <div className="profile-trip-meta">
                        <MapPin size={13} color="#a78bfa" />
                        <span>{trip.destination}</span>
                      </div>
                      <div className="profile-trip-meta">
                        <Calendar size={13} color="#a78bfa" />
                        <span>{trip.dates}</span>
                      </div>
                    </div>

                    {trip.highlights && (
                      <div className="trip-highlights-tags">
                        {trip.highlights.map((h, i) => (
                          <span key={i} className="highlight-tag">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="profile-card-footer">
                      <div className="card-budget-box">
                        <span className="budget-label">Total Spent</span>
                        <span className="budget-val">{trip.budget}</span>
                      </div>

                      <button
                        type="button"
                        className="view-trip-btn secondary-btn"
                        onClick={() => navigate('/itinerary-view')}
                      >
                        <span>View Memories</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* AVATAR CHANGER MODAL */}
      {showAvatarModal && (
        <div className="modal-backdrop" onClick={() => setShowAvatarModal(false)}>
          <div className="dark-modal avatar-picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <Camera size={20} color="#a78bfa" />
                <h3>Choose Traveler Avatar</h3>
              </div>
              <button type="button" className="close-btn" onClick={() => setShowAvatarModal(false)}>
                <X size={18} />
              </button>
            </div>

            <p className="modal-desc">Select a preset explorer avatar or enter a custom photo URL to update your profile photo.</p>

            <div className="preset-avatars-grid">
              {PRESET_AVATARS.map((av) => (
                <div 
                  key={av.id} 
                  className={`avatar-choice-card ${userData.profilePhoto === av.url ? 'active' : ''}`}
                  onClick={() => handleSelectAvatar(av.url)}
                >
                  <img src={av.url} alt={av.name} className="avatar-choice-thumb" />
                  <span className="avatar-choice-name">{av.name}</span>
                  {userData.profilePhoto === av.url && <div className="avatar-check-icon"><Check size={12} /></div>}
                </div>
              ))}
            </div>

            <div className="custom-url-section">
              <label className="form-field-label">Or Custom Image URL</label>
              <div className="custom-url-input-row">
                <input 
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="custom-form-input"
                />
                <button 
                  type="button"
                  className="save-btn"
                  onClick={() => {
                    if (customAvatarUrl.trim()) {
                      handleSelectAvatar(customAvatarUrl.trim());
                    }
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserProfilePage;
