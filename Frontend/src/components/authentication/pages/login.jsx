import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './style/login.css';
import { Eye, EyeOff, ArrowRight, AlertCircle, Camera, User } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance.js';

import loginImage1 from '../../../assets/login_image_1.jpg';
import loginImage2 from '../../../assets/login_image_2.jpg';
import loginImage3 from '../../../assets/login_image_3.jpg';

const SLIDES = [
  {
    id: 0,
    image: loginImage1,
  },
  {
    id: 1,
    image: loginImage2,
  },
  {
    id: 2,
    image: loginImage3,
  }
];

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic route-based authentication mode
  const isLogin = location.pathname === '/login' || location.pathname === '/';
  
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto slide images every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login API Call
        const response = await axiosInstance.post('/auth/login', {
          email,
          password
        });
        
        const { token, data } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));
        
        setLoading(false);
        navigate('/');
      } else {
        // Registration API Call using FormData for multipart/form-data
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('phoneNumber', phone);
        formData.append('password', password);
        
        if (city) formData.append('city', city);
        if (country) formData.append('country', country);
        if (additionalInfo) formData.append('additionalInfo', additionalInfo);
        if (avatarFile) {
          formData.append('profilePhoto', avatarFile);
        }

        const response = await axiosInstance.post('/auth/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const { token, data } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));

        setLoading(false);
        navigate('/');
      }
    } catch (err) {
      setLoading(false);
      console.error('Auth error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred during authentication.');
    }
  };

  const switchToSignup = () => {
    setError('');
    navigate('/signup');
  };

  const switchToLogin = () => {
    setError('');
    navigate('/login');
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card-container">
        {/* Left Hero Image Banner */}
        <div className="left-hero-section">
          {/* Multi-image Crossfade Layers */}
          {SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-bg-layer ${activeSlide === index ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}

          {/* Top Brand & Action */}
          <div className="hero-top-bar">
            <span className="brand-logo">TripMate</span>
            <button className="back-website-btn" onClick={() => navigate('/')}>
              <span>Back to website</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Bottom Heading & Carousel Indicators */}
          <div className="hero-bottom-content">
            <h2 className="hero-heading">
              Capturing Moments,<br />
              Creating Memories
            </h2>

            <div className="carousel-indicators">
              <div
                className={`indicator-bar short ${activeSlide === 0 ? 'active' : ''}`}
                onClick={() => setActiveSlide(0)}
              />
              <div
                className={`indicator-bar medium ${activeSlide === 1 ? 'active' : ''}`}
                onClick={() => setActiveSlide(1)}
              />
              <div
                className={`indicator-bar ${activeSlide === 2 ? 'active' : ''}`}
                onClick={() => setActiveSlide(2)}
              />
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="right-form-section">
          <div className="right-form-content-inner">
            {/* Profile Photo Circle Upload */}
            <div className="avatar-upload-wrapper">
              <label htmlFor="avatar-upload" className="avatar-circle-box" title="Upload profile photo">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="User Avatar" className="avatar-img-preview" />
                ) : (
                  <div className="avatar-empty-placeholder">
                    <User size={28} className="avatar-icon" />
                    <span className="avatar-text">Photo</span>
                    <div className="avatar-camera-badge">
                      <Camera size={12} />
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="avatar-file-hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            <div className="form-header">
              <h1 className="form-title">
                {isLogin ? "Log in to account" : "Create an account"}
              </h1>
              <p className="form-subtitle">
                {isLogin ? (
                  <>
                    Don't have an account?{' '}
                    <span className="login-link" onClick={switchToSignup}>
                      Sign up
                    </span>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <span className="login-link" onClick={switchToLogin}>
                      Log in
                    </span>
                  </>
                )}
              </p>
            </div>

            {error && (
              <div className="auth-error-banner animate-shake">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  {/* First Name & Last Name */}
                  <div className="input-row-dual">
                    <div className="input-field-wrapper">
                      <input
                        type="text"
                        className={`auth-input ${firstName ? 'active-filled' : ''}`}
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-field-wrapper">
                      <input
                        type="text"
                        className={`auth-input ${lastName ? 'active-filled' : ''}`}
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Email & Phone Number */}
                  <div className="input-row-dual">
                    <div className="input-field-wrapper">
                      <input
                        type="email"
                        className={`auth-input ${email ? 'active-filled' : ''}`}
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-field-wrapper">
                      <input
                        type="tel"
                        className={`auth-input ${phone ? 'active-filled' : ''}`}
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* City & Country */}
                  <div className="input-row-dual">
                    <div className="input-field-wrapper">
                      <input
                        type="text"
                        className={`auth-input ${city ? 'active-filled' : ''}`}
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-field-wrapper">
                      <input
                        type="text"
                        className={`auth-input ${country ? 'active-filled' : ''}`}
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email (for Login View) */}
              {isLogin && (
                <div className="input-field-wrapper">
                  <input
                    type="email"
                    className={`auth-input ${email ? 'active-filled' : ''}`}
                    placeholder="Email / Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Password */}
              <div className="input-field-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`auth-input ${password ? 'active-filled' : ''}`}
                  placeholder={isLogin ? "Enter your password" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  className="password-eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              {/* Additional Information (Optional, Registration view) */}
              {!isLogin && (
                <div className="input-field-wrapper">
                  <textarea
                    className={`auth-input auth-textarea ${additionalInfo ? 'active-filled' : ''}`}
                    placeholder="Additional Information ...."
                    rows={3}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                  />
                </div>
              )}

              <button type="submit" className="submit-account-btn" disabled={loading}>
                {loading ? (
                  <div className="btn-spinner"></div>
                ) : (
                  isLogin ? "Log in" : "Register Users"
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
