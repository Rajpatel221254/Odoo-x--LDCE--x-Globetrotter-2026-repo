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
  Clock,
  Star,
  DollarSign,
  Plus,
  Compass,
  Tag,
  Check
} from 'lucide-react';
import './style/ActivitySearchPage.css';

import img1 from '../../assets/home_image_1.png';
import img2 from '../../assets/home_image_2.png';
import img3 from '../../assets/home_image_3.png';
import loginImg1 from '../../assets/login_image_1.jpg';
import loginImg2 from '../../assets/login_image_2.jpg';
import loginImg3 from '../../assets/login_image_3.jpg';

const ACTIVITIES_RESULTS = [
  {
    id: 1,
    title: 'Glacier Express Scenic Train & Alpine Panorama',
    city: 'Zermatt to St. Moritz, Switzerland',
    duration: 'Full Day (8 hrs)',
    rating: 4.95,
    reviews: 420,
    price: '$180',
    category: 'Scenic Transit',
    image: loginImg1,
    description: 'Panoramic glass-dome train traversing 291 bridges, 91 tunnels, and breathtaking alpine mountain passes.'
  },
  {
    id: 2,
    title: 'Traditional Kyoto Tea Ceremony & Zen Garden Walk',
    city: 'Kyoto, Japan',
    duration: '3 Hours',
    rating: 4.92,
    reviews: 310,
    price: '$65',
    category: 'Cultural',
    image: loginImg2,
    description: 'Learn authentic matcha preparation from a certified tea master in a historic 300-year-old wooden teahouse.'
  },
  {
    id: 3,
    title: 'Santorini Sunset Private Catamaran Cruise & Dinner',
    city: 'Santorini, Greece',
    duration: '5 Hours',
    rating: 4.88,
    reviews: 580,
    price: '$145',
    category: 'Water Experience',
    image: loginImg3,
    description: 'Sail into the caldera during golden hour, swim in volcanic hot springs, and enjoy freshly grilled seafood on board.'
  },
  {
    id: 4,
    title: 'Geirangerfjord Sea Kayaking & Seven Sisters Falls',
    city: 'Geiranger, Norway',
    duration: '4.5 Hours',
    rating: 4.97,
    reviews: 240,
    price: '$110',
    category: 'Adventure',
    image: img2,
    description: 'Paddle right beneath the roaring waterfalls with towering sheer cliff faces on either side of the fjord.'
  },
  {
    id: 5,
    title: 'Ubud Sacred Monkey Forest & Waterfall Trek',
    city: 'Bali, Indonesia',
    duration: '6 Hours',
    rating: 4.86,
    reviews: 690,
    price: '$45',
    category: 'Nature & Wildlife',
    image: img3,
    description: 'Encounter playful macaque monkeys in ancient jungle ruins followed by swimming in hidden canyon waterfalls.'
  },
  {
    id: 6,
    title: 'Interlaken Tandem Paragliding Over Turquoise Lakes',
    city: 'Interlaken, Switzerland',
    duration: '2 Hours',
    rating: 4.99,
    reviews: 820,
    price: '$195',
    category: 'Extreme Adventure',
    image: img1,
    description: 'Launch from high mountain pastures with a certified tandem pilot and glide gracefully above Interlaken valley.'
  }
];

const ActivitySearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addedItems, setAddedItems] = useState([]);

  const toggleAddItem = (id) => {
    setAddedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredResults = ACTIVITIES_RESULTS.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="activity-search-container">
      <Navbar />

      <main className="activity-search-main">
        <div className="page-header-row">
          <div>
            <span className="screen-badge">Screen 8 • Activity / City Search</span>
            <h1 className="page-main-heading">Explore Activities & City Experiences</h1>
          </div>
        </div>

        {/* Controls Toolbar matching wireframe */}
        <div className="controls-toolbar">
          <div className="search-bar-wrapper">
            <Search size={18} className="search-input-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by city, activity, attraction, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-controls-group">
            <button className="control-btn">
              <Layers size={15} />
              <span>Group by: Category</span>
            </button>
            <button className="control-btn">
              <SlidersHorizontal size={15} />
              <span>Filter: All</span>
            </button>
            <button className="control-btn">
              <ArrowUpDown size={15} />
              <span>Sort by: Rating</span>
            </button>
          </div>
        </div>

        {/* Results List Section matching wireframe */}
        <section className="search-results-section">
          <div className="results-header-row">
            <h2 className="results-section-title">Results ({filteredResults.length})</h2>
            <div className="section-divider-line" />
            <span className="results-filter-badge">Showing verified activities</span>
          </div>

          <div className="results-stacked-list">
            {filteredResults.map((item) => {
              const isAdded = addedItems.includes(item.id);
              return (
                <div key={item.id} className="result-stacked-card">
                  <div className="result-card-img-box">
                    <img src={item.image} alt={item.title} className="result-card-img" />
                    <span className="result-category-tag">{item.category}</span>
                  </div>

                  <div className="result-card-details">
                    <div className="result-title-price-row">
                      <div>
                        <h3 className="result-item-title">{item.title}</h3>
                        <div className="result-meta-row">
                          <span className="meta-sub-item">
                            <MapPin size={13} color="#a78bfa" />
                            {item.city}
                          </span>
                          <span className="meta-sub-item">
                            <Clock size={13} color="#a78bfa" />
                            {item.duration}
                          </span>
                        </div>
                      </div>

                      <div className="result-price-column">
                        <span className="result-price-val">{item.price}</span>
                        <span className="result-per-person">per person</span>
                      </div>
                    </div>

                    <p className="result-description-text">{item.description}</p>

                    <div className="result-footer-actions">
                      <div className="result-rating-pill">
                        <Star size={13} fill="#fbbf24" stroke="none" />
                        <span className="rating-score">{item.rating}</span>
                        <span className="rating-reviews">({item.reviews} reviews)</span>
                      </div>

                      <button
                        className={`add-itinerary-action-btn ${isAdded ? 'added' : ''}`}
                        onClick={() => toggleAddItem(item.id)}
                      >
                        {isAdded ? (
                          <>
                            <Check size={15} />
                            <span>Added to Trip</span>
                          </>
                        ) : (
                          <>
                            <Plus size={15} />
                            <span>Add to Itinerary</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ActivitySearchPage;
