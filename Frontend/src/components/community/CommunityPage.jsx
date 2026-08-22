import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';
import Footer from '../landing/Footer.jsx';
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
  UserCheck
} from 'lucide-react';
import './style/CommunityPage.css';

import img1 from '../../assets/home_image_1.png';
import img2 from '../../assets/home_image_2.png';
import img3 from '../../assets/home_image_3.png';
import loginImg1 from '../../assets/login_image_1.jpg';
import loginImg2 from '../../assets/login_image_2.jpg';
import loginImg3 from '../../assets/login_image_3.jpg';

const COMMUNITY_POSTS = [
  {
    id: 1,
    author: 'Elena Rostova',
    handle: '@elena_alpine',
    avatar: loginImg1,
    title: 'Top Secret Sunrise Spots in Interlaken & Bernese Oberland',
    location: 'Interlaken, Switzerland',
    date: '3 days ago',
    image: img1,
    content: 'Just returned from a 10-day solo trek around the Eiger Ridge! If you take the 06:15 AM first gondola to First, you have the entire cliff walk completely to yourself with golden morning mist rising over the glaciers. Highly recommend packing windproof shells and sturdy trail crampons.',
    likes: 342,
    comments: 48,
    tags: ['#switzerland', '#alps', '#solotravel', '#hiking']
  },
  {
    id: 2,
    author: 'Kenji Sato',
    handle: '@kenji_explores',
    avatar: loginImg2,
    title: 'Hidden Heritage Ryokans & Bamboo Groves in Arashiyama',
    location: 'Kyoto, Japan',
    date: '1 week ago',
    image: loginImg2,
    content: 'For anyone planning Kyoto in October, avoid the noon crowds by booking morning tea workshops at Okochi Sanso garden. The matcha served with seasonal wagashi sweets while overlooking the emerald gorge is simply unforgettable.',
    likes: 512,
    comments: 63,
    tags: ['#kyoto', '#japan', '#culturaltrip', '#teaceremony']
  },
  {
    id: 3,
    author: 'Marcus Vance',
    handle: '@marcus_vance',
    avatar: loginImg3,
    title: 'Sailing the Cyclades: Best Catamaran Routes & Anchorages',
    location: 'Santorini & Naxos, Greece',
    date: '2 weeks ago',
    image: loginImg3,
    content: 'We chartered a 42ft catamaran for 8 days across Paros, Naxos, and Santorini caldera. Best tip: anchor in Ammoudi Bay just before 6 PM for dinner at the cliffside tavernas. The fresh octopus and local Assyrtiko white wine are unmatched.',
    likes: 289,
    comments: 31,
    tags: ['#greece', '#santorini', '#sailing', '#islandlife']
  }
];

const CommunityPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [likedPosts, setLikedPosts] = useState([1]);
  const [newPostText, setNewPostText] = useState('');

  const toggleLike = (id) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: Date.now(),
      author: 'Alex Morgan',
      handle: '@alex_globetrotter',
      avatar: loginImg1,
      title: 'New Trip Journal & Advice',
      location: 'Global Explorer',
      date: 'Just now',
      image: img2,
      content: newPostText,
      likes: 1,
      comments: 0,
      tags: ['#tripmate', '#wanderlust', '#community']
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  return (
    <div className="community-page-container">
      <Navbar />

      <main className="community-page-main">
        {/* Page Header */}
        <div className="page-header-row">
          <div>
            <span className="screen-badge">Screen 10 • Community Tab</span>
            <h1 className="page-main-heading">Globetrotter Community & Stories</h1>
          </div>
        </div>

        {/* Community Info Box matching wireframe note */}
        <div className="community-info-box-card">
          <div className="info-icon-badge">
            <Sparkles size={20} color="#a78bfa" />
          </div>
          <div className="info-content">
            <h3 className="info-title">Community Travel Hub</h3>
            <p className="info-text">
              Community section where all the users can share their experience about a certain trip or activity. Using the search, group by or Filter and sort by option, the user can narrow down the result that he is looking for.
            </p>
          </div>
        </div>

        {/* Controls Toolbar matching wireframe */}
        <div className="controls-toolbar">
          <div className="search-bar-wrapper">
            <Search size={18} className="search-input-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search community posts, traveler reviews, destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-controls-group">
            <button className="control-btn">
              <Layers size={15} />
              <span>Group by: Destination</span>
            </button>
            <button className="control-btn">
              <SlidersHorizontal size={15} />
              <span>Filter: Verified Trips</span>
            </button>
            <button className="control-btn">
              <ArrowUpDown size={15} />
              <span>Sort by: Most Popular</span>
            </button>
          </div>
        </div>

        {/* Post Creation Box */}
        <div className="create-post-box">
          <textarea
            className="create-post-input"
            rows={3}
            placeholder="Share your travel experiences, hidden spots, or packing advice with the community..."
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
          />
          <div className="create-post-actions">
            <button 
              className="publish-post-btn white-btn-black-text"
              onClick={handleCreatePost}
            >
              <Send size={15} />
              <span>Share Story</span>
            </button>
          </div>
        </div>

        {/* Community Feed Posts */}
        <section className="community-feed-list">
          {posts.map((post) => {
            const isLiked = likedPosts.includes(post.id);
            return (
              <article key={post.id} className="community-post-card">
                <div className="post-header-row">
                  <div className="post-author-box">
                    <img src={post.avatar} alt={post.author} className="post-avatar-img" />
                    <div>
                      <h3 className="post-author-name">{post.author}</h3>
                      <span className="post-author-handle">{post.handle} • {post.date}</span>
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
                      <img src={post.image} alt={post.title} className="post-image" />
                    </div>
                  )}

                  <div className="post-tags-row">
                    {post.tags.map((tag) => (
                      <span key={tag} className="post-tag-item">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="post-footer-actions">
                  <div className="footer-left-buttons">
                    <button 
                      className={`post-interaction-btn ${isLiked ? 'liked' : ''}`}
                      onClick={() => toggleLike(post.id)}
                    >
                      <Heart size={16} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : 'currentColor'} />
                      <span>{post.likes + (isLiked ? 1 : 0)}</span>
                    </button>

                    <button className="post-interaction-btn">
                      <MessageCircle size={16} />
                      <span>{post.comments} Comments</span>
                    </button>

                    <button className="post-interaction-btn">
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                  </div>

                  <button 
                    className="save-itinerary-action"
                    onClick={() => navigate('/create-trip')}
                  >
                    <Bookmark size={15} />
                    <span>Use Itinerary</span>
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityPage;
