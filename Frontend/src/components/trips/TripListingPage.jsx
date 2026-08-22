import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';
import Footer from '../landing/Footer.jsx';
import axiosInstance from '../../api/axiosInstance.js';
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
  DollarSign,
  Loader2,
  AlertCircle
} from 'lucide-react';
import './style/TripListingPage.css';

const TripListingPage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Date: Newest');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/trips');
        setTrips(res.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load trips.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const formatDateRange = (start, end) => {
    if (!start || !end) return '';
    const s = new Date(start);
    const e = new Date(end);
    const optionsShort = { day: '2-digit', month: 'short' };
    const optionsYear = { day: '2-digit', month: 'short', year: 'numeric' };
    
    if (s.getFullYear() === e.getFullYear()) {
      return `${s.toLocaleDateString('en-US', optionsShort)} - ${e.toLocaleDateString('en-US', optionsYear)}`;
    }
    return `${s.toLocaleDateString('en-US', optionsYear)} - ${e.toLocaleDateString('en-US', optionsYear)}`;
  };

  const getTripLocation = (trip) => {
    if (!trip.stops || trip.stops.length === 0) return 'No stops planned';
    const cities = trip.stops.map(s => s.cityId?.name).filter(Boolean);
    const uniqueCities = [...new Set(cities)];
    if (uniqueCities.length === 0) return 'No stops planned';
    return uniqueCities.join(' & ');
  };

  const getTripImage = (trip) => {
    if (trip.coverImage) return trip.coverImage;
    if (trip.stops && trip.stops.length > 0 && trip.stops[0].cityId?.image) {
      return trip.stops[0].cityId.image;
    }
    return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80';
  };

  const getTripProgress = (trip) => {
    if (trip.status === 'completed') return 'Completed';
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const today = new Date();
    
    if (today < start) {
      const diffTime = Math.abs(start - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Starts in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (today > end) {
      return 'Completed';
    } else {
      const totalTime = Math.abs(end - start);
      const totalDays = Math.ceil(totalTime / (1000 * 60 * 60 * 24)) || 1;
      const progressTime = Math.abs(today - start);
      const progressDays = Math.ceil(progressTime / (1000 * 60 * 60 * 24)) || 1;
      return `Day ${progressDays} of ${totalDays}`;
    }
  };

  // Filter and sort trips
  const filteredTrips = trips.filter(trip => {
    const nameMatch = trip.name.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (trip.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const locationMatch = getTripLocation(trip).toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || descMatch || locationMatch;
  });

  // Sorting
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === 'Date: Newest') {
      return new Date(b.startDate) - new Date(a.startDate);
    } else if (sortBy === 'Date: Oldest') {
      return new Date(a.startDate) - new Date(b.startDate);
    } else if (sortBy === 'Budget: Highest') {
      return b.totalBudget - a.totalBudget;
    } else if (sortBy === 'Budget: Lowest') {
      return a.totalBudget - b.totalBudget;
    }
    return 0;
  });

  const ongoingTrips = sortedTrips.filter(t => t.status === 'ongoing');
  const upcomingTrips = sortedTrips.filter(t => t.status === 'planning');
  const completedTrips = sortedTrips.filter(t => t.status === 'completed');

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
            <button className="control-btn" onClick={() => setSortBy(sortBy === 'Date: Newest' ? 'Budget: Highest' : 'Date: Newest')}>
              <ArrowUpDown size={15} />
              <span>Sort: {sortBy}</span>
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="auth-error-banner animate-shake" style={{ marginBottom: '20px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="trips-loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '15px' }}>
            <Loader2 className="animate-spin" size={40} style={{ color: 'var(--primary-color, #f05a36)' }} />
            <p style={{ color: '#888' }}>Loading your trips from database...</p>
          </div>
        ) : trips.length === 0 ? (
          // Empty State
          <div className="trips-empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Plane size={48} style={{ color: '#555', marginBottom: '20px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>No trips found</h3>
            <p style={{ color: '#888', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px' }}>
              You haven't planned any trips yet. Start mapping your next journey today!
            </p>
            <button 
              className="new-trip-btn white-btn-black-text"
              onClick={() => navigate('/create-trip')}
              style={{ display: 'inline-flex', margin: '0 auto' }}
            >
              <Plus size={18} />
              <span>Plan Your First Trip</span>
            </button>
          </div>
        ) : (
          <>
            {/* 1. Ongoing Trips Section */}
            {ongoingTrips.length > 0 && (
              <section className="trip-category-block">
                <div className="category-header">
                  <div className="category-indicator live" />
                  <h2 className="category-title">Ongoing Trips</h2>
                  <span className="category-count">({ongoingTrips.length})</span>
                </div>

                <div className="trip-cards-list">
                  {ongoingTrips.map((trip) => (
                    <div key={trip._id} className="trip-overview-card ongoing-glow" onClick={() => navigate(`/itinerary?tripId=${trip._id}`)} style={{ cursor: 'pointer' }}>
                      <div className="overview-img-wrap">
                        <img src={getTripImage(trip)} alt={trip.name} className="overview-img" />
                        <span className="live-status-pill">Active Now • {getTripProgress(trip)}</span>
                      </div>

                      <div className="overview-content">
                        <div className="overview-top-row">
                          <h3 className="overview-title">{trip.name}</h3>
                          <span className="budget-spent-pill">Budget: {trip.currency} {trip.totalBudget}</span>
                        </div>

                        <div className="overview-meta-row">
                          <span className="meta-item"><MapPin size={14} /> {getTripLocation(trip)}</span>
                          <span className="meta-item"><Calendar size={14} /> {formatDateRange(trip.startDate, trip.endDate)}</span>
                        </div>

                        <p className="overview-desc">{trip.description || 'No description provided.'}</p>

                        <div className="overview-actions-row">
                          <button 
                            className="overview-action-btn primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/itinerary?tripId=${trip._id}`);
                            }}
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
            )}

            {/* 2. Upcoming Trips Section */}
            {upcomingTrips.length > 0 && (
              <section className="trip-category-block">
                <div className="category-header">
                  <div className="category-indicator upcoming" />
                  <h2 className="category-title">Upcoming Trips</h2>
                  <span className="category-count">({upcomingTrips.length})</span>
                </div>

                <div className="trip-cards-list">
                  {upcomingTrips.map((trip) => (
                    <div key={trip._id} className="trip-overview-card" onClick={() => navigate(`/itinerary?tripId=${trip._id}`)} style={{ cursor: 'pointer' }}>
                      <div className="overview-img-wrap">
                        <img src={getTripImage(trip)} alt={trip.name} className="overview-img" />
                        <span className="upcoming-status-pill">{getTripProgress(trip)}</span>
                      </div>

                      <div className="overview-content">
                        <div className="overview-top-row">
                          <h3 className="overview-title">{trip.name}</h3>
                          <span className="budget-pill">Budget: {trip.currency} {trip.totalBudget}</span>
                        </div>

                        <div className="overview-meta-row">
                          <span className="meta-item"><MapPin size={14} /> {getTripLocation(trip)}</span>
                          <span className="meta-item"><Calendar size={14} /> {formatDateRange(trip.startDate, trip.endDate)}</span>
                        </div>

                        <p className="overview-desc">{trip.description || 'No description provided.'}</p>

                        <div className="overview-actions-row">
                          <button 
                            className="overview-action-btn secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/build-itinerary?tripId=${trip._id}`);
                            }}
                          >
                            Edit Itinerary
                          </button>
                          <button 
                            className="overview-action-btn primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/itinerary?tripId=${trip._id}`);
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Completed Trips Section */}
            {completedTrips.length > 0 && (
              <section className="trip-category-block">
                <div className="category-header">
                  <div className="category-indicator completed" />
                  <h2 className="category-title">Completed Trips</h2>
                  <span className="category-count">({completedTrips.length})</span>
                </div>

                <div className="trip-cards-list">
                  {completedTrips.map((trip) => (
                    <div key={trip._id} className="trip-overview-card completed-style" onClick={() => navigate(`/itinerary?tripId=${trip._id}`)} style={{ cursor: 'pointer' }}>
                      <div className="overview-img-wrap">
                        <img src={getTripImage(trip)} alt={trip.name} className="overview-img" />
                        <span className="completed-status-pill">
                          <CheckCircle2 size={12} />
                          <span>Completed</span>
                        </span>
                      </div>

                      <div className="overview-content">
                        <div className="overview-top-row">
                          <h3 className="overview-title">{trip.name}</h3>
                          <span className="budget-pill">Total: {trip.currency} {trip.totalBudget}</span>
                        </div>

                        <div className="overview-meta-row">
                          <span className="meta-item"><MapPin size={14} /> {getTripLocation(trip)}</span>
                          <span className="meta-item"><Calendar size={14} /> {formatDateRange(trip.startDate, trip.endDate)}</span>
                        </div>

                        <p className="overview-desc">{trip.description || 'No description provided.'}</p>

                        <div className="overview-actions-row">
                          <button 
                            className="overview-action-btn primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/itinerary?tripId=${trip._id}`);
                            }}
                          >
                            Review Trip Memories
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TripListingPage;
