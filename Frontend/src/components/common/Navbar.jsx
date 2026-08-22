import React, { useState, useEffect, useRef } from 'react';
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
  Search,
  LogOut,
  Luggage
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance.js';
import './style/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem('token');
  const user = (() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setProfileDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate('/login');
    }
  };

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

        {/* Desktop Profile Avatar & Dropdown */}
        <div className="profile-menu-container" ref={dropdownRef}>
          <div
            className="shared-avatar-btn"
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            title={user ? `${user.firstName || 'User'} Profile` : 'Account Menu'}
          >
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt="User Avatar" className="navbar-avatar-img" />
            ) : (
              <User size={19} />
            )}
          </div>

          {profileDropdownOpen && (
            <div className="profile-dropdown-menu">
              {token && user ? (
                <div className="dropdown-user-header">
                  <div className="dropdown-user-name">{user.firstName} {user.lastName || ''}</div>
                  <div className="dropdown-user-handle">{user.email || user.username || 'Logged In'}</div>
                </div>
              ) : null}

              <button
                className="dropdown-menu-item"
                onClick={() => {
                  navigate('/profile');
                  setProfileDropdownOpen(false);
                }}
              >
                <User size={15} />
                <span>My Profile</span>
              </button>

              <button
                className="dropdown-menu-item"
                onClick={() => {
                  navigate('/trips');
                  setProfileDropdownOpen(false);
                }}
              >
                <Luggage size={15} />
                <span>My Trips</span>
              </button>

              {token ? (
                <button
                  className="dropdown-menu-item logout-item"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              ) : (
                <button
                  className="dropdown-menu-item"
                  onClick={() => {
                    navigate('/login');
                    setProfileDropdownOpen(false);
                  }}
                >
                  <User size={15} />
                  <span>Log In / Sign Up</span>
                </button>
              )}
            </div>
          )}
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
          {token ? (
            <button
              className="mobile-nav-item mobile-logout-item"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              className="mobile-nav-item"
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
            >
              Log In / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
