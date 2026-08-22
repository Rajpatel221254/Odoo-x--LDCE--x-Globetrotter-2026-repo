import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TripMap from './TripMap.jsx';
import {
  Calendar,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  RotateCw,
  Share2,
  Smartphone,
  MoreHorizontal,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  Compass,
  FileText,
  Heart,
  Check,
  CheckCircle2,
  Layers,
  Hotel,
  UtensilsCrossed,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Menu,
  X,
  SlidersHorizontal,
  LayoutList,
  Grid,
  Loader2
} from 'lucide-react';
import './style/CreateTripPage.css';

// Rich Curated Destination Database
const DESTINATIONS_DB = {
  'delhi': {
    name: 'New Delhi, Delhi, India',
    shortName: 'Delhi',
    lat: 28.6139,
    lng: 77.2090,
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'del-a1', name: 'India Gate & Kartavya Path', category: 'National Monument', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80', lat: 28.6129, lng: 77.2295, rating: 4.85, cost: 'Free', icon: '🏛️', color: '#f05a36' },
      { id: 'del-a2', name: 'Red Fort (Lal Qila)', category: 'Mughal Heritage', image: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=400&q=80', lat: 28.6562, lng: 77.2410, rating: 4.9, cost: '₹50', icon: '🏰', color: '#ef4444' },
      { id: 'del-a3', name: 'Qutub Minar', category: 'UNESCO World Heritage', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&q=80', lat: 28.5245, lng: 77.1855, rating: 4.92, cost: '₹40', icon: '🗼', color: '#f59e0b' },
      { id: 'del-a4', name: 'Lotus Temple (Baháʼí)', category: 'Architectural Wonder', image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=400&q=80', lat: 28.5535, lng: 77.2588, rating: 4.8, cost: 'Free', icon: '🪷', color: '#ec4899' },
      { id: 'del-a5', name: 'Humayun’s Tomb', category: 'Garden Mausoleum', image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=400&q=80', lat: 28.5933, lng: 77.2507, rating: 4.9, cost: '₹40', icon: '🕌', color: '#10b981' }
    ],
    restaurants: [
      { id: 'del-r1', name: 'Karim’s (Jama Masjid)', category: 'Historic Mughlai', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80', lat: 28.6508, lng: 77.2334, rating: 4.85, cost: '₹600 for two', icon: '🍽️', color: '#ef4444' },
      { id: 'del-r2', name: 'Bukhara - ITC Maurya', category: 'Award-Winning Tandoori', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 28.5977, lng: 77.1736, rating: 4.95, cost: '₹4000 for two', icon: '🍖', color: '#f59e0b' },
      { id: 'del-r3', name: 'Indian Accent', category: 'Modern Progressive Dining', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', lat: 28.5910, lng: 77.2390, rating: 4.9, cost: '₹5000 for two', icon: '🍷', color: '#8b5cf6' },
      { id: 'del-r4', name: 'Saravana Bhavan (CP)', category: 'Authentic South Indian', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=400&q=80', lat: 28.6328, lng: 77.2195, rating: 4.75, cost: '₹400 for two', icon: '🥞', color: '#10b981' }
    ],
    hotels: [
      { id: 'del-h1', name: 'The Imperial New Delhi', category: '5-Star Heritage Luxury', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 28.6247, lng: 77.2177, rating: 4.9, cost: '₹18,000 / night', icon: '🏨', color: '#3b82f6' },
      { id: 'del-h2', name: 'The Leela Palace New Delhi', category: 'Grand Palace Experience', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 28.5793, lng: 77.1895, rating: 4.95, cost: '₹22,000 / night', icon: '🏰', color: '#a855f7' },
      { id: 'del-h3', name: 'Taj Palace New Delhi', category: 'Diplomatic Enclave Luxury', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80', lat: 28.5960, lng: 77.1700, rating: 4.85, cost: '₹15,000 / night', icon: '🛎️', color: '#06b6d4' }
    ]
  },
  'ahmedabad': {
    name: 'Ahmedabad, Gujarat, India',
    shortName: 'Ahmedabad',
    lat: 23.0225,
    lng: 72.5714,
    coverImage: 'https://images.unsplash.com/photo-1599831104321-4f18b52f9b8c?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'ahm-a1', name: 'Sabarmati Riverfront', category: 'Scenic Promenade', image: 'https://images.unsplash.com/photo-1599831104321-4f18b52f9b8c?auto=format&fit=crop&w=400&q=80', lat: 23.0338, lng: 72.5704, rating: 4.8, cost: 'Free', icon: '🌊', color: '#3b82f6' },
      { id: 'ahm-a2', name: 'Atal Pedestrian Bridge', category: 'Architectural Landmark', image: 'https://images.unsplash.com/photo-1662991048705-59b48c66e2c3?auto=format&fit=crop&w=400&q=80', lat: 23.0261, lng: 72.5746, rating: 4.9, cost: '₹30', icon: '🌉', color: '#a855f7' },
      { id: 'ahm-a3', name: 'Adalaj Stepwell (Vav)', category: 'Heritage Wonder', image: 'https://images.unsplash.com/photo-1609137144822-263a2336338b?auto=format&fit=crop&w=400&q=80', lat: 23.1667, lng: 72.5800, rating: 4.95, cost: 'Free', icon: '🏛️', color: '#f59e0b' },
      { id: 'ahm-a4', name: 'Sidi Saiyyed Mosque (Jali)', category: 'Historical Architecture', image: 'https://images.unsplash.com/photo-1596405527969-e74f1b0a7019?auto=format&fit=crop&w=400&q=80', lat: 23.0270, lng: 72.5813, rating: 4.85, cost: 'Free', icon: '🕌', color: '#10b981' },
      { id: 'ahm-a5', name: 'Kankaria Lake & Entertainment', category: 'Recreation & Lake', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80', lat: 22.9978, lng: 72.6026, rating: 4.75, cost: '₹25', icon: '🎡', color: '#ec4899' },
      { id: 'ahm-a6', name: 'Gandhi Ashram (Sabarmati)', category: 'Historic Ashram & Museum', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80', lat: 23.0605, lng: 72.5801, rating: 4.9, cost: 'Free', icon: '🕊️', color: '#f97316' }
    ],
    restaurants: [
      { id: 'ahm-r1', name: 'Agashiye - The House of MG', category: 'Authentic Gujarati Terrace Thali', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80', lat: 23.0267, lng: 72.5836, rating: 4.9, cost: '₹950 for two', icon: '🍛', color: '#f59e0b' },
      { id: 'ahm-r2', name: 'Manek Chowk Night Food Market', category: 'Famous Street Food & Kulfi', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80', lat: 23.0244, lng: 72.5888, rating: 4.8, cost: '₹300 for two', icon: '🥪', color: '#ef4444' },
      { id: 'ahm-r3', name: 'Vishalla Cultural Village', category: 'Traditional Gujarati Experience', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', lat: 22.9936, lng: 72.5348, rating: 4.75, cost: '₹750 for two', icon: '🌾', color: '#10b981' },
      { id: 'ahm-r4', name: 'Gordhan Thal (S.G. Highway)', category: 'Royal Kathiyawadi & Gujarati', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 23.0360, lng: 72.5120, rating: 4.8, cost: '₹550 for two', icon: '🍲', color: '#ec4899' }
    ],
    hotels: [
      { id: 'ahm-h1', name: 'The House of MG (Heritage)', category: 'Heritage Boutique Hotel', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 23.0267, lng: 72.5836, rating: 4.9, cost: '₹7,500 / night', icon: '🏛️', color: '#3b82f6' },
      { id: 'ahm-h2', name: 'ITC Narmada Luxury Hotel', category: '5-Star Grand Luxury', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 23.0310, lng: 72.5312, rating: 4.92, cost: '₹12,000 / night', icon: '🏨', color: '#8b5cf6' },
      { id: 'ahm-h3', name: 'Hyatt Regency Ahmedabad', category: '5-Star Riverfront Hotel', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80', lat: 23.0450, lng: 72.5710, rating: 4.85, cost: '₹8,500 / night', icon: '🏙️', color: '#06b6d4' }
    ]
  },
  'paris': {
    name: 'Paris, France',
    shortName: 'Paris',
    lat: 48.8566,
    lng: 2.3522,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'par-a1', name: 'Tour Eiffel', category: 'Iconic Monument', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=400&q=80', lat: 48.8584, lng: 2.2945, rating: 4.9, cost: '€28', icon: '🗼', color: '#8b5cf6' },
      { id: 'par-a2', name: 'Louvre Museum', category: 'Art & Culture', image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=400&q=80', lat: 48.8606, lng: 2.3376, rating: 4.95, cost: '€17', icon: '🎨', color: '#ec4899' },
      { id: 'par-a3', name: 'Arc de Triomphe', category: 'Historic Monument', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80', lat: 48.8738, lng: 2.2950, rating: 4.8, cost: '€13', icon: '🏛️', color: '#a855f7' },
      { id: 'par-a4', name: 'Cathédrale Notre-Dame', category: 'Gothic Masterpiece', image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=400&q=80', lat: 48.8530, lng: 2.3499, rating: 4.7, cost: 'Free', icon: '⛪', color: '#f97316' }
    ],
    restaurants: [
      { id: 'par-r1', name: 'Le Jules Verne (Tour Eiffel)', category: 'Haute Cuisine & Panoramic Views', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 48.8584, lng: 2.2945, rating: 4.9, cost: '€190', icon: '🍷', color: '#ef4444' },
      { id: 'par-r2', name: 'Carette Trocadéro', category: 'Famous Parisian Cafe & Pastries', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80', lat: 48.8631, lng: 2.2872, rating: 4.85, cost: '€30', icon: '☕', color: '#ec4899' },
      { id: 'par-r3', name: 'Septime Paris', category: 'Modern Neo-Bistro', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', lat: 48.8536, lng: 2.3807, rating: 4.92, cost: '€85', icon: '🍽️', color: '#10b981' }
    ],
    hotels: [
      { id: 'par-h1', name: 'The Ritz Paris (Place Vendôme)', category: 'Palace Luxury Hotel', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 48.8682, lng: 2.3292, rating: 4.98, cost: '€1,600 / night', icon: '👑', color: '#8b5cf6' },
      { id: 'par-h2', name: 'Four Seasons Hotel George V', category: '5-Star Palace Stay', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 48.8690, lng: 2.3015, rating: 4.95, cost: '€1,850 / night', icon: '🏨', color: '#3b82f6' },
      { id: 'par-h3', name: 'Pullman Paris Tour Eiffel', category: 'Eiffel View Hotel', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80', lat: 48.8560, lng: 2.2930, rating: 4.8, cost: '€380 / night', icon: '🗼', color: '#06b6d4' }
    ]
  },
  'mumbai': {
    name: 'Mumbai, Maharashtra, India',
    shortName: 'Mumbai',
    lat: 18.9220,
    lng: 72.8347,
    coverImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'mum-a1', name: 'Gateway of India', category: 'Colonial Landmark', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80', lat: 18.9220, lng: 72.8347, rating: 4.85, cost: 'Free', icon: '🏛️', color: '#f59e0b' },
      { id: 'mum-a2', name: 'Marine Drive & Queen’s Necklace', category: 'Scenic Coastal Promenade', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=400&q=80', lat: 18.9432, lng: 72.8230, rating: 4.9, cost: 'Free', icon: '🌊', color: '#3b82f6' },
      { id: 'mum-a3', name: 'Bandra-Worli Sea Link', category: 'Iconic Cable Bridge', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&q=80', lat: 19.0330, lng: 72.8180, rating: 4.85, cost: 'Toll', icon: '🌉', color: '#8b5cf6' }
    ],
    restaurants: [
      { id: 'mum-r1', name: 'Britannia & Co. Restaurant', category: 'Parsi Heritage & Berry Pulao', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80', lat: 18.9372, lng: 72.8392, rating: 4.8, cost: '₹600 for two', icon: '🍛', color: '#f59e0b' },
      { id: 'mum-r2', name: 'The Bombay Canteen', category: 'Modern Regional Indian', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', lat: 19.0068, lng: 72.8306, rating: 4.9, cost: '₹2200 for two', icon: '🥘', color: '#a855f7' }
    ],
    hotels: [
      { id: 'mum-h1', name: 'The Taj Mahal Palace (Colaba)', category: 'Iconic Seafront Heritage', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 18.9217, lng: 72.8331, rating: 4.98, cost: '₹24,000 / night', icon: '👑', color: '#3b82f6' },
      { id: 'mum-h2', name: 'The Oberoi Mumbai', category: '5-Star Nariman Point', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 18.9270, lng: 72.8206, rating: 4.92, cost: '₹20,000 / night', icon: '🏨', color: '#8b5cf6' }
    ]
  },
  'tokyo': {
    name: 'Tokyo, Japan',
    shortName: 'Tokyo',
    lat: 35.6762,
    lng: 139.6503,
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'tok-a1', name: 'Shibuya Crossing', category: 'World Famous Scramble', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=400&q=80', lat: 35.6595, lng: 139.7004, rating: 4.9, cost: 'Free', icon: '🚦', color: '#ec4899' },
      { id: 'tok-a2', name: 'Senso-ji Ancient Temple', category: 'Asakusa Historic Shrine', image: 'https://images.unsplash.com/photo-1570459027562-4a916cc6113f?auto=format&fit=crop&w=400&q=80', lat: 35.7148, lng: 139.7967, rating: 4.95, cost: 'Free', icon: '⛩️', color: '#ef4444' }
    ],
    restaurants: [
      { id: 'tok-r1', name: 'Sukiyabashi Jiro (Ginza)', category: 'Legendary Edomae Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80', lat: 35.6720, lng: 139.7630, rating: 4.95, cost: '¥35,000', icon: '🍣', color: '#ef4444' },
      { id: 'tok-r2', name: 'Ichiran Ramen (Shibuya)', category: 'Classic Tonkotsu Ramen', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80', lat: 35.6620, lng: 139.7010, rating: 4.85, cost: '¥1,300', icon: '🍜', color: '#f59e0b' }
    ],
    hotels: [
      { id: 'tok-h1', name: 'Park Hyatt Tokyo (Shinjuku)', category: '5-Star Luxury Highrise', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 35.6855, lng: 139.6910, rating: 4.92, cost: '¥85,000 / night', icon: '🏨', color: '#3b82f6' },
      { id: 'tok-h2', name: 'Aman Tokyo', category: 'Ultra-Luxury Otemachi Sanctuary', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 35.6870, lng: 139.7650, rating: 4.98, cost: '¥140,000 / night', icon: '🏯', color: '#8b5cf6' }
    ]
  },
  'goa': {
    name: 'Goa, India',
    shortName: 'Goa',
    lat: 15.2993,
    lng: 74.1240,
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'goa-a1', name: 'Baga Beach Watersports', category: 'Beach & Coastal Watersports', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80', lat: 15.5553, lng: 73.7517, rating: 4.8, cost: '₹500', icon: '🏖️', color: '#06b6d4' },
      { id: 'goa-a2', name: 'Aguada Fort & Lighthouse', category: 'Historic Portuguese Fort', image: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=400&q=80', lat: 15.4920, lng: 73.7737, rating: 4.85, cost: '₹50', icon: '🏰', color: '#f59e0b' }
    ],
    restaurants: [
      { id: 'goa-r1', name: 'Fisherman’s Wharf', category: 'Riverside Fresh Goan Seafood', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 15.1550, lng: 73.9450, rating: 4.85, cost: '₹1400 for two', icon: '🦐', color: '#3b82f6' },
      { id: 'goa-r2', name: 'Gunpowder (Assagao)', category: 'Coastal South Indian & Cocktails', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', lat: 15.5900, lng: 73.7720, rating: 4.9, cost: '₹1200 for two', icon: '🥥', color: '#10b981' }
    ],
    hotels: [
      { id: 'goa-h1', name: 'Taj Exotica Resort & Spa (Benaulim)', category: '5-Star Beach Resort', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 15.2470, lng: 73.9180, rating: 4.95, cost: '₹22,000 / night', icon: '🌴', color: '#8b5cf6' },
      { id: 'goa-h2', name: 'W Goa (Vagator Beach)', category: 'Luxury Beachfront Resort', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 15.6020, lng: 73.7380, rating: 4.9, cost: '₹26,000 / night', icon: '✨', color: '#ec4899' }
    ]
  }
};

// Dynamic Fallback Generator for any custom searched city
const getDynamicPlacesForCity = (shortName, lat, lng, matchedDB, coverImage) => {
  if (matchedDB) {
    return {
      attractions: matchedDB.attractions || [],
      restaurants: matchedDB.restaurants || [],
      hotels: matchedDB.hotels || []
    };
  }

  return {
    attractions: [
      {
        id: `gen-a1-${Date.now()}`,
        name: `${shortName} Historic Center & Landmark`,
        category: 'Heritage & Sightseeing',
        image: coverImage,
        lat: lat + 0.005,
        lng: lng + 0.004,
        rating: 4.85,
        cost: 'Free',
        icon: '🏛️',
        color: '#f05a36'
      },
      {
        id: `gen-a2-${Date.now()}`,
        name: `${shortName} Scenic Promenade & Gardens`,
        category: 'Scenic View & Nature',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
        lat: lat - 0.006,
        lng: lng + 0.005,
        rating: 4.9,
        cost: 'Free',
        icon: '🌳',
        color: '#10b981'
      },
      {
        id: `gen-a3-${Date.now()}`,
        name: `${shortName} Cultural Art Museum`,
        category: 'Art & Heritage',
        image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=400&q=80',
        lat: lat + 0.007,
        lng: lng - 0.005,
        rating: 4.75,
        cost: '₹150 / $10',
        icon: '🎨',
        color: '#a855f7'
      }
    ],
    restaurants: [
      {
        id: `gen-r1-${Date.now()}`,
        name: `${shortName} Heritage Kitchen & Bistro`,
        category: 'Authentic Local Dining',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
        lat: lat + 0.003,
        lng: lng - 0.004,
        rating: 4.85,
        cost: 'Moderate',
        icon: '🍽️',
        color: '#f59e0b'
      },
      {
        id: `gen-r2-${Date.now()}`,
        name: `${shortName} Artisan Cafe & Roastery`,
        category: 'Specialty Coffee & Desserts',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
        lat: lat - 0.004,
        lng: lng + 0.003,
        rating: 4.9,
        cost: 'Casual',
        icon: '☕',
        color: '#ec4899'
      },
      {
        id: `gen-r3-${Date.now()}`,
        name: `The ${shortName} Rooftop Grill`,
        category: 'Fine Dining & Cocktails',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
        lat: lat + 0.006,
        lng: lng + 0.007,
        rating: 4.8,
        cost: 'Fine Dining',
        icon: '🍷',
        color: '#ef4444'
      }
    ],
    hotels: [
      {
        id: `gen-h1-${Date.now()}`,
        name: `The Grand ${shortName} Luxury Hotel`,
        category: '5-Star Grand Stay',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
        lat: lat - 0.005,
        lng: lng - 0.006,
        rating: 4.92,
        cost: 'Luxury',
        icon: '🏨',
        color: '#3b82f6'
      },
      {
        id: `gen-h2-${Date.now()}`,
        name: `${shortName} Boutique Heritage Suites`,
        category: 'Historic Boutique Hotel',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
        lat: lat + 0.004,
        lng: lng + 0.006,
        rating: 4.8,
        cost: 'Boutique',
        icon: '🏰',
        color: '#8b5cf6'
      },
      {
        id: `gen-h3-${Date.now()}`,
        name: `${shortName} Central Suites & Spa`,
        category: 'Modern Comfort Stay',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80',
        lat: lat - 0.007,
        lng: lng + 0.004,
        rating: 4.75,
        cost: 'Moderate',
        icon: '🛎️',
        color: '#06b6d4'
      }
    ]
  };
};

const POPULAR_SUGGESTIONS = [
  { name: 'New Delhi, Delhi, India', key: 'delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Ahmedabad, Gujarat, India', key: 'ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Paris, France', key: 'paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Mumbai, Maharashtra, India', key: 'mumbai', lat: 18.9220, lng: 72.8347 },
  { name: 'Goa, India', key: 'goa', lat: 15.2993, lng: 74.1240 },
  { name: 'Tokyo, Japan', key: 'tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'London, United Kingdom', key: 'london', lat: 51.5074, lng: -0.1278 },
  { name: 'New York, USA', key: 'new york', lat: 40.7128, lng: -74.0060 },
  { name: 'Dubai, UAE', key: 'dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'Santorini, Greece', key: 'santorini', lat: 36.3932, lng: 25.4615 }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CreateTripPage = () => {
  const navigate = useNavigate();

  // Phase 1 (Planning Modal) vs Phase 2 (Trip Workspace Dashboard)
  const [inWorkspace, setInWorkspace] = useState(false);

  // Form State for Step 1
  const [destinationInput, setDestinationInput] = useState('delhi');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const [liveSuggestions, setLiveSuggestions] = useState(POPULAR_SUGGESTIONS);

  // Active Destination Details
  const [selectedDestination, setSelectedDestination] = useState({
    name: 'New Delhi, Delhi, India',
    shortName: 'Delhi',
    lat: 28.6139,
    lng: 77.2090,
    coverImage: DESTINATIONS_DB.delhi.coverImage
  });

  // Places, Restaurants & Hotels state tailored to the active destination
  const [recommendedPlaces, setRecommendedPlaces] = useState(DESTINATIONS_DB.delhi.attractions);
  const [myPlaces, setMyPlaces] = useState(DESTINATIONS_DB.delhi.attractions);

  const [recommendedRestaurants, setRecommendedRestaurants] = useState(DESTINATIONS_DB.delhi.restaurants);
  const [myRestaurants, setMyRestaurants] = useState(DESTINATIONS_DB.delhi.restaurants.slice(0, 2));

  const [recommendedHotels, setRecommendedHotels] = useState(DESTINATIONS_DB.delhi.hotels);
  const [myHotels, setMyHotels] = useState(DESTINATIONS_DB.delhi.hotels.slice(0, 1));

  // Dynamic Calendar Navigation & Selection State
  const [calendarViewDate, setCalendarViewDate] = useState(new Date(2026, 8, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date(2026, 8, 9)); // Sep 9, 2026
  const [endDate, setEndDate] = useState(new Date(2026, 9, 24)); // Oct 24, 2026
  const [activeDateInput, setActiveDateInput] = useState('end'); // 'start' or 'end'

  // Tripmates & Companion Selection
  const [companionType, setCompanionType] = useState('Friends');
  const [showCompanionDropdown, setShowCompanionDropdown] = useState(false);
  const [tripmates, setTripmates] = useState(['Alex M.']);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // Workspace Navigation & View State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState('list'); // 'list' | 'map'
  const [activeNavTab, setActiveNavTab] = useState('explore'); // 'explore', 'places', 'restaurants', 'hotels', 'budget'
  const [tripTitle, setTripTitle] = useState('Trip to Delhi');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Inputs for adding items in each section
  const [newPlaceInput, setNewPlaceInput] = useState('');
  const [newRestaurantInput, setNewRestaurantInput] = useState('');
  const [newHotelInput, setNewHotelInput] = useState('');

  // Custom Sections State (for + New list)
  const [customSections, setCustomSections] = useState([]);

  // Budgeting State
  const [currency, setCurrency] = useState('₹');
  const [maxBudget, setMaxBudget] = useState(150000);
  const [showSetBudgetModal, setShowSetBudgetModal] = useState(false);
  const [budgetInputVal, setBudgetInputVal] = useState('150000');
  const [expenses, setExpenses] = useState([]);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: 'Activity',
    payer: 'Alex M.'
  });

  // AI Assistant Modal State
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiChatLog, setAiChatLog] = useState([
    {
      sender: 'ai',
      text: `👋 Hi! I'm your Globetrotter AI Travel Assistant. Planning a journey to ${selectedDestination.shortName}? Ask me for custom recommendations, best local food spots, or day-by-day itineraries!`
    }
  ]);

  // Dynamic Geocoding Search with OSM Nominatim API & Local DB
  useEffect(() => {
    if (!destinationInput || destinationInput.trim().length === 0) {
      setLiveSuggestions(POPULAR_SUGGESTIONS);
      return;
    }

    const query = destinationInput.toLowerCase().trim();
    const localMatches = POPULAR_SUGGESTIONS.filter((s) =>
      s.name.toLowerCase().includes(query)
    );

    setLiveSuggestions(localMatches);

    const timer = setTimeout(async () => {
      if (query.length >= 3) {
        try {
          setIsSearchingGeocode(true);
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
          );
          const data = await res.json();
          if (data && data.length > 0) {
            const apiResults = data.map((item) => ({
              name: item.display_name,
              key: item.display_name.split(',')[0].toLowerCase(),
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            }));
            
            const combined = [...localMatches];
            apiResults.forEach((item) => {
              if (!combined.some((c) => c.name.toLowerCase() === item.name.toLowerCase())) {
                combined.push(item);
              }
            });
            setLiveSuggestions(combined);
          }
        } catch (e) {
          // Ignore
        } finally {
          setIsSearchingGeocode(false);
        }
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [destinationInput]);

  // Select Destination and update Map Center, Title, Cover, Attractions, Restaurants & Hotels
  const selectDestinationItem = (dest) => {
    const rawKey = (dest.key || dest.name.split(',')[0]).toLowerCase().trim();
    const shortName = dest.name.split(',')[0].trim();
    
    const matchedDB = DESTINATIONS_DB[rawKey] || Object.values(DESTINATIONS_DB).find(d => 
      shortName.toLowerCase().includes(d.shortName.toLowerCase()) || d.shortName.toLowerCase().includes(shortName.toLowerCase())
    );

    const lat = dest.lat || (matchedDB ? matchedDB.lat : 28.6139);
    const lng = dest.lng || (matchedDB ? matchedDB.lng : 77.2090);
    const coverImage = matchedDB ? matchedDB.coverImage : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';

    const cityData = getDynamicPlacesForCity(shortName, lat, lng, matchedDB, coverImage);

    setDestinationInput(dest.name);
    setSelectedDestination({
      name: dest.name,
      shortName: shortName,
      lat: lat,
      lng: lng,
      coverImage: coverImage
    });

    setTripTitle(`Trip to ${shortName}`);
    setRecommendedPlaces(cityData.attractions);
    setMyPlaces(cityData.attractions);

    setRecommendedRestaurants(cityData.restaurants);
    setMyRestaurants(cityData.restaurants.slice(0, 2));

    setRecommendedHotels(cityData.hotels);
    setMyHotels(cityData.hotels.slice(0, 1));

    setShowSuggestions(false);
  };

  // Calendar Helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfWeek = (year, month) => new Date(year, month, 1).getDay();

  const m1Year = calendarViewDate.getFullYear();
  const m1Month = calendarViewDate.getMonth();
  const m2Date = new Date(m1Year, m1Month + 1, 1);
  const m2Year = m2Date.getFullYear();
  const m2Month = m2Date.getMonth();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCalendarViewDate(new Date(m1Year, m1Month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCalendarViewDate(new Date(m1Year, m1Month + 1, 1));
  };

  const handleSelectDate = (year, month, day) => {
    const chosen = new Date(year, month, day);
    if (activeDateInput === 'start') {
      setStartDate(chosen);
      if (endDate && chosen > endDate) {
        setEndDate(null);
      }
      setActiveDateInput('end');
    } else {
      if (startDate && chosen < startDate) {
        setStartDate(chosen);
        setEndDate(null);
      } else {
        setEndDate(chosen);
        setShowDatePicker(false);
      }
    }
  };

  const isDateSelected = (year, month, day) => {
    const current = new Date(year, month, day).getTime();
    const startMs = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime() : null;
    const endMs = endDate ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime() : null;

    if (startMs && current === startMs) return 'start';
    if (endMs && current === endMs) return 'end';
    if (startMs && endMs && current > startMs && current < endMs) return 'in-range';
    return null;
  };

  const formatDisplayDate = (d) => {
    if (!d) return 'Select Date';
    return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
  };

  const formatBadgeDates = () => {
    if (!startDate && !endDate) return 'Dates (Optional)';
    if (startDate && !endDate) return `${startDate.getMonth() + 1}/${startDate.getDate()}`;
    return `${startDate.getMonth() + 1}/${startDate.getDate()} - ${endDate.getMonth() + 1}/${endDate.getDate()}`;
  };

  // Handlers for Adding & Removing Places, Restaurants & Hotels
  const handleTogglePlace = (place) => {
    if (myPlaces.some((p) => p.id === place.id)) {
      setMyPlaces(myPlaces.filter((p) => p.id !== place.id));
    } else {
      setMyPlaces([...myPlaces, place]);
    }
  };

  const handleCreateCustomPlace = (e) => {
    e.preventDefault();
    if (!newPlaceInput.trim()) return;
    const newPlace = {
      id: `custom-p-${Date.now()}`,
      name: newPlaceInput.trim(),
      category: 'Custom Place',
      image: selectedDestination.coverImage,
      lat: selectedDestination.lat + (Math.random() - 0.5) * 0.03,
      lng: selectedDestination.lng + (Math.random() - 0.5) * 0.03,
      rating: 5.0,
      cost: 'Free',
      icon: '📍',
      color: '#f05a36'
    };
    setMyPlaces([...myPlaces, newPlace]);
    setNewPlaceInput('');
  };

  const handleToggleRestaurant = (rest) => {
    if (myRestaurants.some((r) => r.id === rest.id)) {
      setMyRestaurants(myRestaurants.filter((r) => r.id !== rest.id));
    } else {
      setMyRestaurants([...myRestaurants, rest]);
    }
  };

  const handleCreateCustomRestaurant = (e) => {
    e.preventDefault();
    if (!newRestaurantInput.trim()) return;
    const newRest = {
      id: `custom-r-${Date.now()}`,
      name: newRestaurantInput.trim(),
      category: 'Restaurant / Cafe',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      lat: selectedDestination.lat + (Math.random() - 0.5) * 0.03,
      lng: selectedDestination.lng + (Math.random() - 0.5) * 0.03,
      rating: 4.8,
      cost: 'Moderate',
      icon: '🍽️',
      color: '#f59e0b'
    };
    setMyRestaurants([...myRestaurants, newRest]);
    setNewRestaurantInput('');
  };

  const handleToggleHotel = (hotel) => {
    if (myHotels.some((h) => h.id === hotel.id)) {
      setMyHotels(myHotels.filter((h) => h.id !== hotel.id));
    } else {
      setMyHotels([...myHotels, hotel]);
    }
  };

  const handleCreateCustomHotel = (e) => {
    e.preventDefault();
    if (!newHotelInput.trim()) return;
    const newHotel = {
      id: `custom-h-${Date.now()}`,
      name: newHotelInput.trim(),
      category: 'Hotel / Stay',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
      lat: selectedDestination.lat + (Math.random() - 0.5) * 0.03,
      lng: selectedDestination.lng + (Math.random() - 0.5) * 0.03,
      rating: 4.9,
      cost: 'Luxury',
      icon: '🏨',
      color: '#3b82f6'
    };
    setMyHotels([...myHotels, newHotel]);
    setNewHotelInput('');
  };

  // Smooth scroll to section in workspace
  const scrollToSection = (sectionId) => {
    setActiveNavTab(sectionId);
    setMobileSidebarOpen(false);
    if (sectionId === 'budget') return;

    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Total Mapped Items for Leaflet Map
  const allMappedItems = [
    ...myPlaces,
    ...myRestaurants,
    ...myHotels
  ];

  // Budget calculations
  const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount) return;
    const newExp = {
      id: `exp-${Date.now()}`,
      title: expenseForm.title,
      amount: parseFloat(expenseForm.amount),
      category: expenseForm.category,
      payer: expenseForm.payer,
      date: new Date().toLocaleDateString()
    };
    setExpenses([...expenses, newExp]);
    setExpenseForm({ title: '', amount: '', category: 'Activity', payer: 'Alex M.' });
    setShowAddExpenseModal(false);
  };

  const handleSendAiPrompt = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    const userMsg = { sender: 'user', text: aiPrompt };
    const query = aiPrompt.toLowerCase();
    let reply = `Here are the best recommendations for ${selectedDestination.shortName}! Check out ${recommendedPlaces[0]?.name} and dine at ${recommendedRestaurants[0]?.name}.`;

    if (query.includes('food') || query.includes('restaurant') || query.includes('eat')) {
      reply = `🍽️ For dining in ${selectedDestination.shortName}, you must visit ${recommendedRestaurants[0]?.name} and ${recommendedRestaurants[1]?.name || 'the local night market'}!`;
    } else if (query.includes('hotel') || query.includes('stay') || query.includes('resort')) {
      reply = `🏨 For accommodation in ${selectedDestination.shortName}, we highly recommend ${recommendedHotels[0]?.name} for an exceptional experience.`;
    }

    const aiMsg = { sender: 'ai', text: reply };
    setAiChatLog([...aiChatLog, userMsg, aiMsg]);
    setAiPrompt('');
  };

  const m1DaysCount = getDaysInMonth(m1Year, m1Month);
  const m1StartDay = getFirstDayOfWeek(m1Year, m1Month);
  const m2DaysCount = getDaysInMonth(m2Year, m2Month);
  const m2StartDay = getFirstDayOfWeek(m2Year, m2Month);

  // =========================================================================
  // VIEW 1: "Plan a new trip" Initial Setup & Dynamic Datepicker (Dark Theme)
  // =========================================================================
  if (!inWorkspace) {
    return (
      <div className="plan-trip-page-wrapper dark-theme-page">
        {/* Top-Left Back Button (Matches Image 2) */}
        <div className="plan-top-nav-bar">
          <button 
            type="button" 
            className="plan-page-back-btn" 
            onClick={() => navigate(-1)} 
            title="Go back"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
        </div>

        <main className="plan-trip-container">
          <h1 className="plan-trip-heading">Plan a new trip</h1>

          <div className="plan-trip-card">
            {/* Input 1: Where to? */}
            <div className="plan-input-group">
              <label className="plan-input-label">Where to?</label>
              <div className="plan-input-box">
                <input
                  type="text"
                  className="plan-text-input"
                  placeholder="e.g. Delhi, Ahmedabad, Paris, Tokyo"
                  value={destinationInput}
                  onChange={(e) => {
                    setDestinationInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
              </div>

              {/* Autocomplete Suggestions Menu */}
              {showSuggestions && (
                <div className="dest-suggestions-menu custom-scroll">
                  {isSearchingGeocode && (
                    <div className="dest-suggestion-item searching-item">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Searching destinations...</span>
                    </div>
                  )}
                  {liveSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="dest-suggestion-item"
                      onClick={() => selectDestinationItem(item)}
                    >
                      <MapPin size={16} className="dest-icon" />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="plan-prompt-text">Choose a destination to start planning</p>

            {/* Input 2: Dates (Optional) with Dual Calendar Trigger */}
            <div
              className={`plan-input-group dates-group ${showDatePicker ? 'active' : ''}`}
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <label className="plan-input-label">Dates (Optional)</label>
              <div className="plan-dates-split-box">
                <div 
                  className={`date-col ${activeDateInput === 'start' ? 'active-target' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDateInput('start');
                    setShowDatePicker(true);
                  }}
                >
                  <Calendar size={18} className="date-icon" />
                  <span className="date-val">{startDate ? formatDisplayDate(startDate) : 'Start date'}</span>
                </div>

                <div className="dates-divider" />

                <div 
                  className={`date-col ${activeDateInput === 'end' ? 'active-target' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDateInput('end');
                    setShowDatePicker(true);
                  }}
                >
                  <Calendar size={18} className="date-icon highlight-orange" />
                  <span className="date-val">{endDate ? formatDisplayDate(endDate) : 'End date'}</span>
                </div>
              </div>

              {/* DUAL-MONTH DYNAMIC CALENDAR POPOVER */}
              {showDatePicker && (
                <div className="dual-month-calendar-popover" onClick={(e) => e.stopPropagation()}>
                  <div className="calendar-panels-row">
                    
                    {/* Month Panel 1 */}
                    <div className="month-panel">
                      <div className="month-header">
                        <button type="button" className="cal-nav-btn" onClick={handlePrevMonth}>
                          <ChevronLeft size={18} />
                        </button>
                        <h4 className="month-title">{MONTH_NAMES[m1Month]} {m1Year}</h4>
                        <div className="month-header-spacer" />
                      </div>

                      <div className="weekdays-grid">
                        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                      </div>

                      <div className="days-grid">
                        {[...Array(m1StartDay)].map((_, i) => (
                          <div key={`m1-empty-${i}`} className="empty-day" />
                        ))}
                        {[...Array(m1DaysCount)].map((_, i) => {
                          const dayNum = i + 1;
                          const selState = isDateSelected(m1Year, m1Month, dayNum);
                          return (
                            <button
                              key={`m1-${dayNum}`}
                              type="button"
                              className={`day-cell ${selState || ''}`}
                              onClick={() => handleSelectDate(m1Year, m1Month, dayNum)}
                            >
                              {dayNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Month Panel 2 */}
                    <div className="month-panel">
                      <div className="month-header">
                        <div className="month-header-spacer" />
                        <h4 className="month-title">{MONTH_NAMES[m2Month]} {m2Year}</h4>
                        <button type="button" className="cal-nav-btn" onClick={handleNextMonth}>
                          <ChevronRight size={18} />
                        </button>
                      </div>

                      <div className="weekdays-grid">
                        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                      </div>

                      <div className="days-grid">
                        {[...Array(m2StartDay)].map((_, i) => (
                          <div key={`m2-empty-${i}`} className="empty-day" />
                        ))}
                        {[...Array(m2DaysCount)].map((_, i) => {
                          const dayNum = i + 1;
                          const selState = isDateSelected(m2Year, m2Month, dayNum);
                          return (
                            <button
                              key={`m2-${dayNum}`}
                              type="button"
                              className={`day-cell ${selState || ''}`}
                              onClick={() => handleSelectDate(m2Year, m2Month, dayNum)}
                            >
                              {dayNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Tripmates + Companion Mode Row */}
            <div className="plan-options-row">
              <button 
                type="button"
                className="invite-tripmates-link"
                onClick={() => setShowInviteModal(true)}
              >
                <Plus size={16} />
                <span>Invite tripmates</span>
              </button>

              <div className="companion-dropdown-container">
                <button
                  type="button"
                  className="companion-selector-btn"
                  onClick={() => setShowCompanionDropdown(!showCompanionDropdown)}
                >
                  <Users size={16} />
                  <span>{companionType}</span>
                  <ChevronDown size={14} />
                </button>

                {showCompanionDropdown && (
                  <div className="companion-dropdown-menu">
                    {['Solo', 'Couple', 'Friends', 'Family', 'Business'].map((t) => (
                      <div
                        key={t}
                        className={`companion-opt ${companionType === t ? 'selected' : ''}`}
                        onClick={() => {
                          setCompanionType(t);
                          setShowCompanionDropdown(false);
                        }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Start Planning Button */}
            <div className="plan-submit-wrapper">
              <button
                type="button"
                className="start-planning-btn"
                onClick={() => setInWorkspace(true)}
              >
                Start planning
              </button>
            </div>

            <div className="plan-footer-link">
              <button type="button" className="write-guide-link" onClick={() => navigate('/explore')}>
                Or write a new guide
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FULL-SCREEN TRIP WORKSPACE
  // =========================================================================
  return (
    <div className={`trip-workspace-root dark-workspace no-topbar-workspace mobile-mode-${mobileViewMode}`}>
      
      {/* MOBILE WORKSPACE TOPBAR (Matches Image 2) */}
      <header className="mobile-workspace-topbar">
        <div className="mobile-topbar-left">
          <button 
            type="button" 
            className="topbar-back-btn" 
            onClick={() => setInWorkspace(false)} 
            title="Back to trip setup"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="mobile-brand-logo">
            <span className="brand-flower-icon">✦</span>
          </div>
          <span className="saved-status-badge">SAVED</span>
          <button className="topbar-icon-action" title="Undo"><RotateCcw size={15} /></button>
          <button className="topbar-icon-action" title="Redo"><RotateCw size={15} /></button>
        </div>

        <div className="mobile-topbar-right">
          <button className="mobile-pill-btn" onClick={() => setShowInviteModal(true)}>
            <Share2 size={13} />
            <span>Share</span>
          </button>
          <button className="mobile-pill-btn" onClick={() => setShowInviteModal(true)}>
            <Smartphone size={13} />
            <span>Get app</span>
          </button>
          <button className="mobile-more-btn" title="More options">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE SPLIT-VIEW */}
      <div className="workspace-body full-height-body">
        
        {/* A. LEFT DOCKED SIDEBAR (Desktop) */}
        <aside className={`workspace-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          
          {/* Back to Trip Setup Button (Matches Image 1) */}
          <div className="sidebar-back-row">
            <button 
              type="button" 
              className="sidebar-back-pill-btn"
              onClick={() => setInWorkspace(false)}
              title="Back to plan a new trip"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          </div>

          {/* Top AI Assistant Button */}
          <button 
            className="ai-assistant-sidebar-btn"
            onClick={() => setShowAIModal(true)}
          >
            <Sparkles size={18} className="ai-sparkle-icon" />
            <span>AI Assistant</span>
          </button>

          {/* Nav Items Accordion */}
          <div className="sidebar-nav-list">
            
            {/* Overview Section */}
            <div className="nav-group">
              <div 
                className="nav-group-header active-header"
                onClick={() => scrollToSection('explore')}
              >
                <ChevronDown size={16} />
                <span>Overview</span>
              </div>
              <div className="nav-sub-list">
                <button 
                  className={`nav-sub-item ${activeNavTab === 'explore' ? 'active-sub' : ''}`}
                  onClick={() => scrollToSection('explore')}
                >
                  Explore
                </button>
                <button 
                  className={`nav-sub-item ${activeNavTab === 'places' ? 'active-sub' : ''}`}
                  onClick={() => scrollToSection('places')}
                >
                  Places to visit
                </button>
                <button 
                  className={`nav-sub-item ${activeNavTab === 'restaurants' ? 'active-sub' : ''}`}
                  onClick={() => scrollToSection('restaurants')}
                >
                  Restaurants
                </button>
                <button 
                  className={`nav-sub-item ${activeNavTab === 'hotels' ? 'active-sub' : ''}`}
                  onClick={() => scrollToSection('hotels')}
                >
                  Hotels
                </button>
              </div>
            </div>

            {/* Itinerary Section */}
            <div className="nav-group">
              <div 
                className="nav-group-header"
                onClick={() => scrollToSection('places')}
              >
                <ChevronDown size={16} />
                <span>Itinerary</span>
              </div>
              <div className="nav-sub-list">
                <button className="nav-sub-item active-day-pill">
                  {startDate ? `Wed ${MONTH_NAMES[startDate.getMonth()].slice(0, 3)} ${startDate.getDate()}` : 'Wed 10/14'}
                </button>
              </div>
            </div>

            {/* Budget Section */}
            <div className="nav-group">
              <div 
                className={`nav-group-header ${activeNavTab === 'budget' ? 'active-header' : ''}`}
                onClick={() => setActiveNavTab('budget')}
              >
                <ChevronDown size={16} />
                <span>Budget</span>
              </div>
              <div className="nav-sub-list">
                <button 
                  className={`nav-sub-item ${activeNavTab === 'budget' ? 'active-sub' : ''}`}
                  onClick={() => setActiveNavTab('budget')}
                >
                  View
                </button>
              </div>
            </div>

          </div>

          {/* Sidebar Bottom Actions */}
          <div className="sidebar-bottom-controls">
            <button className="sidebar-support-btn" onClick={() => setShowAIModal(true)}>
              <HelpCircle size={15} />
              <span>Support & AI Help</span>
            </button>
            <button 
              className="sidebar-collapse-btn" 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <ChevronLeft size={15} />
              <span>Hide sidebar</span>
            </button>
          </div>
        </aside>

        {/* B. MIDDLE SCROLLABLE ITINERARY & PLACES BUILDER */}
        <main className={`workspace-main-content custom-scroll ${mobileViewMode === 'map' ? 'mobile-hidden' : ''}`}>
          
          {activeNavTab !== 'budget' ? (
            <div className="content-scroll-container">
              
              {/* 1. Destination Hero Banner */}
              <div className="destination-hero-banner">
                <img 
                  src={selectedDestination.coverImage} 
                  alt={selectedDestination.name}
                  className="hero-cover-img"
                />

                {/* Hero Overlay Top-Left Actions (Matches Image 2) */}
                <div className="hero-top-left-actions">
                  <button 
                    className="hero-ai-action-btn"
                    onClick={() => setShowAIModal(true)}
                    title="Ask AI Assistant"
                  >
                    <Sparkles size={16} />
                  </button>
                  <button 
                    className="hero-menu-action-btn"
                    onClick={() => setMobileSidebarOpen(true)}
                    title="Menu Drawer"
                  >
                    <Menu size={18} />
                  </button>
                </div>

                <button 
                  className="edit-cover-btn" 
                  title="Change destination or cover"
                  onClick={() => setInWorkspace(false)}
                >
                  <Edit2 size={15} />
                </button>

                {/* Floating Trip Info Card (Matches Image 2) */}
                <div className="floating-trip-card glass-card">
                  {isEditingTitle ? (
                    <input 
                      type="text" 
                      value={tripTitle}
                      onChange={(e) => setTripTitle(e.target.value)}
                      onBlur={() => setIsEditingTitle(false)}
                      autoFocus
                      className="title-edit-input"
                    />
                  ) : (
                    <h2 className="trip-main-title" onClick={() => setIsEditingTitle(true)}>
                      {tripTitle}
                    </h2>
                  )}

                  <div className="trip-meta-row">
                    <div className="trip-dates-badge">
                      <Calendar size={14} />
                      <span>{formatBadgeDates()}</span>
                    </div>

                    <div className="collaborator-avatars">
                      <div className="avatar-circle">N</div>
                      <button className="avatar-add-btn" onClick={() => setShowInviteModal(true)}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. EXPLORE SECTION */}
              <section id="section-explore" className="explore-section">
                <div className="section-header-row">
                  <div className="section-title-with-arrow">
                    <ChevronDown size={18} />
                    <h3 className="section-title">Explore</h3>
                  </div>
                  <button 
                    className="browse-all-pill-btn"
                    onClick={() => navigate('/explore')}
                  >
                    <Search size={14} />
                    <span>Browse all</span>
                  </button>
                </div>

                {/* Horizontal Explore Cards Grid / Carousel */}
                <div className="explore-carousel-container">
                  <div className="explore-cards-grid custom-scroll">
                    
                    {/* Card 1: Top Sights */}
                    <div className="explore-card modern-card" onClick={() => scrollToSection('places')}>
                      <div className="card-thumb-wrapper">
                        <img 
                          src={recommendedPlaces[0]?.image || selectedDestination.coverImage} 
                          alt="Top sights" 
                          className="card-thumb-img"
                        />
                      </div>
                      <div className="card-content">
                        <h4 className="card-heading">Top sights in {selectedDestination.shortName}</h4>
                        <p className="card-subtext">Curated attractions, monuments & landmarks</p>
                        <div className="card-brand-tag">
                          <span className="brand-icon-circle"></span>
                          <span className="brand-text">Globetrotter</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Best Restaurants */}
                    <div className="explore-card modern-card" onClick={() => scrollToSection('restaurants')}>
                      <div className="card-thumb-wrapper">
                        <img 
                          src={recommendedRestaurants[0]?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'} 
                          alt="Best restaurants" 
                          className="card-thumb-img"
                        />
                      </div>
                      <div className="card-content">
                        <h4 className="card-heading">Best restaurants in {selectedDestination.shortName}</h4>
                        <p className="card-subtext">Authentic local cuisines & famous bistros</p>
                        <div className="card-brand-tag">
                          <span className="brand-icon-circle"></span>
                          <span className="brand-text">Globetrotter</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Hotels */}
                    <div className="explore-card modern-card" onClick={() => scrollToSection('hotels')}>
                      <div className="card-thumb-wrapper">
                        <img 
                          src={recommendedHotels[0]?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'} 
                          alt="Search hotels" 
                          className="card-thumb-img"
                        />
                      </div>
                      <div className="card-content">
                        <h4 className="card-heading">Search hotels in {selectedDestination.shortName}</h4>
                        <p className="card-subtext">5-star luxury, resorts & boutique stays</p>
                        <div className="card-brand-tag">
                          <span className="brand-icon-circle"></span>
                          <span className="brand-text">Globetrotter</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  <button className="explore-carousel-arrow-btn" onClick={() => navigate('/explore')} title="View more">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </section>

              {/* 3. SECTION: PLACES TO VISIT (Attractions) */}
              <section id="section-places" className="places-to-visit-section">
                <div className="section-header-row">
                  <div className="section-title-with-arrow">
                    <ChevronDown size={18} />
                    <h3 className="section-title">Places to visit</h3>
                  </div>
                  <button className="more-action-btn">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                {/* Add a Place Interactive Bar */}
                <form onSubmit={handleCreateCustomPlace} className="add-place-input-bar">
                  <MapPin size={18} className="pin-icon" />
                  <input 
                    type="text" 
                    placeholder={`Add a place to ${selectedDestination.shortName} (press Enter)`}
                    value={newPlaceInput}
                    onChange={(e) => setNewPlaceInput(e.target.value)}
                    className="place-text-field"
                  />
                  <div className="input-actions-right">
                    <button type="button" className="action-toggle-btn" title="View Options">
                      <LayoutList size={16} />
                    </button>
                    <button type="button" className="action-toggle-btn" title="List View">
                      <Grid size={16} />
                    </button>
                  </div>
                </form>

                {/* Recommended Places Horizontal Chip Carousel */}
                <div className="recommended-places-block">
                  <div className="recommended-label-row">
                    <span className="rec-label">Recommended places in {selectedDestination.shortName}</span>
                  </div>

                  <div className="recommended-chips-scroll custom-scroll">
                    {recommendedPlaces.map((place) => {
                      const isAdded = myPlaces.some((p) => p.id === place.id);
                      return (
                        <div key={place.id} className="rec-place-chip" onClick={() => handleTogglePlace(place)}>
                          <img src={place.image} alt={place.name} className="chip-img" />
                          <span className="chip-name">{place.name}</span>
                          <button 
                            type="button"
                            className={`chip-add-btn ${isAdded ? 'added' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePlace(place);
                            }}
                            title={isAdded ? 'Remove from trip' : 'Add to trip'}
                          >
                            {isAdded ? <Check size={14} /> : <Plus size={14} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* User Added Places List */}
                {myPlaces.length > 0 && (
                  <div className="user-added-places-list">
                    <h5 className="added-places-title">Selected attractions ({myPlaces.length} places mapped):</h5>
                    <div className="added-places-grid">
                      {myPlaces.map((item) => (
                        <div key={item.id} className="added-place-row">
                          <div className="place-info">
                            <span className="place-icon">{item.icon || '🏛️'}</span>
                            <div>
                              <strong className="place-name">{item.name}</strong>
                              <span className="place-cat">{item.category} • {item.cost || 'Free'}</span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            className="remove-place-btn"
                            onClick={() => setMyPlaces(myPlaces.filter((p) => p.id !== item.id))}
                            title="Remove place"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* 4. SECTION: RESTAURANTS & DINING (Matches Image 1) */}
              <section id="section-restaurants" className="places-to-visit-section">
                <div className="section-header-row">
                  <div className="section-title-with-arrow">
                    <ChevronDown size={18} />
                    <h3 className="section-title">Restaurants & Dining</h3>
                  </div>
                  <button className="more-action-btn">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                {/* Add Restaurant Input Bar */}
                <form onSubmit={handleCreateCustomRestaurant} className="add-place-input-bar">
                  <UtensilsCrossed size={18} className="pin-icon" />
                  <input 
                    type="text" 
                    placeholder={`Add a restaurant, cafe or bakery in ${selectedDestination.shortName} (press Enter)`}
                    value={newRestaurantInput}
                    onChange={(e) => setNewRestaurantInput(e.target.value)}
                    className="place-text-field"
                  />
                  <div className="input-actions-right">
                    <button type="button" className="action-toggle-btn" title="View Options">
                      <LayoutList size={16} />
                    </button>
                    <button type="button" className="action-toggle-btn" title="List View">
                      <Grid size={16} />
                    </button>
                  </div>
                </form>

                {/* Recommended Restaurants Chips */}
                <div className="recommended-places-block">
                  <div className="recommended-label-row">
                    <span className="rec-label">Recommended restaurants & cafes in {selectedDestination.shortName}</span>
                  </div>

                  <div className="recommended-chips-scroll custom-scroll">
                    {recommendedRestaurants.map((rest) => {
                      const isAdded = myRestaurants.some((r) => r.id === rest.id);
                      return (
                        <div key={rest.id} className="rec-place-chip" onClick={() => handleToggleRestaurant(rest)}>
                          <img src={rest.image} alt={rest.name} className="chip-img" />
                          <span className="chip-name">{rest.name}</span>
                          <button 
                            type="button"
                            className={`chip-add-btn ${isAdded ? 'added' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRestaurant(rest);
                            }}
                            title={isAdded ? 'Remove from trip' : 'Add to trip'}
                          >
                            {isAdded ? <Check size={14} /> : <Plus size={14} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* User Added Restaurants List */}
                {myRestaurants.length > 0 && (
                  <div className="user-added-places-list">
                    <h5 className="added-places-title">Selected restaurants & food spots ({myRestaurants.length} mapped):</h5>
                    <div className="added-places-grid">
                      {myRestaurants.map((item) => (
                        <div key={item.id} className="added-place-row">
                          <div className="place-info">
                            <span className="place-icon">{item.icon || '🍽️'}</span>
                            <div>
                              <strong className="place-name">{item.name}</strong>
                              <span className="place-cat">{item.category} • {item.cost || 'Moderate'}</span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            className="remove-place-btn"
                            onClick={() => setMyRestaurants(myRestaurants.filter((r) => r.id !== item.id))}
                            title="Remove restaurant"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* 5. SECTION: HOTELS & ACCOMMODATIONS (Matches Image 1) */}
              <section id="section-hotels" className="places-to-visit-section">
                <div className="section-header-row">
                  <div className="section-title-with-arrow">
                    <ChevronDown size={18} />
                    <h3 className="section-title">Hotels & Stays</h3>
                  </div>
                  <button className="more-action-btn">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                {/* Add Hotel Input Bar */}
                <form onSubmit={handleCreateCustomHotel} className="add-place-input-bar">
                  <Hotel size={18} className="pin-icon" />
                  <input 
                    type="text" 
                    placeholder={`Add a hotel, resort or stay in ${selectedDestination.shortName} (press Enter)`}
                    value={newHotelInput}
                    onChange={(e) => setNewHotelInput(e.target.value)}
                    className="place-text-field"
                  />
                  <div className="input-actions-right">
                    <button type="button" className="action-toggle-btn" title="View Options">
                      <LayoutList size={16} />
                    </button>
                    <button type="button" className="action-toggle-btn" title="List View">
                      <Grid size={16} />
                    </button>
                  </div>
                </form>

                {/* Recommended Hotels Chips */}
                <div className="recommended-places-block">
                  <div className="recommended-label-row">
                    <span className="rec-label">Recommended hotels & resorts in {selectedDestination.shortName}</span>
                  </div>

                  <div className="recommended-chips-scroll custom-scroll">
                    {recommendedHotels.map((hotel) => {
                      const isAdded = myHotels.some((h) => h.id === hotel.id);
                      return (
                        <div key={hotel.id} className="rec-place-chip" onClick={() => handleToggleHotel(hotel)}>
                          <img src={hotel.image} alt={hotel.name} className="chip-img" />
                          <span className="chip-name">{hotel.name}</span>
                          <button 
                            type="button"
                            className={`chip-add-btn ${isAdded ? 'added' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleHotel(hotel);
                            }}
                            title={isAdded ? 'Remove from trip' : 'Add to trip'}
                          >
                            {isAdded ? <Check size={14} /> : <Plus size={14} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* User Added Hotels List */}
                {myHotels.length > 0 && (
                  <div className="user-added-places-list">
                    <h5 className="added-places-title">Selected hotels & stays ({myHotels.length} mapped):</h5>
                    <div className="added-places-grid">
                      {myHotels.map((item) => (
                        <div key={item.id} className="added-place-row">
                          <div className="place-info">
                            <span className="place-icon">{item.icon || '🏨'}</span>
                            <div>
                              <strong className="place-name">{item.name}</strong>
                              <span className="place-cat">{item.category} • {item.cost || 'Luxury'}</span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            className="remove-place-btn"
                            onClick={() => setMyHotels(myHotels.filter((h) => h.id !== item.id))}
                            title="Remove hotel"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* 6. Dynamic Custom Sections List */}
              <div className="places-to-visit-section">
                {customSections.map((sec, sIdx) => (
                  <div key={sec.id} className="custom-section-item">
                    <div className="section-header-row">
                      <div className="section-title-with-arrow">
                        <ChevronDown size={18} />
                        <h4 className="custom-sec-title">{sec.title}</h4>
                      </div>
                      <button 
                        className="remove-place-btn" 
                        onClick={() => setCustomSections(customSections.filter((_, idx) => idx !== sIdx))}
                        title="Delete section"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="add-place-input-bar">
                      <MapPin size={18} className="pin-icon" />
                      <input 
                        type="text" 
                        placeholder={`Add an item to ${sec.title}`} 
                        className="place-text-field"
                      />
                    </div>
                  </div>
                ))}

                {/* + New list Coral Button */}
                <div className="new-list-btn-row">
                  <button 
                    type="button"
                    className="new-list-coral-btn"
                    onClick={() => {
                      const newSec = {
                        id: `sec-${Date.now()}`,
                        title: `Custom List ${customSections.length + 1}`,
                        places: []
                      };
                      setCustomSections([...customSections, newSec]);
                    }}
                  >
                    <Plus size={16} />
                    <span>New list</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* TAB: BUDGETING VIEW */
            <div className="budgeting-view-container">
              
              <div className="budgeting-header-row">
                <h2 className="budgeting-title">Budgeting</h2>
                <button 
                  type="button"
                  className="add-expense-coral-btn"
                  onClick={() => setShowAddExpenseModal(true)}
                >
                  <Plus size={16} />
                  <span>Add expense</span>
                </button>
              </div>

              {/* Total Balance Card */}
              <div className="budget-summary-card">
                <div className="budget-balance-display">
                  <span className="currency-symbol">{currency}</span>
                  <span className="balance-amount">{totalSpent.toFixed(2)}</span>
                </div>

                <div className="budget-actions-row">
                  <div className="budget-pill-buttons-left">
                    <button 
                      type="button"
                      className="budget-pill-btn"
                      onClick={() => setShowSetBudgetModal(true)}
                    >
                      <DollarSign size={14} />
                      <span>Set budget ({currency}{maxBudget.toLocaleString()})</span>
                    </button>
                    <button 
                      type="button"
                      className="budget-pill-btn"
                      onClick={() => {
                        const curList = ['₹', '$', '€', '£', '¥'];
                        const nextIdx = (curList.indexOf(currency) + 1) % curList.length;
                        setCurrency(curList[nextIdx]);
                      }}
                    >
                      <span>Currency: {currency}</span>
                    </button>
                  </div>

                  <div className="budget-links-right">
                    <button type="button" className="budget-link-item" onClick={() => setShowInviteModal(true)}>
                      <Users size={14} />
                      <span>Manage payers</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Expenses List */}
              <div className="expenses-section">
                <div className="expenses-header-row">
                  <h3 className="expenses-title">Expenses ({expenses.length})</h3>
                </div>

                {expenses.length === 0 ? (
                  <div className="empty-expenses-state">
                    <p>No expenses recorded yet. Tap "+ Add expense" above to start tracking!</p>
                  </div>
                ) : (
                  <div className="expenses-list">
                    {expenses.map((exp) => (
                      <div key={exp.id} className="expense-item-card">
                        <div className="exp-left">
                          <div className="exp-icon-box">💳</div>
                          <div>
                            <strong className="exp-title">{exp.title}</strong>
                            <p className="exp-sub">{exp.category} • Paid by {exp.payer} on {exp.date}</p>
                          </div>
                        </div>
                        <div className="exp-right">
                          <span className="exp-amount">{currency}{exp.amount.toFixed(2)}</span>
                          <button 
                            type="button"
                            className="exp-delete-btn" 
                            onClick={() => setExpenses(expenses.filter((e) => e.id !== exp.id))}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </main>

        {/* C. RIGHT SPLIT-SCREEN MAP VIEW (Interactive Leaflet Map with real pins) */}
        <section className={`workspace-map-pane ${mobileViewMode === 'map' ? 'mobile-visible' : 'mobile-hidden'}`}>
          <TripMap
            places={allMappedItems}
            center={[selectedDestination.lat, selectedDestination.lng]}
            zoom={12}
            destinationName={selectedDestination.shortName}
          />
        </section>

      </div>

      {/* FLOATING VIEW TOGGLE ON MOBILE (Matches Image 2) */}
      <div className="mobile-floating-view-toggle">
        <button 
          type="button"
          className="floating-view-pill-btn"
          onClick={() => setMobileViewMode(mobileViewMode === 'list' ? 'map' : 'list')}
        >
          {mobileViewMode === 'list' ? (
            <>
              <MapPin size={16} />
              <span>Map view</span>
            </>
          ) : (
            <>
              <LayoutList size={16} />
              <span>List view</span>
            </>
          )}
        </button>
      </div>

      {/* MOBILE SLIDE-IN SIDEBAR DRAWER (Triggered via Hamburger Menu) */}
      {mobileSidebarOpen && (
        <>
          <div className="mobile-sidebar-backdrop" onClick={() => setMobileSidebarOpen(false)} />
          <div className="mobile-sidebar-drawer custom-scroll">
            <div className="mobile-sidebar-header">
              <h3 className="mobile-drawer-title">{tripTitle}</h3>
              <button 
                type="button" 
                className="mobile-drawer-close"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <button 
              type="button"
              className="ai-assistant-sidebar-btn"
              onClick={() => {
                setMobileSidebarOpen(false);
                setShowAIModal(true);
              }}
            >
              <Sparkles size={18} className="ai-sparkle-icon" />
              <span>AI Assistant</span>
            </button>

            <div className="sidebar-nav-list">
              <div className="nav-group">
                <div className="nav-group-header active-header">
                  <ChevronDown size={16} />
                  <span>Overview</span>
                </div>
                <div className="nav-sub-list">
                  <button 
                    type="button"
                    className={`nav-sub-item ${activeNavTab === 'explore' ? 'active-sub' : ''}`}
                    onClick={() => scrollToSection('explore')}
                  >
                    Explore
                  </button>
                  <button 
                    type="button"
                    className={`nav-sub-item ${activeNavTab === 'places' ? 'active-sub' : ''}`}
                    onClick={() => scrollToSection('places')}
                  >
                    Places to visit
                  </button>
                  <button 
                    type="button"
                    className={`nav-sub-item ${activeNavTab === 'restaurants' ? 'active-sub' : ''}`}
                    onClick={() => scrollToSection('restaurants')}
                  >
                    Restaurants
                  </button>
                  <button 
                    type="button"
                    className={`nav-sub-item ${activeNavTab === 'hotels' ? 'active-sub' : ''}`}
                    onClick={() => scrollToSection('hotels')}
                  >
                    Hotels
                  </button>
                </div>
              </div>

              <div className="nav-group">
                <div 
                  className="nav-group-header"
                  onClick={() => {
                    setActiveNavTab('budget');
                    setMobileSidebarOpen(false);
                  }}
                >
                  <ChevronDown size={16} />
                  <span>Budget</span>
                </div>
              </div>
            </div>

            <div className="sidebar-bottom-controls">
              <button 
                type="button" 
                className="sidebar-support-btn" 
                onClick={() => {
                  setMobileSidebarOpen(false);
                  setInWorkspace(false);
                }}
              >
                <ChevronLeft size={15} />
                <span>Back to Setup</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* MODAL 1: INVITE TRIPMATES */}
      {showInviteModal && (
        <div className="modal-backdrop" onClick={() => setShowInviteModal(false)}>
          <div className="dark-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invite Tripmates</h3>
              <button type="button" className="close-btn" onClick={() => setShowInviteModal(false)}>
                <X size={18} />
              </button>
            </div>
            <p className="modal-desc">Share this trip with your friends or enter their email address to collaborate in real-time.</p>
            <div className="modal-input-row">
              <input
                type="email"
                placeholder="friend@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="modal-email-input"
              />
              <button 
                type="button" 
                className="modal-invite-btn"
                onClick={() => {
                  if (inviteEmail) {
                    setTripmates([...tripmates, inviteEmail]);
                    setInviteEmail('');
                    setShowInviteModal(false);
                  }
                }}
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SET BUDGET */}
      {showSetBudgetModal && (
        <div className="modal-backdrop" onClick={() => setShowSetBudgetModal(false)}>
          <div className="dark-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Set Total Budget</h3>
              <button type="button" className="close-btn" onClick={() => setShowSetBudgetModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-input-row">
              <input
                type="number"
                value={budgetInputVal}
                onChange={(e) => setBudgetInputVal(e.target.value)}
                className="modal-number-input"
              />
              <button 
                type="button" 
                className="modal-save-btn"
                onClick={() => {
                  setMaxBudget(parseFloat(budgetInputVal) || 0);
                  setShowSetBudgetModal(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD EXPENSE */}
      {showAddExpenseModal && (
        <div className="modal-backdrop" onClick={() => setShowAddExpenseModal(false)}>
          <div className="dark-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Expense</h3>
              <button type="button" className="close-btn" onClick={() => setShowAddExpenseModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddExpenseSubmit} className="expense-form">
              <div className="form-field">
                <label>Expense Title</label>
                <input
                  type="text"
                  placeholder="e.g. Dinner at Karim's"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label>Amount ({currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  >
                    <option value="Activity">Activity / Sights</option>
                    <option value="Food">Food & Dining</option>
                    <option value="Stay">Hotel & Stay</option>
                    <option value="Transport">Flight / Transit</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="modal-save-btn">
                Add to Budget
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: AI TRAVEL ASSISTANT CHAT */}
      {showAIModal && (
        <div className="modal-backdrop" onClick={() => setShowAIModal(false)}>
          <div className="ai-chat-modal-card dark-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div className="ai-header-title">
                <Sparkles size={18} className="ai-sparkle-purple" />
                <h3>Globetrotter AI Assistant</h3>
              </div>
              <button type="button" className="close-btn" onClick={() => setShowAIModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ai-messages-container custom-scroll">
              {aiChatLog.map((msg, idx) => (
                <div key={idx} className={`ai-message-row ${msg.sender}`}>
                  <div className="ai-bubble">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendAiPrompt} className="ai-input-bar">
              <input
                type="text"
                placeholder={`Ask anything about ${selectedDestination.shortName}...`}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <button type="submit" className="ai-send-btn">
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreateTripPage;
