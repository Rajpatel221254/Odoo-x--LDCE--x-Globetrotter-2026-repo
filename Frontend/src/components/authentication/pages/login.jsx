import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './style/login.css';
import { Eye, EyeOff, ArrowRight, AlertCircle, Camera, User } from 'lucide-react';

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

    setTimeout(() => {
      setLoading(false);
      if (!isLogin) {
        // If registering, navigate to login on completion
        navigate('/login');
      } else {
        // Successful login
        navigate('/');
      }
    }, 800);
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://accounts.google.com';
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

              <div className="or-divider">
                <div className="divider-line" />
                <span className="divider-text">
                  {isLogin ? "Or log in with" : "Or register with"}
                </span>
                <div className="divider-line" />
              </div>

              <div className="social-buttons-row">
                <button type="button" className="social-btn" onClick={handleGoogleLogin}>
                  <svg className="social-icon-svg" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
