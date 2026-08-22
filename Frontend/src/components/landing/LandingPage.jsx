import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';
import Footer from './Footer.jsx';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Layers,
  MapPin,
  Calendar,
  Star,
  Users,
  Compass,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  Headphones,
  CheckCircle2,
  Sparkles,
  Route,
  WifiOff,
  DollarSign,
  Bot,
  Plane,
  Heart,
  ExternalLink,
  BookOpen,
  Map as MapIcon,
  Luggage,
  Hotel,
  Share2,
  FileText,
  Mail,
  Navigation,
  Globe,
  Check,
  Plus,
  Crosshair,
  X
} from 'lucide-react';
import './style/LandingPage.css';

// Visual assets
import homeImg1 from '../../assets/home_image_1.png';
import homeImg2 from '../../assets/home_image_2.png';
import homeImg3 from '../../assets/home_image_3.png';
import loginImg1 from '../../assets/login_image_1.jpg';
import loginImg2 from '../../assets/login_image_2.jpg';
import loginImg3 from '../../assets/login_image_3.jpg';
import mapImg from '../../assets/map.png';

const HERO_SLIDES = [
  { id: 0, image: homeImg1 },
  { id: 1, image: homeImg2 },
  { id: 2, image: homeImg3 }
];

const PRESS_LOGOS = [
  { name: 'CN Traveler', quote: '"The best travel app for comprehensive vacation planning."' },
  { name: 'WIRED', quote: '"Takes the stress and friction out of organizing group itineraries."' },
  { name: 'The New York Times', quote: '"A seamless, AI-assisted hub for modern travelers."' },
  { name: 'The Guardian', quote: '"Makes mapping, routing, and booking delightfully easy."' },
  { name: 'Thrillist', quote: '"Replaces dozens of spreadsheets and browser tabs."' }
];

const FEATURE_TABS = [
  {
    id: 'itinerary',
    title: 'Map-based Itinerary',
    heading: 'Create a trip itinerary to see everything in one place',
    desc: 'Add the attractions you want to visit and see how to go between them on a map. Check distances and travel times between locations and attractions, schedule specific times for your visits, and optimize your route so you can make the most of your trip. See your flights and hotels for the day to keep track of what’s coming up.',
    bullets: ['Visual route maps with travel times', 'Automated route optimization', 'Direct export to Google Maps & Apple Maps'],
    image: homeImg1
  },
  {
    id: 'attractions',
    title: 'Top Attractions & Food',
    heading: 'See top attractions and restaurants from the entire web',
    desc: 'Get recommended the top places to visit and the best restaurants. Get ratings for top attractions, check their opening hours, and access links to official websites. We’ve gathered consensus picks across Google, TripAdvisor, and Yelp in one unified spot.',
    bullets: ['Consensus ratings from multiple sources', 'Opening hours & contact details', '1-click add to your daily schedule'],
    image: loginImg2
  },
  {
    id: 'roadtrips',
    title: 'Road Trip Planner',
    heading: 'Plan road trips and hit the open road with ease',
    desc: 'Create a detailed itinerary for your road trip. Add all your stops, check distances and time between each location. See curated lists of the best scenic stops, gas stations, and viewpoints on your route between cities.',
    bullets: ['Calculate driving distance & gas estimates', 'Discover scenic route detours', 'Turn-by-turn navigation preview'],
    image: homeImg2
  },
  {
    id: 'reservations',
    title: 'Manage Reservations',
    heading: 'Manage all your bookings and email tickets with ease',
    desc: 'See your reservations, attachments, and confirmation emails in one place without having to search through your inbox. Forward reservation emails directly to TripMate, or connect your account to automatically import flights and hotels.',
    bullets: ['Auto-import confirmation emails', 'Flight status & gate change alerts', 'Offline access to tickets and barcodes'],
    image: loginImg3
  },
  {
    id: 'budget',
    title: 'Pack & Budget Efficiently',
    heading: 'Track expenses and split costs seamlessly with companions',
    desc: 'Keep track of your budget and split costs with your trip mates. View expense breakdowns by category, convert multi-currency expenses live, and use our preset smart packing checklists.',
    bullets: ['Multi-currency live conversion', '1-tap expense splitting among trip mates', 'Customizable smart packing lists'],
    image: homeImg3
  }
];

const WANDERLOG_12_POWER_TOOLS = [
  {
    icon: <Route size={22} color="#10b981" />,
    title: 'Route optimization',
    desc: 'Let us auto-arrange the best route for a smooth and efficient trip!'
  },
  {
    icon: <WifiOff size={22} color="#6366f1" />,
    title: 'Offline access',
    desc: 'Download your trip plan and access it anytime, even without an internet connection.'
  },
  {
    icon: <Calendar size={22} color="#38bdf8" />,
    title: 'Detailed Itinerary',
    desc: 'See your trip details—dates, destinations, reservations, and activities—all in one place.'
  },
  {
    icon: <Luggage size={22} color="#f59e0b" />,
    title: 'Reservations Hub',
    desc: 'Keep all your hotel, flight, car rental, and event reservations in one spot.'
  },
  {
    icon: <Hotel size={22} color="#ec4899" />,
    title: 'Lodging Comparison',
    desc: 'Book a place to stay: we gather all suggestions and compare prices for you!'
  },
  {
    icon: <Plane size={22} color="#a78bfa" />,
    title: 'Flight status tracker',
    desc: 'Track live flight status for real-time updates on delays and terminal gate changes.'
  },
  {
    icon: <Users size={22} color="#10b981" />,
    title: 'Real-time Collaboration',
    desc: 'Invite your trip mates and plan your upcoming journey together in real-time!'
  },
  {
    icon: <Bot size={22} color="#38bdf8" />,
    title: 'AI Travel Assistant',
    desc: 'Ask the AI Assistant to help plan your travel, recommend hidden gems, or answer questions.'
  },
  {
    icon: <CheckCircle2 size={22} color="#f59e0b" />,
    title: 'Packing checklist',
    desc: 'Manage a checklist of items to pack to ensure you don’t forget anything important.'
  },
  {
    icon: <BookOpen size={22} color="#ec4899" />,
    title: 'Travel guides',
    desc: 'Get inspired by global guides with expert tips, photography spots, and recommendations.'
  },
  {
    icon: <DollarSign size={22} color="#10b981" />,
    title: 'Budgeting & Splitting',
    desc: 'Set and manage your budget, track expenses, and split costs for group trips.'
  },
  {
    icon: <MapIcon size={22} color="#6366f1" />,
    title: 'Interactive Map view',
    desc: 'Add a place, and it’ll pop up on your map. Track your route and export to Google Maps!'
  }
];

const EXPLORE_PLACES_CITIES = [
  {
    id: 1,
    name: 'Paris',
    country: 'France',
    attractions: 'Eiffel Tower · Louvre Museum · Notre-Dame · Montmartre',
    image: loginImg3,
    tripsPlanned: '145k planned'
  },
  {
    id: 2,
    name: 'Tokyo',
    country: 'Japan',
    attractions: 'Tokyo Tower · Senso-ji Temple · Shibuya Crossing · Shinjuku',
    image: loginImg2,
    tripsPlanned: '182k planned'
  },
  {
    id: 3,
    name: 'New York City',
    country: 'United States',
    attractions: 'Statue of Liberty · Central Park · Times Square · Brooklyn Bridge',
    image: homeImg1,
    tripsPlanned: '210k planned'
  },
  {
    id: 4,
    name: 'Rome',
    country: 'Italy',
    attractions: 'Colosseum · Vatican City · Pantheon · Trevi Fountain',
    image: homeImg2,
    tripsPlanned: '128k planned'
  },
  {
    id: 5,
    name: 'Bangkok',
    country: 'Thailand',
    attractions: 'Grand Palace · Wat Arun · Chatuchak Market · Chao Phraya',
    image: homeImg3,
    tripsPlanned: '94k planned'
  },
  {
    id: 6,
    name: 'London',
    country: 'United Kingdom',
    attractions: 'Tower of London · British Museum · Buckingham Palace · Big Ben',
    image: loginImg1,
    tripsPlanned: '168k planned'
  }
];

const COMMUNITY_TRAVEL_GUIDES = [
  {
    id: 1,
    title: 'Paris 5 Day Tourist Itinerary + Local Recommendations',
    author: 'Elisa Li',
    views: '105,590 views',
    saves: '514 saves',
    image: loginImg3,
    summary: 'Studied abroad in Paris and visited 6 times. Complete walking guide from historic Latin Quarter cafes to hidden sunset viewpoints.'
  },
  {
    id: 2,
    title: 'Japan: Ultimate Heritage, Video Game & Culinary Quest',
    author: 'Tuyet Sato',
    views: '36,112 views',
    saves: '691 saves',
    image: loginImg2,
    summary: 'Spent 3 months in Tokyo, Kyoto, and Osaka. Contains all the best arcade districts, themed cafes, and quiet bamboo gardens.'
  },
  {
    id: 3,
    title: 'Swiss Alps Hiking & Scenic Rail Passes Complete Guide',
    author: 'Marcus Vance',
    views: '48,220 views',
    saves: '820 saves',
    image: homeImg1,
    summary: 'Everything you need to know about navigating the Berner Oberland, Jungfraujoch cogwheel trains, and staying in alpine huts.'
  },
  {
    id: 4,
    title: 'Nordic Fjords & Northern Lights Campervan Road Trip',
    author: 'Gillian Morris',
    views: '28,075 views',
    saves: '342 saves',
    image: homeImg2,
    summary: 'Scenic driving route from Bergen through Geirangerfjord up to the Arctic Circle in Tromsø.'
  }
];

const TRAVELER_TESTIMONIALS = [
  {
    id: 1,
    quote: "Planning your trip by having all the attractions already plugged into a map makes trip planning so much easier. Adding an adventure not in the app is also easy. The connection to Google Maps makes everything connected!",
    author: "Rachel K.",
    trip: "Road trip through Southern Italy"
  },
  {
    id: 2,
    quote: "The absolute best travel app I've ever tried. Complete and comprehensive planning made our 15 day trip to UK and Switzerland effortless. Tracks sights, hotels, flights, and costs with maps.",
    author: "Mark & Lisa D.",
    trip: "15-day European Vacation"
  },
  {
    id: 3,
    quote: "So incredibly helpful, time saving and intuitive! I can't imagine planning a group trip without it! The expense sharing tool alone made it invaluable. All our reservations in one app for all to share.",
    author: "Elena Rostova",
    trip: "Group trip with 6 friends"
  }
];

const LandingPage = () => {
  const navigate = useNavigate();

  // Hero carousel
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeFeatureTab, setActiveFeatureTab] = useState(FEATURE_TABS[0]);

  // Interactive Travel Map State
  const [visitedCountries, setVisitedCountries] = useState(5);
  const [visitedCities, setVisitedCities] = useState(8);
  const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false);
  const [newPlaceInput, setNewPlaceInput] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleAddVisitedPlace = (e) => {
    e.preventDefault();
    if (!newPlaceInput.trim()) return;
    setVisitedCities((prev) => prev + 1);
    setVisitedCountries((prev) => prev + 1);
    alert(`Added "${newPlaceInput}" to your visited places!`);
    setNewPlaceInput('');
    setIsAddPlaceModalOpen(false);
  };

  const getRankBadge = () => {
    if (visitedCountries >= 10) return '✈️ Master Globetrotter';
    if (visitedCountries >= 5) return '🧭 Active Explorer';
    return '🖐️ Travel Newcomer';
  };

  return (
    <div className="landing-page-container">
      <Navbar />

      <main className="landing-main-content">
        {/* =========================================================================
            1. HERO SECTION (WANDERLOG EXACT HERO)
            ========================================================================= */}
        <section className="wanderlog-hero-card">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-bg-layer ${activeHeroSlide === index ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}

          <div className="hero-dark-overlay" />

          <div className="hero-center-content">
            <span className="hero-pill-badge">
              <Sparkles size={14} color="#38bdf8" />
              <span>The Free Vacation Planner & Itinerary App</span>
            </span>

            <h1 className="hero-giant-title">
              Your Entire Trip<br />
              In One Place
            </h1>

            <p className="hero-lead-description">
              Create detailed itineraries, explore user-shared guides, optimize routes on interactive maps, and manage all your bookings seamlessly.
            </p>

            <div className="hero-actions-group">
              <button
                className="hero-primary-btn white-btn-black-text"
                onClick={() => navigate('/create-trip')}
              >
                <span>Start Planning Free</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="hero-secondary-btn"
                onClick={() => navigate('/explore')}
              >
                <span>Explore Destinations</span>
              </button>
            </div>

            <div className="hero-social-proof">
              <div className="proof-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#fbbf24" stroke="none" />
                ))}
              </div>
              <span className="proof-text">Over <strong>1 Million+</strong> travelers trust TripMate</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. USER ASSET MAP SECTION (map.png)
            ========================================================================= */}
        <section className="travel-map-interactive-section">
          <div className="travel-map-frame-box">
            {/* User Provided Map Image */}
            <img src={mapImg} alt="Interactive Travel Map" className="user-map-rendered-img" />

            {/* Top-Left Floating Stats Badge */}
            <div className="map-stats-floating-badge">
              <div className="map-stat-col">
                <span className="map-stat-num">{visitedCountries}</span>
                <span className="map-stat-sub">COUNTRIES</span>
              </div>
              <div className="map-stat-divider" />
              <div className="map-stat-col">
                <span className="map-stat-num">{visitedCities}</span>
                <span className="map-stat-sub">CITIES & REGIONS</span>
              </div>
              <div className="map-stat-divider" />
              <div className="map-rank-badge">
                <span>{getRankBadge()}</span>
              </div>
            </div>

            {/* Top-Right "Add visited places" Button */}
            <button
              className="add-visited-places-floating-btn"
              onClick={() => setIsAddPlaceModalOpen(true)}
            >
              <span>Add visited places</span>
            </button>
          </div>
        </section>

        {/* Modal: Add Visited Places */}
        {isAddPlaceModalOpen && (
          <div className="planner-modal-backdrop" onClick={() => setIsAddPlaceModalOpen(false)}>
            <div className="planner-modal-card" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close-btn"
                onClick={() => setIsAddPlaceModalOpen(false)}
              >
                <X size={20} />
              </button>
              <h3 className="modal-title">Mark Visited Destination</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Track countries and cities you've explored to unlock explorer achievements!
              </p>
              <form onSubmit={handleAddVisitedPlace} className="auth-form">
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Barcelona, Spain or Kyoto, Japan"
                  value={newPlaceInput}
                  onChange={(e) => setNewPlaceInput(e.target.value)}
                  required
                />
                <button type="submit" className="submit-account-btn white-btn-black-text">
                  Save to Visited List
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. RECOMMENDED BY THE PRESS / MEDIA ACCLAIM
            ========================================================================= */}
        <section className="press-mentions-section">
          <span className="press-sub-title">RECOMMENDED BY LEADING TRAVEL & TECH MEDIA</span>
          <div className="press-cards-row">
            {PRESS_LOGOS.map((press) => (
              <div key={press.name} className="press-quote-card">
                <span className="press-brand-tag">@{press.name}</span>
                <p className="press-quote-text">{press.quote}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            4. DEEP DIVE FEATURE SHOWCASE (IN VIBRANT LIGHT GREEN ACCENT BACKGROUND)
            ========================================================================= */}
        <section className="feature-deep-dive-section light-green-bg-card">
          <div className="section-title-centered light-text-mode">
            <span className="section-tag-pill green-pill">Intelligent Trip Planning</span>
            <h2 className="section-main-title dark-title">Features to Replace All Your Other Tools</h2>
            <p className="section-subtitle dark-sub">
              No more switching between dozens of apps, browser tabs, and spreadsheets to keep track of your vacation plans.
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="feature-tab-selectors light-mode-tabs">
            {FEATURE_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`feature-tab-btn ${activeFeatureTab.id === tab.id ? 'active-green' : ''}`}
                onClick={() => setActiveFeatureTab(tab)}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Active Tab Showcase Box */}
          <div className="feature-showcase-box light-box-shadow">
            <div className="showcase-content-col">
              <h3 className="showcase-heading dark-heading">{activeFeatureTab.heading}</h3>
              <p className="showcase-desc dark-desc">{activeFeatureTab.desc}</p>

              <div className="showcase-bullets-list">
                {activeFeatureTab.bullets.map((b, i) => (
                  <div key={i} className="bullet-item dark-bullet">
                    <Check size={16} color="#059669" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="showcase-actions">
                <button
                  className="showcase-cta-btn green-solid-btn"
                  onClick={() => navigate('/create-trip')}
                >
                  <span>Try It Out</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="showcase-visual-col">
              <div className="showcase-img-frame">
                <img
                  src={activeFeatureTab.image}
                  alt={activeFeatureTab.title}
                  className="showcase-img"
                />
                <div className="showcase-overlay-badge">
                  <MapPin size={15} color="#10b981" />
                  <span>Real-time Map Synchronization</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. WANDERLOG 12 POWER TOOLS GRID
            ========================================================================= */}
        <section className="power-tools-section">
          <div className="section-title-centered">
            <span className="section-tag-pill">Everything You Need</span>
            <h2 className="section-main-title">Join TripMate to Plan Seamless Journeys</h2>
            <p className="section-subtitle">
              Plan your itinerary, find lodging, optimize routes, and split expenses — all in one unified app.
            </p>
          </div>

          <div className="power-tools-grid">
            {WANDERLOG_12_POWER_TOOLS.map((tool, idx) => (
              <div key={idx} className="tool-card-box">
                <div className="tool-icon-wrapper">{tool.icon}</div>
                <h3 className="tool-title">{tool.title}</h3>
                <p className="tool-desc">{tool.desc}</p>
              </div>
            ))}
          </div>

          <div className="tools-bottom-action">
            <button
              className="tools-cta-btn white-btn-black-text"
              onClick={() => navigate('/create-trip')}
            >
              <span>Start Planning Your Next Trip</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* =========================================================================
            6. EXPLORE PLACES TO VISIT ACROSS THE WORLD
            ========================================================================= */}
        <section className="places-explorer-section">
          <div className="explorer-header-row">
            <div>
              <span className="section-tag-pill">Global Discovery</span>
              <h2 className="section-main-title">Explore Places to Visit Across the World</h2>
              <p className="section-subtitle">
                Consensus attractions, ratings, and top activities handpicked from across the web.
              </p>
            </div>

            <button
              className="view-all-places-btn"
              onClick={() => navigate('/explore')}
            >
              <span>Explore All Cities</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="places-cards-grid">
            {EXPLORE_PLACES_CITIES.map((place) => (
              <div
                key={place.id}
                className="place-city-card"
                onClick={() => navigate('/explore')}
              >
                <div className="place-img-box">
                  <img src={place.image} alt={place.name} className="place-img" />
                  <span className="place-trips-badge">{place.tripsPlanned}</span>
                </div>

                <div className="place-card-body">
                  <div className="place-title-row">
                    <h3 className="place-name">{place.name}</h3>
                    <span className="place-country">{place.country}</span>
                  </div>
                  <p className="place-attractions-list">{place.attractions}</p>
                  <div className="place-footer-link">
                    <span>View Itinerary Guide</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            7. FIND YOUR NEXT ADVENTURE (COMMUNITY TRAVEL GUIDES)
            ========================================================================= */}
        <section className="community-guides-section">
          <div className="explorer-header-row">
            <div>
              <span className="section-tag-pill">Traveler Itineraries</span>
              <h2 className="section-main-title">Find Your Next Adventure</h2>
              <p className="section-subtitle">
                Browse through detailed itineraries and guides crafted by seasoned travelers.
              </p>
            </div>

            <button
              className="view-all-places-btn"
              onClick={() => navigate('/community')}
            >
              <span>Browse All Guides</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="community-guides-grid">
            {COMMUNITY_TRAVEL_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className="guide-item-card"
                onClick={() => navigate('/community')}
              >
                <div className="guide-img-wrap">
                  <img src={guide.image} alt={guide.title} className="guide-img" />
                  <div className="guide-author-pill">By {guide.author}</div>
                </div>

                <div className="guide-content-box">
                  <h3 className="guide-title">{guide.title}</h3>
                  <p className="guide-summary">{guide.summary}</p>

                  <div className="guide-stats-footer">
                    <span className="guide-stat">{guide.views}</span>
                    <span className="guide-stat-dot">•</span>
                    <span className="guide-stat">{guide.saves}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            8. WHAT TRAVELERS ARE RAVING ABOUT (IN WARM LIGHT YELLOW/AMBER BACKGROUND)
            ========================================================================= */}
        <section className="raving-reviews-section light-yellow-bg-card">
          <div className="section-title-centered light-text-mode">
            <span className="section-tag-pill yellow-pill">Real Reviews</span>
            <h2 className="section-main-title dark-title">What Travelers Are Raving About</h2>
          </div>

          <div className="reviews-carousel-grid">
            {TRAVELER_TESTIMONIALS.map((t) => (
              <div key={t.id} className="review-speech-card white-shadow-card">
                <div className="review-stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" stroke="none" />
                  ))}
                </div>
                <p className="review-quote-body dark-quote">"{t.quote}"</p>
                <div className="review-author-row">
                  <div className="author-circle-avatar yellow-avatar">{t.author.charAt(0)}</div>
                  <div>
                    <h4 className="author-name-text dark-name">{t.author}</h4>
                    <span className="author-trip-name dark-trip">{t.trip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* =========================================================================
          9. CUSTOM WHITE PROFILE CARD FOOTER
          ========================================================================= */}
      <Footer />
    </div>
  );
};

export default LandingPage;
