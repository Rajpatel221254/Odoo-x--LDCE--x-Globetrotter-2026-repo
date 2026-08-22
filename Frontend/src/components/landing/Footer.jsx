import React from 'react';
import { useNavigate } from 'react-router-dom';
import realFooterImg from '../../assets/real_footer_image.png';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="landing-footer-section">
      {/* Exact White Card Profile Frame */}
      <div className="footer-exact-card-frame">
        {/* Top Dark Banner with real_footer_image.png */}
        <div className="footer-exact-banner-box">
          <img 
            src={realFooterImg} 
            alt="TripMate" 
            className="footer-exact-banner-img" 
          />
        </div>

        {/* Content Area with White Background */}
        <div className="footer-exact-content-body">
          {/* Overlapping Avatar Circle */}
          <div className="footer-exact-avatar-circle">
            <svg viewBox="0 0 48 48" className="footer-exact-avatar-icon">
              {/* Modern orange stylized chevron logo matching the inspiration */}
              <path d="M10 28L18 18L24 24L32 14L38 20" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M14 34L20 26L26 32L34 22" stroke="#fb923c" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
            </svg>
          </div>

          {/* Details & Action Row */}
          <div className="footer-exact-info-row">
            {/* Left Info */}
            <div className="footer-exact-info-col">
              <h2 className="footer-exact-title">TripMate</h2>
              <span className="footer-exact-handle">@tripmatehq_</span>
              
              <p className="footer-exact-description">
                We make planning & exploring unforgettable journeys fun and seamless! Discover curated destinations, track your itineraries, and capture lasting memories.
              </p>

              <div className="footer-exact-hashtags">
                <span className="footer-exact-tag">#travelworldwide</span>
                <span className="footer-exact-tag">#wanderlust</span>
                <span className="footer-exact-tag">#tripmate</span>
                <span className="footer-exact-tag">#curatedtrips</span>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="footer-exact-action-col">
              <button 
                className="footer-exact-edit-btn"
                onClick={() => navigate('/login')}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
