import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';
import Footer from '../landing/Footer.jsx';
import axiosInstance from '../../api/axiosInstance.js';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Layers,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Calendar,
  Send,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Tag,
  Check,
  Globe,
  Plus,
  Loader2,
  AlertCircle
} from 'lucide-react';
import './style/CommunityPage.css';
import {
  DEFAULT_COMMUNITY_POSTS,
  TRAVEL_IMAGE_CATEGORIES,
  ALL_TRAVEL_IMAGES,
  TRAVELER_AVATARS,
  getSmartStoryImage,
  getRandomTravelImage
} from '../../utils/travelImages.js';

const CommunityPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'popular' | 'comments'
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  // Story Creator State
  const [newPostText, setNewPostText] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostLocation, setNewPostLocation] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [selectedImage, setSelectedImage] = useState(ALL_TRAVEL_IMAGES[0]?.url || '');
  const [selectedTheme, setSelectedTheme] = useState('beaches');
  const [showCustomImageInput, setShowCustomImageInput] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [storyImageIndex, setStoryImageIndex] = useState(1);

  // Fetch stories from MongoDB API
  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (activeCategory !== 'all') params.append('category', activeCategory);
      if (sortBy) params.append('sort', sortBy);
      params.append('limit', '50');

      const res = await axiosInstance.get(`/stories?${params.toString()}`);
      if (res.data?.data) {
        setPosts(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching stories from MongoDB:', err);
      // Fallback to default posts if backend temporarily offline
      if (posts.length === 0) {
        setPosts(DEFAULT_COMMUNITY_POSTS);
      }
      setError(err.response?.data?.message || 'Failed to load stories from MongoDB.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory, sortBy]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // Auto-suggest image when user types location or story content
  useEffect(() => {
    if (!showCustomImageInput && (newPostText || newPostLocation || newPostTitle)) {
      const smartImg = getSmartStoryImage(
        `${newPostTitle} ${newPostText}`,
        newPostLocation,
        storyImageIndex
      );
      if (smartImg) {
        setSelectedImage(smartImg);
      }
    }
  }, [newPostText, newPostLocation, newPostTitle, storyImageIndex, showCustomImageInput]);

  // Shuffle to next distinct travel photo
  const handleShuffleImage = () => {
    setStoryImageIndex((prev) => prev + 1);
    const nextImg = getRandomTravelImage(selectedImage);
    setSelectedImage(nextImg);
  };

  // Select category theme for image
  const handleSelectTheme = (themeKey) => {
    setSelectedTheme(themeKey);
    const catImages = TRAVEL_IMAGE_CATEGORIES[themeKey]?.images || [];
    if (catImages.length > 0) {
      const randomFromCat = catImages[Math.floor(Math.random() * catImages.length)].url;
      setSelectedImage(randomFromCat);
    }
  };

  // Toggle like in MongoDB
  const toggleLike = async (postId) => {
    const isLiked = likedPosts.includes(postId);
    setLikedPosts((prev) =>
      isLiked ? prev.filter((p) => p !== postId) : [...prev, postId]
    );

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        const id = p._id || p.id;
        if (id === postId) {
          return {
            ...p,
            likes: Math.max(0, (p.likes || 0) + (isLiked ? -1 : 1)),
          };
        }
        return p;
      })
    );

    try {
      const res = await axiosInstance.post(`/stories/${postId}/like`);
      if (res.data?.likes !== undefined) {
        setPosts((prev) =>
          prev.map((p) =>
            (p._id === postId || p.id === postId) ? { ...p, likes: res.data.likes } : p
          )
        );
      }
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  const toggleSave = (id) => {
    setSavedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Create new story in MongoDB
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    try {
      setSubmitting(true);
      const finalImage = showCustomImageInput && customImageUrl.trim()
        ? customImageUrl.trim()
        : selectedImage || getSmartStoryImage(newPostText, newPostLocation, storyImageIndex);

      const generatedTags = newPostTags.trim()
        ? newPostTags.split(' ').map((t) => (t.startsWith('#') ? t : `#${t}`))
        : ['#tripmate', '#travelstory', '#wanderlust'];

      const payload = {
        title: newPostTitle.trim() || 'Travel Experience & Explorer Log',
        content: newPostText.trim(),
        location: newPostLocation.trim() || 'Global Explorer',
        image: finalImage,
        category: selectedTheme || 'general',
        tags: generatedTags,
      };

      const res = await axiosInstance.post('/stories', payload);
      const createdStory = res.data?.data;

      if (createdStory) {
        setPosts((prev) => [createdStory, ...prev]);
        const storyId = createdStory._id || createdStory.id;
        setLikedPosts((prev) => [...prev, storyId]);
      }

      // Reset form and rotate photo for the next post
      setNewPostText('');
      setNewPostTitle('');
      setNewPostLocation('');
      setNewPostTags('');
      setCustomImageUrl('');
      setShowCustomImageInput(false);
      setStoryImageIndex((prev) => prev + 1);
      setSelectedImage(ALL_TRAVEL_IMAGES[(storyImageIndex + 1) % ALL_TRAVEL_IMAGES.length]?.url);
    } catch (err) {
      console.error('Error creating story:', err);
      alert(err.response?.data?.message || 'Failed to save story to MongoDB.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="community-page-container">
      <Navbar />

      <main className="community-page-main">
        {/* Page Header */}
        <div className="page-header-row">
          <div>
            <span className="screen-badge">Community Feed • MongoDB Connected</span>
            <h1 className="page-main-heading">Globetrotter Community & Stories</h1>
            <p className="page-subheading">
              Discover unfiltered travel logs, secret recommendations, and authentic stories shared by travelers worldwide.
            </p>
          </div>
        </div>

        {/* Community Info Box */}
        <div className="community-info-box-card">
          <div className="info-icon-badge">
            <Sparkles size={20} color="#a78bfa" />
          </div>
          <div className="info-content">
            <h3 className="info-title">Interactive Travel Storyboard</h3>
            <p className="info-text">
              Share your adventures, hidden discoveries, and tips. Every story dynamically receives high-resolution travel photography and persists directly into MongoDB Atlas.
            </p>
          </div>
        </div>

        {/* Post Creation Box with Live Image Picker */}
        <div className="create-post-box">
          <div className="create-post-header">
            <h2 className="create-post-heading">
              <Sparkles size={18} color="#f59e0b" /> Share Your Travel Story
            </h2>
            <span className="create-post-tip">Connected to MongoDB</span>
          </div>

          <div className="create-post-grid">
            <div className="create-post-inputs-col">
              <input
                type="text"
                className="story-title-input"
                placeholder="Story Title (e.g. Magical Sunset at Butterfly Beach, Goa)"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />

              <div className="story-meta-row">
                <div className="meta-input-group">
                  <MapPin size={15} className="meta-icon" />
                  <input
                    type="text"
                    className="story-meta-input"
                    placeholder="Location (e.g. Goa, India)"
                    value={newPostLocation}
                    onChange={(e) => setNewPostLocation(e.target.value)}
                  />
                </div>

                <div className="meta-input-group">
                  <Tag size={15} className="meta-icon" />
                  <input
                    type="text"
                    className="story-meta-input"
                    placeholder="Tags (e.g. #goa #beach #sunset)"
                    value={newPostTags}
                    onChange={(e) => setNewPostTags(e.target.value)}
                  />
                </div>
              </div>

              <textarea
                className="create-post-input"
                rows={3}
                placeholder="Share your travel experiences, hidden spots, cafe recommendations, or itinerary tips..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
              />
            </div>

            {/* Live Image Preview & Switcher */}
            <div className="story-image-preview-col">
              <div className="story-image-preview-box">
                <img
                  src={selectedImage}
                  alt="Story Preview"
                  className="story-preview-img"
                  onError={(e) => {
                    e.target.src = ALL_TRAVEL_IMAGES[0].url;
                  }}
                />
                <div className="story-preview-overlay">
                  <span className="preview-label">Story Photo</span>
                  <button
                    type="button"
                    className="shuffle-img-btn"
                    onClick={handleShuffleImage}
                    title="Switch to another different photo"
                  >
                    <RefreshCw size={14} className="shuffle-icon" />
                    <span>Shuffle Photo</span>
                  </button>
                </div>
              </div>

              {/* Theme Pills */}
              <div className="theme-pills-row">
                {Object.entries(TRAVEL_IMAGE_CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    type="button"
                    className={`theme-pill-btn ${selectedTheme === key ? 'active' : ''}`}
                    onClick={() => handleSelectTheme(key)}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Custom Image URL Option */}
              <div className="custom-url-toggle-row">
                <button
                  type="button"
                  className="custom-url-toggle-btn"
                  onClick={() => setShowCustomImageInput(!showCustomImageInput)}
                >
                  <ImageIcon size={13} />
                  <span>{showCustomImageInput ? 'Use Auto Photo' : 'Custom Image URL'}</span>
                </button>
              </div>

              {showCustomImageInput && (
                <input
                  type="url"
                  className="custom-url-input"
                  placeholder="Paste your image URL (https://...)"
                  value={customImageUrl}
                  onChange={(e) => {
                    setCustomImageUrl(e.target.value);
                    if (e.target.value.trim()) {
                      setSelectedImage(e.target.value.trim());
                    }
                  }}
                />
              )}
            </div>
          </div>

          <div className="create-post-actions">
            <button
              className="publish-post-btn white-btn-black-text"
              onClick={handleCreatePost}
              disabled={!newPostText.trim() || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Saving to MongoDB...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Share Story</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="controls-toolbar">
          <div className="search-bar-wrapper">
            <Search size={18} className="search-input-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search community posts, traveler reviews, destinations (e.g. Goa, Kyoto, Alps)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-controls-group">
            <div className="filter-dropdown-btn">
              <Layers size={15} />
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="toolbar-select"
              >
                <option value="all">Category: All Stories</option>
                <option value="beaches">🏖️ Beaches & Islands</option>
                <option value="mountains">🏔️ Mountains & Hiking</option>
                <option value="heritage">⛩️ Cultural Heritage</option>
                <option value="cities">🏙️ Cities & Skylines</option>
                <option value="adventure">🎈 Adventure & Road Trips</option>
                <option value="food">☕ Food & Cafes</option>
              </select>
            </div>

            <div className="filter-dropdown-btn">
              <ArrowUpDown size={15} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="toolbar-select"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="popular">Sort: Most Popular</option>
                <option value="comments">Sort: Most Discussed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && posts.length === 0 && (
          <div className="community-loading-state">
            <Loader2 size={36} className="animate-spin" color="#a78bfa" />
            <p>Loading community stories from database...</p>
          </div>
        )}

        {/* Community Feed Posts */}
        <section className="community-feed-list">
          {!loading && posts.length === 0 ? (
            <div className="no-posts-found-card">
              <Globe size={40} color="#6b7280" />
              <h3>No stories match your search</h3>
              <p>Try searching for a different destination or topic, or create your own story above!</p>
            </div>
          ) : (
            posts.map((post) => {
              const postId = post._id || post.id;
              const isLiked = likedPosts.includes(postId);
              const isSaved = savedPosts.includes(postId);
              const postDate = post.createdAt
                ? new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : post.date || 'Recently';

              return (
                <article key={postId} className="community-post-card">
                  <div className="post-header-row">
                    <div className="post-author-box">
                      <img
                        src={post.avatar || TRAVELER_AVATARS[0]}
                        alt={post.author}
                        className="post-avatar-img"
                        onError={(e) => {
                          e.target.src = TRAVELER_AVATARS[0];
                        }}
                      />
                      <div>
                        <h3 className="post-author-name">{post.author}</h3>
                        <span className="post-author-handle">{post.handle} • {postDate}</span>
                      </div>
                    </div>

                    <div className="post-location-tag">
                      <MapPin size={13} color="#a78bfa" />
                      <span>{post.location}</span>
                    </div>
                  </div>

                  <div className="post-body">
                    <h2 className="post-title-text">{post.title}</h2>
                    <p className="post-content-text">{post.content}</p>

                    {post.image && (
                      <div className="post-image-wrap">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="post-image"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="post-tags-row">
                      {post.tags && post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="post-tag-item"
                          onClick={() => setSearchQuery(tag.replace('#', ''))}
                          style={{ cursor: 'pointer' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="post-footer-actions">
                    <div className="footer-left-buttons">
                      <button
                        className={`post-interaction-btn ${isLiked ? 'liked' : ''}`}
                        onClick={() => toggleLike(postId)}
                      >
                        <Heart
                          size={16}
                          fill={isLiked ? '#ef4444' : 'none'}
                          color={isLiked ? '#ef4444' : 'currentColor'}
                        />
                        <span>{post.likes || 0}</span>
                      </button>

                      <button className="post-interaction-btn">
                        <MessageCircle size={16} />
                        <span>{post.commentsCount || post.comments?.length || 0} Comments</span>
                      </button>

                      <button
                        className="post-interaction-btn"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: post.title,
                              text: post.content,
                              url: window.location.href
                            }).catch(() => {});
                          } else {
                            navigator.clipboard?.writeText(window.location.href);
                            alert('Link copied to clipboard!');
                          }
                        }}
                      >
                        <Share2 size={16} />
                        <span>Share</span>
                      </button>
                    </div>

                    <button
                      className={`save-itinerary-action ${isSaved ? 'saved' : ''}`}
                      onClick={() => {
                        toggleSave(postId);
                        navigate('/create-trip');
                      }}
                    >
                      <Bookmark size={15} fill={isSaved ? '#ffffff' : 'none'} />
                      <span>{isSaved ? 'Saved Itinerary' : 'Use Itinerary'}</span>
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityPage;

