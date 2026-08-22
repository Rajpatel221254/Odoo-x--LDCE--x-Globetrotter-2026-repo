import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';
import Footer from '../landing/Footer.jsx';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Layers,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Plane,
  Plus,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import './style/TripListingPage.css';

import img1 from '../../assets/home_image_1.png';
import img2 from '../../assets/home_image_2.png';
import img3 from '../../assets/home_image_3.png';
import loginImg1 from '../../assets/login_image_1.jpg';
import loginImg2 from '../../assets/login_image_2.jpg';
import loginImg3 from '../../assets/login_image_3.jpg';

const TRIPS_DATA = {
  ongoing: [
    {
      id: 'on-1',
      title: 'Grand Swiss Alps & Bernese Highlands',
      location: 'Interlaken & Zermatt, Switzerland',
      dates: '18 Aug - 26 Aug 2026',
      progress: 'Day 4 of 8',
      spent: '$1,420 / $2,800',
      image: loginImg1,
      overview: 'Currently ascending glacier trails, staying at alpine chalets, and exploring mountain valleys.'
    }
  ],
  upcoming: [
    {
      id: 'up-1',
      title: 'Kyoto Autumn Zen & Tokyo Lights',
      location: 'Kyoto & Tokyo, Japan',
      dates: '15 Oct - 25 Oct 2026',
      countdown: 'Starts in 24 days',
      budget: '$3,400',
      image: loginImg2,
      overview: 'Curated bamboo forest morning walks, tea ceremonies, high-speed Shinkansen trains, and ryokan lodging.'
    },
    {
      id: 'up-2',
      title: 'Nordic Aurora & Arctic Fjord Kayaking',
      location: 'Tromsø & Lofoten, Norway',
      dates: '10 Dec - 18 Dec 2026',
      countdown: 'Starts in 78 days',
      budget: '$2,950',
      image: img2,
      overview: 'Chasing northern lights, dog sledding expeditions, and coastal fjord cruises.'
    }
  ],
  completed: [
    {
      id: 'comp-1',
      title: 'Santorini Sunset Sail & Cliffside Villas',
      location: 'Santorini & Mykonos, Greece',
      dates: '01 Jun - 10 Jun 2026',
      status: 'Completed',
      totalSpent: '$3,120',
      image: loginImg3,
      overview: 'Caldera sailing cruises, ancient Akrotiri ruins, and Mediterranean gastronomy.'
    },
    {
      id: 'comp-2',
      title: 'Bali Rainforest & Nusa Penida Escape',
      location: 'Bali, Indonesia',
      dates: '12 Apr - 20 Apr 2026',
      status: 'Completed',
      totalSpent: '$2,150',
      image: img3,
      overview: 'Tegenungan waterfalls, sacred monkey forest sanctuary, and private beach retreats.'
    }
  ]
};

const TripListingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Date: Newest');

  return (
    <div className="trips-listing-page-container">
      <Navbar />

      <main className="trips-listing-main">
        {/* Page Header */}
        <div className="page-header-row">
          <div>
            <span className="screen-badge">Screen 6 • User Trip Listing</span>
            <h1 className="page-main-heading">My Trips Overview</h1>
          </div>
          <button 
            className="new-trip-btn white-btn-black-text"
            onClick={() => navigate('/create-trip')}
          >
            <Plus size={18} />
            <span>Create New Trip</span>
          </button>
        </div>

        {/* Controls Toolbar matching wireframe */}
        <div className="controls-toolbar">
          <div className="search-bar-wrapper">
            <Search size={18} className="search-input-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search your ongoing, upcoming, or completed trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-controls-group">
            <button className="control-btn">
              <Layers size={15} />
              <span>Group by: Status</span>
            </button>
            <button className="control-btn">
              <SlidersHorizontal size={15} />
              <span>Filter: {activeFilter}</span>
            </button>
            <button className="control-btn">
              <ArrowUpDown size={15} />
              <span>Sort by: {sortBy}</span>
            </button>
          </div>
        </div>

        {/* 1. Ongoing Trips Section */}
        <section className="trip-category-block">
          <div className="category-header">
            <div className="category-indicator live" />
            <h2 className="category-title">Ongoing Trips</h2>
            <span className="category-count">({TRIPS_DATA.ongoing.length})</span>
          </div>

          <div className="trip-cards-list">
            {TRIPS_DATA.ongoing.map((trip) => (
              <div key={trip.id} className="trip-overview-card ongoing-glow">
                <div className="overview-img-wrap">
                  <img src={trip.image} alt={trip.title} className="overview-img" />
                  <span className="live-status-pill">Active Now • {trip.progress}</span>
                </div>

                <div className="overview-content">
                  <div className="overview-top-row">
                    <h3 className="overview-title">{trip.title}</h3>
                    <span className="budget-spent-pill">Spent: {trip.spent}</span>
                  </div>

                  <div className="overview-meta-row">
                    <span className="meta-item"><MapPin size={14} /> {trip.location}</span>
                    <span className="meta-item"><Calendar size={14} /> {trip.dates}</span>
                  </div>

                  <p className="overview-desc">{trip.overview}</p>

                  <div className="overview-actions-row">
                    <button 
                      className="overview-action-btn primary"
                      onClick={() => navigate('/itinerary-view')}
                    >
                      <span>View Live Itinerary</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Upcoming Trips Section */}
        <section className="trip-category-block">
          <div className="category-header">
            <div className="category-indicator upcoming" />
            <h2 className="category-title">Up-coming Trips</h2>
            <span className="category-count">({TRIPS_DATA.upcoming.length})</span>
          </div>

          <div className="trip-cards-list">
            {TRIPS_DATA.upcoming.map((trip) => (
              <div key={trip.id} className="trip-overview-card">
                <div className="overview-img-wrap">
                  <img src={trip.image} alt={trip.title} className="overview-img" />
                  <span className="upcoming-status-pill">{trip.countdown}</span>
                </div>

                <div className="overview-content">
                  <div className="overview-top-row">
                    <h3 className="overview-title">{trip.title}</h3>
                    <span className="budget-pill">Budget: {trip.budget}</span>
                  </div>

                  <div className="overview-meta-row">
                    <span className="meta-item"><MapPin size={14} /> {trip.location}</span>
                    <span className="meta-item"><Calendar size={14} /> {trip.dates}</span>
                  </div>

                  <p className="overview-desc">{trip.overview}</p>

                  <div className="overview-actions-row">
                    <button 
                      className="overview-action-btn secondary"
                      onClick={() => navigate('/build-itinerary')}
                    >
                      Edit Itinerary
                    </button>
                    <button 
                      className="overview-action-btn primary"
                      onClick={() => navigate('/itinerary-view')}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Completed Trips Section */}
        <section className="trip-category-block">
          <div className="category-header">
            <div className="category-indicator completed" />
            <h2 className="category-title">Completed Trips</h2>
            <span className="category-count">({TRIPS_DATA.completed.length})</span>
          </div>

          <div className="trip-cards-list">
            {TRIPS_DATA.completed.map((trip) => (
              <div key={trip.id} className="trip-overview-card completed-style">
                <div className="overview-img-wrap">
                  <img src={trip.image} alt={trip.title} className="overview-img" />
                  <span className="completed-status-pill">
                    <CheckCircle2 size={12} />
                    <span>{trip.status}</span>
                  </span>
                </div>

                <div className="overview-content">
                  <div className="overview-top-row">
                    <h3 className="overview-title">{trip.title}</h3>
                    <span className="budget-pill">Total: {trip.totalSpent}</span>
                  </div>

                  <div className="overview-meta-row">
                    <span className="meta-item"><MapPin size={14} /> {trip.location}</span>
                    <span className="meta-item"><Calendar size={14} /> {trip.dates}</span>
                  </div>

                  <p className="overview-desc">{trip.overview}</p>

                  <div className="overview-actions-row">
                    <button 
                      className="overview-action-btn primary"
                      onClick={() => navigate('/itinerary-view')}
                    >
                      Review Trip Memories
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

export default TripListingPage;
