import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  User,
  Shield,
  PlusCircle,
  Menu,
  X,
  Search
} from 'lucide-react';
import './style/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'My Trips', path: '/trips' },
    { name: 'Plan Trip', path: '/create-trip' },
    { name: 'Explore', path: '/explore' },
    { name: 'Community', path: '/community' },
    { name: 'Calendar', path: '/calendar' }
  ];

  return (
    <header className="shared-navbar">
      <div className="navbar-left">
        <div className="shared-brand" onClick={() => navigate('/')}>
          <span>TripMate</span>
          <span className="brand-accent-dot">.</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-links">
          {navLinks.map((link) => (
            <button
              key={link.path}
              className={`nav-link-btn ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => navigate(link.path)}
            >
              {link.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="navbar-right">
        <button 
          className="create-trip-nav-btn"
          onClick={() => navigate('/create-trip')}
        >
          <PlusCircle size={16} />
          <span>New Trip</span>
        </button>

        <div
          className="shared-avatar-btn"
          onClick={() => navigate('/profile')}
          title="User Profile"
        >
          <User size={19} />
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {navLinks.map((link) => (
            <button
              key={link.path}
              className={`mobile-nav-item ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => {
                navigate(link.path);
                setMobileMenuOpen(false);
              }}
            >
              {link.name}
            </button>
          ))}
          <button
            className="mobile-nav-item"
            onClick={() => {
              navigate('/profile');
              setMobileMenuOpen(false);
            }}
          >
            My Profile
          </button>
          <button
            className="mobile-nav-item"
            onClick={() => {
              navigate('/login');
              setMobileMenuOpen(false);
            }}
          >
            Sign Out / Switch Account
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
