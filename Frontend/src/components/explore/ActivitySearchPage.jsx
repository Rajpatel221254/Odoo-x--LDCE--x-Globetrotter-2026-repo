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
  Clock,
  Star,
  DollarSign,
  Plus,
  Compass,
  Tag,
  Check,
  Loader2,
  AlertCircle,
  X,
  Sparkles
} from 'lucide-react';
import './style/ActivitySearchPage.css';

const ActivitySearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State for exploring activities within a selected city
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityPlaces, setCityPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [addedItems, setAddedItems] = useState([]);

  // Fetch all cities on mount
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async (query = '') => {
    try {
      setLoading(true);
      setError(null);
      const url = query.trim() 
        ? `/cities?search=${encodeURIComponent(query.trim())}&limit=100` 
        : `/cities?limit=100`;
      const res = await axiosInstance.get(url);
      setCities(res.data.data || []);
    } catch (err) {
      console.error('Error fetching cities:', err);
      setError('Failed to load cities. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchCities(searchQuery);
  };

  // When clicking "Explore Activities", load places/activities for that city
  const handleExploreCity = async (city) => {
    setSelectedCity(city);
    setLoadingPlaces(true);
    setCityPlaces([]);
    try {
      const res = await axiosInstance.get(`/places?cityId=${encodeURIComponent(city.name)}&limit=100`);
      setCityPlaces(res.data.data || []);
    } catch (err) {
      console.error('Error fetching places for city:', err);
    } finally {
      setLoadingPlaces(false);
    }
  };

  const toggleAddItem = (id) => {
    setAddedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderStars = (popularity) => {
    const stars = [];
    const count = Math.min(5, Math.max(1, popularity || 3));
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={14} 
          fill={i < count ? "#fbbf24" : "none"} 
          stroke={i < count ? "none" : "currentColor"} 
          style={{ marginRight: '2px', color: i < count ? '#fbbf24' : '#555' }}
        />
      );
    }
    return stars;
  };

  const renderCostIndicator = (costIndex) => {
    const indicators = [];
    const count = Math.min(5, Math.max(1, costIndex || 3));
    for (let i = 0; i < count; i++) {
      indicators.push(<DollarSign key={i} size={14} style={{ color: '#10b981', marginRight: '-2px' }} />);
    }
    return indicators;
  };

  // Use city image from database (seeded Unsplash URLs), with a generic fallback
  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="activity-search-container">
      <Navbar />

      <main className="activity-search-main">
        <div className="page-header-row">
          <div>
            <span className="screen-badge">Screen 8 • Explore Cities</span>
            <h1 className="page-main-heading">Explore World Destinations</h1>
          </div>
        </div>

        {/* Search Toolbar */}
        <form className="controls-toolbar" onSubmit={handleSearchSubmit}>
          <div className="search-bar-wrapper">
            <Search size={18} className="search-input-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search destinations by name or country (e.g. Paris, India) and press Enter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-controls-group">
            <button type="submit" className="control-btn" style={{ background: 'var(--primary-color, #f05a36)', color: '#fff', border: 'none' }}>
              <span>Search Destinations</span>
            </button>
          </div>
        </form>

        {/* Error Banner */}
        {error && (
          <div className="auth-error-banner animate-shake" style={{ marginBottom: '20px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Results List Section */}
        <section className="search-results-section">
          <div className="results-header-row">
            <h2 className="results-section-title">Destinations ({cities.length})</h2>
            <div className="section-divider-line" />
            <span className="results-filter-badge">Showing verified cities</span>
          </div>

          {loading ? (
            <div className="trips-loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '15px' }}>
              <Loader2 className="animate-spin" size={40} style={{ color: 'var(--primary-color, #f05a36)' }} />
              <p style={{ color: '#888' }}>Searching databases for cities...</p>
            </div>
          ) : cities.length === 0 ? (
            <div className="trips-empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <Compass size={48} style={{ color: '#555', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>No destinations found</h3>
              <p style={{ color: '#888', maxWidth: '400px', margin: '0 auto' }}>
                We couldn't find any cities matching your query. Try searching for a different destination!
              </p>
            </div>
          ) : (
            <div className="results-stacked-list">
              {cities.map((city) => {
                return (
                  <div key={city._id} className="result-stacked-card" onClick={() => handleExploreCity(city)} style={{ cursor: 'pointer' }}>
                    <div className="result-card-img-box">
                      <img 
                        src={city.image || FALLBACK_IMG} 
                        alt={city.name} 
                        className="result-card-img" 
                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                      />
                      <span className="result-category-tag">{city.region || 'Destinations'}</span>
                    </div>

                    <div className="result-card-details">
                      <div className="result-title-price-row">
                        <div>
                          <h3 className="result-item-title">{city.name}, {city.country}</h3>
                          <div className="result-meta-row" style={{ marginTop: '8px', gap: '15px' }}>
                            <span className="meta-sub-item" style={{ display: 'inline-flex', alignItems: 'center' }}>
                              {renderStars(city.popularity)}
                              <span style={{ marginLeft: '5px', fontSize: '12px', color: '#888' }}>Popularity</span>
                            </span>
                            <span className="meta-sub-item" style={{ display: 'inline-flex', alignItems: 'center' }}>
                              {renderCostIndicator(city.costIndex)}
                              <span style={{ marginLeft: '5px', fontSize: '12px', color: '#888' }}>Budget Level</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="result-description-text" style={{ marginTop: '12px', color: '#aaa', fontSize: '14px', lineHeight: '1.6' }}>
                        {city.description || `Discover the culture, cuisine, and scenery of ${city.name}. Located in the ${city.region || 'beautiful'} region of ${city.country}.`}
                      </p>

                      <div className="result-footer-actions" style={{ marginTop: '15px' }}>
                        <button
                          type="button"
                          className="add-itinerary-action-btn"
                          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExploreCity(city);
                          }}
                        >
                          <Compass size={15} style={{ marginRight: '5px' }} />
                          <span>Explore Activities</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ACTIVITIES DETAIL MODAL FOR SELECTED CITY */}
      {selectedCity && (
        <div className="modal-backdrop" onClick={() => setSelectedCity(null)}>
          <div className="dark-modal" style={{ maxWidth: '700px', width: '90%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--primary-color, #f05a36)' }} />
                <h3>Experiences in {selectedCity.name}</h3>
              </div>
              <button type="button" className="close-btn" onClick={() => setSelectedCity(null)}>
                <X size={18} />
              </button>
            </div>
            
            <p className="modal-desc" style={{ marginBottom: '15px' }}>
              We found {cityPlaces.length} points of interest and activities for your trip to {selectedCity.name}.
            </p>

            <div className="modal-body custom-scroll" style={{ overflowY: 'auto', flex: 1, paddingRight: '5px' }}>
              {loadingPlaces ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '10px' }}>
                  <Loader2 className="animate-spin" size={30} style={{ color: 'var(--primary-color, #f05a36)' }} />
                  <p style={{ color: '#888', fontSize: '14px' }}>Loading activities...</p>
                </div>
              ) : cityPlaces.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: '#888' }}>
                  <Compass size={36} style={{ color: '#444', marginBottom: '10px' }} />
                  <p>No specific places found for this city. Try exploring another destination.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cityPlaces.map((place) => {
                    const isAdded = addedItems.includes(place._id);
                    return (
                      <div key={place._id} style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <img 
                          src={place.image || selectedCity.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=150&q=80'} 
                          alt={place.name} 
                          style={{ width: '80px', height: '80px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>{place.name}</h4>
                              <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', color: '#ccc' }}>
                                {place.category || 'Sightseeing'}
                              </span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#888', marginTop: '4px', lineBreak: 'anywhere' }}>
                              {place.description || 'Discover and explore this spectactular point of interest.'}
                            </p>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
                              {place.estimatedCost ? `Est. Cost: ₹${place.estimatedCost}` : 'Free Entry'}
                            </span>
                            <button
                              type="button"
                              className={`add-itinerary-action-btn ${isAdded ? 'added' : ''}`}
                              onClick={() => toggleAddItem(place._id)}
                              style={{ padding: '4px 10px', fontSize: '11px' }}
                            >
                              {isAdded ? (
                                <>
                                  <Check size={12} />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <Plus size={12} />
                                  <span>Add stop</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="modal-save-btn" 
                onClick={() => {
                  setSelectedCity(null);
                  navigate('/create-trip');
                }}
              >
                Plan trip to {selectedCity.name}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ActivitySearchPage;
