import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';
import Footer from '../landing/Footer.jsx';
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
  Layers
} from 'lucide-react';
import './style/UserProfilePage.css';

import img1 from '../../assets/home_image_1.png';
import img2 from '../../assets/home_image_2.png';
import img3 from '../../assets/home_image_3.png';
import loginImg1 from '../../assets/login_image_1.jpg';
import loginImg2 from '../../assets/login_image_2.jpg';
import loginImg3 from '../../assets/login_image_3.jpg';

const UserProfilePage = () => {
  const navigate = useNavigate();

  // User Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: 'Alex',
    lastName: 'Morgan',
    handle: '@alex_globetrotter',
    email: 'alex.morgan@tripmate.world',
    phone: '+1 (555) 382-9910',
    city: 'San Francisco',
    country: 'United States',
    bio: 'Passionate globetrotter & landscape photographer. Focused on high-altitude alpine ridges, heritage tea culture in Asia, and coastal sailing across the Mediterranean.'
  });

  const [editForm, setEditForm] = useState({ ...userData });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserData({ ...editForm });
    setIsEditing(false);
  };

  const preplannedTrips = [
    {
      id: 1,
      title: 'Nordic Aurora & Arctic Fjord Kayaking',
      destination: 'Tromsø, Norway',
      dates: '10 Dec - 18 Dec 2026',
      badge: 'Draft Plan',
      image: img2
    },
    {
      id: 2,
      title: 'Kyoto Autumn Zen & Bamboo Forests',
      destination: 'Kyoto, Japan',
      dates: '15 Oct - 25 Oct 2026',
      badge: 'Ready to Book',
      image: loginImg2
    },
    {
      id: 3,
      title: 'Swiss Crest Glacier Trekking',
      destination: 'Zermatt, Switzerland',
      dates: '04 Nov - 12 Nov 2026',
      badge: 'In Planning',
      image: img1
    }
  ];

  const previousTrips = [
    {
      id: 1,
      title: 'Santorini Sunset Sailing & Villas',
      destination: 'Santorini, Greece',
      dates: '01 Jun - 10 Jun 2026',
      rating: 4.9,
      image: loginImg3
    },
    {
      id: 2,
      title: 'Alpine Crest Summer Expedition',
      destination: 'Interlaken, Switzerland',
      dates: '12 Jul - 20 Jul 2025',
      rating: 4.95,
      image: loginImg1
    },
    {
      id: 3,
      title: 'Bali Sacred Temples & Ubud Valley',
      destination: 'Bali, Indonesia',
      dates: '10 Apr - 18 Apr 2025',
      rating: 4.88,
      image: img3
    }
  ];

  return (
    <div className="profile-page-container">
      <Navbar />

      <main className="profile-page-main">
        {/* Page Header */}
        <div className="profile-page-header">
          <span className="screen-badge">Screen 7 • User Profile Pages</span>
          <h1 className="page-main-heading">User Account & Travel Hub</h1>
        </div>

        {/* User Profile Header Card matching wireframe */}
        <section className="user-profile-header-card">
          <div className="user-avatar-col">
            <div className="profile-avatar-box">
              <img
                src={loginImg1}
                alt={userData.firstName}
                className="profile-avatar-img"
              />
              <button className="change-photo-badge" title="Change Avatar">
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

                  <button
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
                  <label className="form-field-label">Bio & Travel Goals</label>
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

        {/* Section 1: Preplanned Trips matching wireframe */}
        <section className="profile-trips-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">Preplanned Trips</h2>
            <div className="section-divider-line" />
            <span className="profile-count-badge">
              {preplannedTrips.length} Itineraries
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
                  <span className="preplan-badge">{trip.badge}</span>
                </div>

                <div className="profile-trip-content">
                  <h3 className="profile-trip-title">{trip.title}</h3>
                  <div className="profile-trip-meta">
                    <MapPin size={13} color="#a78bfa" />
                    <span>{trip.destination}</span>
                  </div>
                  <div className="profile-trip-meta">
                    <Calendar size={13} color="#a78bfa" />
                    <span>{trip.dates}</span>
                  </div>

                  <div className="profile-card-footer">
                    <button
                      className="view-trip-btn"
                      onClick={() => navigate('/itinerary-view')}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Previous Trips matching wireframe */}
        <section className="profile-trips-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">Previous Trips</h2>
            <div className="section-divider-line" />
            <span className="profile-count-badge">
              {previousTrips.length} Visited
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
                    <span>{trip.rating}</span>
                  </div>
                </div>

                <div className="profile-trip-content">
                  <h3 className="profile-trip-title">{trip.title}</h3>
                  <div className="profile-trip-meta">
                    <MapPin size={13} color="#a78bfa" />
                    <span>{trip.destination}</span>
                  </div>
                  <div className="profile-trip-meta">
                    <Calendar size={13} color="#a78bfa" />
                    <span>{trip.dates}</span>
                  </div>

                  <div className="profile-card-footer">
                    <button
                      className="view-trip-btn"
                      onClick={() => navigate('/itinerary-view')}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfilePage;
