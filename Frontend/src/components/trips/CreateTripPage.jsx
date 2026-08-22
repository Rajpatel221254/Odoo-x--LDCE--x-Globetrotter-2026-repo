import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance.js';
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
  Loader2,
  AlertTriangle,
  AlertCircle,
  Info,
  Coins,
  TrendingDown,
  CheckCheck,
  Send,
  Copy,
  MessageSquare
} from 'lucide-react';
import './style/CreateTripPage.css';

// Rich Curated Destination Database with Famous Places, Signature Restaurants & Luxury Hotels
const DESTINATIONS_DB = {
  'delhi': {
    name: 'New Delhi, Delhi, India',
    shortName: 'Delhi',
    lat: 28.6139,
    lng: 77.2090,
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'del-a1', name: 'India Gate & Kartavya Path', category: 'National Monument', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80', lat: 28.6129, lng: 77.2295, rating: 4.85, price: 0, cost: 'Free', description: 'Iconic 42m triumphal war memorial arch surrounded by lush lawns, boat fountains, and evening street lights.', icon: '🏛️', color: '#f05a36', type: 'place' },
      { id: 'del-a2', name: 'Red Fort (Lal Qila)', category: 'Mughal Heritage', image: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=400&q=80', lat: 28.6562, lng: 77.2410, rating: 4.9, price: 50, cost: '₹50 / person', description: 'Grand 17th-century Mughal red sandstone fortress housing royal palaces, Diwan-i-Khas, and sound-and-light shows.', icon: '🏰', color: '#ef4444', type: 'place' },
      { id: 'del-a3', name: 'Qutub Minar', category: 'UNESCO World Heritage', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&q=80', lat: 28.5245, lng: 77.1855, rating: 4.92, price: 40, cost: '₹40 / person', description: 'UNESCO World Heritage 73m minaret with intricate Indo-Islamic carvings and the ancient 1600-year rust-resistant iron pillar.', icon: '🗼', color: '#f59e0b', type: 'place' },
      { id: 'del-a4', name: 'Lotus Temple (Baháʼí)', category: 'Architectural Wonder', image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=400&q=80', lat: 28.5535, lng: 77.2588, rating: 4.8, price: 0, cost: 'Free', description: 'Architectural marvel crafted in 27 petal-shaped white marble petals with serene reflection ponds and meditation hall.', icon: '🪷', color: '#ec4899', type: 'place' },
      { id: 'del-a5', name: 'Humayun’s Tomb', category: 'Garden Mausoleum', image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=400&q=80', lat: 28.5933, lng: 77.2507, rating: 4.9, price: 40, cost: '₹40 / person', description: 'Magnificent Mughal garden mausoleum surrounded by lush flowing water channels that inspired the architecture of the Taj Mahal.', icon: '🕌', color: '#10b981', type: 'place' }
    ],
    restaurants: [
      { id: 'del-r1', name: 'Karim’s (Jama Masjid)', category: 'Historic Mughlai', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80', lat: 28.6508, lng: 77.2334, rating: 4.85, price: 600, cost: '₹600 / person', description: 'Historic 1913 royal kitchen celebrated for melt-in-mouth mutton korma, tandoori burra kebabs, and warm sheermaal.', icon: '🍽️', color: '#ef4444', type: 'restaurant' },
      { id: 'del-r2', name: 'Bukhara - ITC Maurya', category: 'Award-Winning Tandoori', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 28.5977, lng: 77.1736, rating: 4.95, price: 2500, cost: '₹2,500 / person', description: 'World-famous dining icon renowned for rustic clay oven cooking, Sikandari Raan, and 18-hour slow-simmered Dal Bukhara.', icon: '🍖', color: '#f59e0b', type: 'restaurant' },
      { id: 'del-r3', name: 'Indian Accent', category: 'Modern Progressive Dining', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', lat: 28.5910, lng: 77.2390, rating: 4.9, price: 3000, cost: '₹3,000 / person', description: 'India’s top-ranked restaurant presenting inventive modern gastronomy reimagining regional Indian classics.', icon: '🍷', color: '#8b5cf6', type: 'restaurant' },
      { id: 'del-r4', name: 'Saravana Bhavan (CP)', category: 'Authentic South Indian', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=400&q=80', lat: 28.6328, lng: 77.2195, rating: 4.75, price: 300, cost: '₹300 / person', description: 'Beloved Connaught Place spot famous for ghee roast paper dosas, sambar vadas, coconut chutneys, and filter coffee.', icon: '🥞', color: '#10b981', type: 'restaurant' }
    ],
    hotels: [
      { id: 'del-h1', name: 'The Imperial New Delhi', category: '5-Star Heritage Luxury', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 28.6247, lng: 77.2177, rating: 4.9, price: 18000, cost: '₹18,000 / night', description: 'Iconic 1930s colonial art-deco palace with high-ceiling suites, museum-quality art, palm courtyards, and spa.', icon: '🏨', color: '#3b82f6', type: 'hotel' },
      { id: 'del-h2', name: 'The Leela Palace New Delhi', category: 'Grand Palace Experience', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 28.5793, lng: 77.1895, rating: 4.95, price: 22000, cost: '₹22,000 / night', description: 'Royal architectural sanctuary in Chanakyapuri with rooftop temperature-controlled infinity pool and luxury dining.', icon: '🏰', color: '#a855f7', type: 'hotel' },
      { id: 'del-h3', name: 'Taj Palace New Delhi', category: 'Diplomatic Enclave Luxury', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80', lat: 28.5960, lng: 77.1700, rating: 4.85, price: 15000, cost: '₹15,000 / night', description: 'Sprawled across 6 acres of lush gardens with award-winning Orient Express dining, pool, and golf greens.', icon: '🛎️', color: '#06b6d4', type: 'hotel' }
    ]
  },
  'mumbai': {
    name: 'Mumbai, Maharashtra, India',
    shortName: 'Mumbai',
    lat: 18.9220,
    lng: 72.8347,
    coverImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'mum-a1', name: 'Gateway of India', category: 'Colonial Landmark', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80', lat: 18.9220, lng: 72.8347, rating: 4.85, price: 0, cost: 'Free', description: 'Iconic 26m arch monument overlooking the Arabian Sea built to commemorate the visit of King George V.', icon: '🏛️', color: '#f59e0b', type: 'place' },
      { id: 'mum-a2', name: 'Marine Drive & Queen’s Necklace', category: 'Scenic Promenade', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=400&q=80', lat: 18.9432, lng: 72.8230, rating: 4.9, price: 0, cost: 'Free', description: 'Sweeping 3.6km C-shaped coastal boulevard sparkling with evening streetlights resembling a string of pearls.', icon: '🌊', color: '#3b82f6', type: 'place' },
      { id: 'mum-a3', name: 'Bandra-Worli Sea Link', category: 'Cable-Stayed Bridge', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&q=80', lat: 19.0330, lng: 72.8180, rating: 4.85, price: 85, cost: '₹85 toll', description: 'Engineering masterpiece 5.6km suspension bridge connecting Bandra to South Mumbai with skyline views.', icon: '🌉', color: '#8b5cf6', type: 'place' },
      { id: 'mum-a4', name: 'Chhatrapati Shivaji Maharaj Terminus (CST)', category: 'UNESCO Victorian Heritage', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&q=80', lat: 18.9400, lng: 72.8354, rating: 4.88, price: 0, cost: 'Free', description: 'UNESCO World Heritage Victorian Gothic revival architectural marvel illuminated brilliantly every evening.', icon: '🏰', color: '#ec4899', type: 'place' },
      { id: 'mum-a5', name: 'Elephanta Caves', category: 'Ancient Island Caves', image: 'https://images.unsplash.com/photo-1609137144822-263a2336338b?auto=format&fit=crop&w=400&q=80', lat: 18.9633, lng: 72.9315, rating: 4.8, price: 40, cost: '₹40 / person', description: 'Rock-cut cave temples on Elephanta Island dedicated to Lord Shiva featuring the colossal 20ft Trimurti sculpture.', icon: '🗿', color: '#10b981', type: 'place' }
    ],
    restaurants: [
      { id: 'mum-r1', name: 'Britannia & Co. Restaurant', category: 'Parsi Heritage & Berry Pulao', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80', lat: 18.9372, lng: 72.8392, rating: 4.8, price: 600, cost: '₹600 / person', description: 'Century-old Ballard Estate institution world-famous for its aromatic Iranian berry pulao and caramel custard.', icon: '🍛', color: '#f59e0b', type: 'restaurant' },
      { id: 'mum-r2', name: 'The Bombay Canteen', category: 'Modern Regional Indian', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', lat: 19.0068, lng: 72.8306, rating: 4.9, price: 1800, cost: '₹1,800 / person', description: 'Vibrant Lower Parel hotspot celebrating Indian regional cuisines through innovative shared plates & cocktails.', icon: '🥘', color: '#a855f7', type: 'restaurant' },
      { id: 'mum-r3', name: 'Trishna (Fort)', category: 'Famous Butter Pepper Garlic Crab', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 18.9288, lng: 72.8322, rating: 4.85, price: 1500, cost: '₹1,500 / person', description: 'Legendary seafood institution famous worldwide for butter pepper garlic crab, neer dosa, and prawns koliwada.', icon: '🦀', color: '#ef4444', type: 'restaurant' },
      { id: 'mum-r4', name: 'Leopold Cafe & Bar', category: 'Historic Colaba Bistro', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80', lat: 18.9231, lng: 72.8327, rating: 4.75, price: 800, cost: '₹800 / person', description: 'Historic 1871 café on Colaba Causeway known for chilled draught beer, chicken chili, and bustling traveller vibe.', icon: '🍺', color: '#10b981', type: 'restaurant' }
    ],
    hotels: [
      { id: 'mum-h1', name: 'The Taj Mahal Palace (Colaba)', category: 'Iconic Seafront Heritage', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 18.9217, lng: 72.8331, rating: 4.98, price: 24000, cost: '₹24,000 / night', description: 'Legendary 1903 seafront palace hotel overlooking the Gateway of India with royal suites and 10 restaurants.', icon: '👑', color: '#3b82f6', type: 'hotel' },
      { id: 'mum-h2', name: 'The Oberoi Mumbai (Marine Drive)', category: '5-Star Nariman Point', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 18.9270, lng: 72.8206, rating: 4.92, price: 20000, cost: '₹20,000 / night', description: 'Ultra-luxurious Marine Drive property with floor-to-ceiling Arabian Sea ocean views and Michelin-starred dining.', icon: '🏨', color: '#8b5cf6', type: 'hotel' },
      { id: 'mum-h3', name: 'Trident Hotel Bandra Kurla', category: 'Modern 5-Star Business Luxury', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80', lat: 19.0667, lng: 72.8686, rating: 4.85, price: 14000, cost: '₹14,000 / night', description: 'Contemporary luxury in the heart of BKC with chic infinity swimming pool, award-winning spa, and dining.', icon: '🏙️', color: '#06b6d4', type: 'hotel' }
    ]
  },
  'jaipur': {
    name: 'Jaipur, Rajasthan, India',
    shortName: 'Jaipur',
    lat: 26.9124,
    lng: 75.7873,
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'jai-a1', name: 'Hawa Mahal (Palace of Winds)', category: 'Rajput Architecture', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80', lat: 26.9239, lng: 75.8267, rating: 4.92, price: 50, cost: '₹50 / person', description: 'Iconic 5-story pink honeycomb facade featuring 953 intricately carved jharokha windows allowing royal women to watch street festivals.', icon: '🏰', color: '#ec4899', type: 'place' },
      { id: 'jai-a2', name: 'Amber Fort & Palace', category: 'UNESCO Hill Fort', image: 'https://images.unsplash.com/photo-1609137144822-263a2336338b?auto=format&fit=crop&w=400&q=80', lat: 26.9855, lng: 75.8513, rating: 4.95, price: 100, cost: '₹100 / person', description: 'Majestic hilltop sandstone fortress over Maota Lake housing the opulent Sheesh Mahal (Mirror Palace) and royal courtyards.', icon: '👑', color: '#f59e0b', type: 'place' },
      { id: 'jai-a3', name: 'City Palace & Museum', category: 'Royal Residence', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80', lat: 26.9258, lng: 75.8236, rating: 4.88, price: 200, cost: '₹200 / person', description: 'Sprawling palace complex blending Mughal and Rajput architecture, Chandra Mahal, Peacock Courtyard, and royal armoury.', icon: '🏛️', color: '#3b82f6', type: 'place' },
      { id: 'jai-a4', name: 'Jal Mahal (Water Palace)', category: 'Palace in Lake', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80', lat: 26.9535, lng: 75.8462, rating: 4.8, price: 0, cost: 'Free (Viewpoint)', description: 'Stunning 18th-century yellow sandstone palace seemingly floating in the middle of Man Sagar Lake against Aravalli hills.', icon: '🌊', color: '#10b981', type: 'place' },
      { id: 'jai-a5', name: 'Nahargarh Fort & Sunset Point', category: 'Panoramic Hilltop View', image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=400&q=80', lat: 26.9373, lng: 75.8156, rating: 4.9, price: 50, cost: '₹50 / person', description: 'Perched high on the Aravalli ridge offering breathtaking sunset vistas across the entire illuminated Pink City skyline.', icon: '🌄', color: '#8b5cf6', type: 'place' }
    ],
    restaurants: [
      { id: 'jai-r1', name: 'Chokhi Dhani Ethnic Resort', category: 'Traditional Rajasthani Thali & Folk Dance', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80', lat: 26.7663, lng: 75.8362, rating: 4.9, price: 1100, cost: '₹1,100 / person', description: 'Immersive Rajasthani village carnival with unlimited royal Dal Baati Churma feasts, camel rides, puppetry, and fire dancers.', icon: '🍲', color: '#f59e0b', type: 'restaurant' },
      { id: 'jai-r2', name: '1135 AD (Amber Fort)', category: 'Royal Fine Dining & Palace Ambience', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 26.9855, lng: 75.8513, rating: 4.95, price: 2500, cost: '₹2,500 / person', description: 'Dine inside the historic Amber Fort under gold-leaf ceilings, silver cutlery, and authentic royal recipes like Laal Maas.', icon: '🍷', color: '#ef4444', type: 'restaurant' },
      { id: 'jai-r3', name: 'Rawat Mishthan Bhandar', category: 'Famous Pyaaz Kachori & Sweets', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80', lat: 26.9208, lng: 75.7978, rating: 4.85, price: 250, cost: '₹250 / person', description: 'World-renowned stop for steaming crispy onion kachoris (Pyaaz Kachori), mawa kachori, jalebis, and lassi.', icon: '🥟', color: '#10b981', type: 'restaurant' }
    ],
    hotels: [
      { id: 'jai-h1', name: 'Rambagh Palace (Taj Luxury)', category: 'The Jewel of Jaipur Palace', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 26.8978, lng: 75.8087, rating: 4.98, price: 45000, cost: '₹45,000 / night', description: 'Former residence of the Maharaja of Jaipur set in 47 acres of tranquil gardens with opulent marble suites and peacocks.', icon: '👑', color: '#f59e0b', type: 'hotel' },
      { id: 'jai-h2', name: 'The Oberoi Rajvilas', category: '5-Star Luxury Resort & Spa', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 26.8790, lng: 75.8850, rating: 4.95, price: 38000, cost: '₹38,000 / night', description: 'Royal palace sanctuary built around an ancient Shiva temple with luxury villas, private pools, and ayurvedic spa.', icon: '🏰', color: '#8b5cf6', type: 'hotel' },
      { id: 'jai-h3', name: 'Fairmont Jaipur (Kukas)', category: 'Grand Mughal & Rajput Luxury', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80', lat: 27.0370, lng: 75.8920, rating: 4.88, price: 16000, cost: '₹16,000 / night', description: 'Modern palace nestled in the Aravalli hills with custom timber furnishings, Turkish baths, and rooftop dining.', icon: '🏨', color: '#3b82f6', type: 'hotel' }
    ]
  },
  'agra': {
    name: 'Agra, Uttar Pradesh, India',
    shortName: 'Agra',
    lat: 27.1767,
    lng: 78.0081,
    coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'agr-a1', name: 'Taj Mahal (Wonder of the World)', category: 'UNESCO World Heritage Monument', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&q=80', lat: 27.1751, lng: 78.0421, rating: 4.98, price: 50, cost: '₹50 / person', description: 'The pinnacle of Mughal ivory-white marble architecture built by Emperor Shah Jahan as a timeless testament of love.', icon: '🕌', color: '#f05a36', type: 'place' },
      { id: 'agr-a2', name: 'Agra Fort (Red Sandstone Palace)', category: 'UNESCO Imperial Fortress', image: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=400&q=80', lat: 27.1795, lng: 78.0211, rating: 4.9, price: 50, cost: '₹50 / person', description: 'Colossal 16th-century Mughal walled fortress holding the Jahangiri Mahal, Khas Mahal, and direct Taj views from Musamman Burj.', icon: '🏰', color: '#ef4444', type: 'place' },
      { id: 'agr-a3', name: 'Mehtab Bagh (Moonlight Garden)', category: 'Riverside Sunset Vantage', image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=400&q=80', lat: 27.1800, lng: 78.0425, rating: 4.82, price: 25, cost: '₹25 / person', description: 'Charbagh garden complex situated across the Yamuna River providing the most enchanting sunset reflections of the Taj Mahal.', icon: '🌳', color: '#10b981', type: 'place' },
      { id: 'agr-a4', name: 'Fatehpur Sikri', category: 'Ghost City of Akbar', image: 'https://images.unsplash.com/photo-1609137144822-263a2336338b?auto=format&fit=crop&w=400&q=80', lat: 27.0945, lng: 77.6679, rating: 4.88, price: 50, cost: '₹50 / person', description: 'Preserved 16th-century Mughal capital city founded by Emperor Akbar featuring Buland Darwaza and Salim Chishti Dargah.', icon: '🏛️', color: '#f59e0b', type: 'place' }
    ],
    restaurants: [
      { id: 'agr-r1', name: 'Pinch of Spice', category: 'Renowned North Indian & Mughlai', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80', lat: 27.1578, lng: 78.0165, rating: 4.85, price: 800, cost: '₹800 / person', description: 'Popular upscale dining spot loved for its rich butter chicken, murg boti tikka, dal tadka, and garlic naan.', icon: '🍗', color: '#ef4444', type: 'restaurant' },
      { id: 'agr-r2', name: 'Peshawri - ITC Mughal', category: 'Authentic Northwest Frontier Dining', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 27.1610, lng: 78.0410, rating: 4.95, price: 2400, cost: '₹2,400 / person', description: 'Sister restaurant to Delhi’s Bukhara serving melt-in-mouth kebabs, tandoori jhinga, and signature slow-cooked dal.', icon: '🍖', color: '#f59e0b', type: 'restaurant' },
      { id: 'agr-r3', name: 'Panchi Petha Store (Sadar Bazar)', category: 'Famous Agra Petha & Sweets', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80', lat: 27.1605, lng: 78.0090, rating: 4.8, price: 150, cost: '₹150 / box', description: 'The original maker of Agra’s iconic sweet delicacies: Kesar Angoori Petha, Chocolate Petha, and Dalmoth namkeen.', icon: '🍬', color: '#ec4899', type: 'restaurant' }
    ],
    hotels: [
      { id: 'agr-h1', name: 'The Oberoi Amarvilas (Direct Taj View)', category: 'Ultra-Luxury 5-Star Resort', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 27.1695, lng: 78.0470, rating: 4.99, price: 42000, cost: '₹42,000 / night', description: 'Every single room & suite offers uninterrupted private views of the Taj Mahal just 600m away with terraced fountains.', icon: '👑', color: '#f05a36', type: 'hotel' },
      { id: 'agr-h2', name: 'ITC Mughal, A Luxury Collection Hotel', category: '5-Star Mughal Garden Resort', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 27.1610, lng: 78.0410, rating: 4.9, price: 14000, cost: '₹14,000 / night', description: 'Sprawled across 35 acres of lush Mughal gardens with the prestigious Kaya Kalp Royal Spa and multiple pools.', icon: '🏰', color: '#8b5cf6', type: 'hotel' },
      { id: 'agr-h3', name: 'Taj Hotel & Convention Centre Agra', category: 'Contemporary Luxury with Rooftop Pool', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80', lat: 27.1600, lng: 78.0530, rating: 4.85, price: 11000, cost: '₹11,000 / night', description: 'Chic modern luxury with a dramatic rooftop infinity swimming pool overlooking the Taj Mahal skyline.', icon: '🏨', color: '#06b6d4', type: 'hotel' }
    ]
  },
  'varanasi': {
    name: 'Varanasi (Kashi), Uttar Pradesh, India',
    shortName: 'Varanasi',
    lat: 25.3176,
    lng: 82.9739,
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'var-a1', name: 'Dashashwamedh Ghat & Evening Ganga Aarti', category: 'Sacred River Ghat', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=400&q=80', lat: 25.3076, lng: 83.0104, rating: 4.98, price: 0, cost: 'Free (Boat optional)', description: 'The most sacred and vibrant ghat in Varanasi, hosting the mesmerizing synchronized multi-tiered brass lamp Ganga Aarti every evening.', icon: '🪔', color: '#f59e0b', type: 'place' },
      { id: 'var-a2', name: 'Kashi Vishwanath Temple (Golden Temple)', category: 'Spiritual Sanctuary', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80', lat: 25.3109, lng: 83.0107, rating: 4.95, price: 0, cost: 'Free', description: 'One of the twelve revered Jyotirlingas dedicated to Lord Shiva, featuring iconic gold spires and the newly built grand corridor.', icon: '🕉️', color: '#ef4444', type: 'place' },
      { id: 'var-a3', name: 'Assi Ghat & Sunrise Boat Ride', category: 'Cultural Ghat & Yoga', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80', lat: 25.2900, lng: 83.0064, rating: 4.88, price: 300, cost: '₹300 boat / person', description: 'Southernmost ghat famous for morning Subah-e-Banaras Vedic chants, riverside yoga, and traditional wooden boat rides at dawn.', icon: '🛶', color: '#3b82f6', type: 'place' },
      { id: 'var-a4', name: 'Sarnath (Deer Park & Dhamek Stupa)', category: 'UNESCO Buddhist Heritage', image: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=400&q=80', lat: 25.3811, lng: 83.0214, rating: 4.9, price: 25, cost: '₹25 / person', description: 'Where Gautama Buddha delivered his first sermon after enlightenment; home to the ancient Dhamek Stupa and Ashoka Lion Capital.', icon: '☸️', color: '#10b981', type: 'place' }
    ],
    restaurants: [
      { id: 'var-r1', name: 'Kashi Chaat Bhandar', category: 'Legendary Banarasi Chaat', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80', lat: 25.3088, lng: 83.0076, rating: 4.9, price: 200, cost: '₹200 / person', description: 'Varanasi’s most celebrated street food landmark famous for piping hot Tamatar Chaat, Palak Chaat, and Dahi Puri.', icon: '🍲', color: '#f59e0b', type: 'restaurant' },
      { id: 'var-r2', name: 'Blue Lassi Shop (Manikarnika)', category: 'Historic 90-Flavor Lassi', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80', lat: 25.3115, lng: 83.0135, rating: 4.85, price: 120, cost: '₹120 / person', description: 'Famous 1925 hand-churned lassi haven served in earthen clay kulhads topped with fresh malai, pomegranate, and dry fruits.', icon: '🥛', color: '#3b82f6', type: 'restaurant' },
      { id: 'var-r3', name: 'Baati Chokha Restaurant', category: 'Traditional Purvanchal Cuisine', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', lat: 25.3340, lng: 82.9860, rating: 4.8, price: 450, cost: '₹450 / person', description: 'Clay-oven baked wheat balls (Litti Baati) stuffed with sattu, served with roasted brinjal chokha, desi ghee, and kheer.', icon: '🌾', color: '#10b981', type: 'restaurant' }
    ],
    hotels: [
      { id: 'var-h1', name: 'BrijRama Palace, Varanasi (Heritage on Ghat)', category: '18th-Century Palace on the Ganges', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 25.3050, lng: 83.0100, rating: 4.98, price: 28000, cost: '₹28,000 / night', description: 'Accessible only by boat, this 210-year-old Maratha palace overlooks the Ganges with traditional live classical music and luxury suites.', icon: '👑', color: '#f59e0b', type: 'hotel' },
      { id: 'var-h2', name: 'Taj Ganges Varanasi (Nadesar Palace)', category: '5-Star Luxury Garden Estate', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 25.3370, lng: 82.9840, rating: 4.92, price: 16000, cost: '₹16,000 / night', description: 'Spread across 40 verdant acres in the Cantonment area with tranquil mango orchards, outdoor pool, and royal suites.', icon: '🏨', color: '#3b82f6', type: 'hotel' },
      { id: 'var-h3', name: 'Suryauday Haveli by AMhotel Kollection', category: 'Boutique Haveli on Shivala Ghat', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80', lat: 25.2970, lng: 83.0080, rating: 4.85, price: 12000, cost: '₹12,000 / night', description: 'Charming 20th-century riverside mansion haveli featuring a rooftop yoga pavilion with sunrise views over the holy river.', icon: '🌅', color: '#06b6d4', type: 'hotel' }
    ]
  },
  'bangalore': {
    name: 'Bengaluru (Bangalore), Karnataka, India',
    shortName: 'Bangalore',
    lat: 12.9716,
    lng: 77.5946,
    coverImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'blr-a1', name: 'Lalbagh Botanical Garden & Glass House', category: 'Botanical Heritage', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80', lat: 12.9507, lng: 77.5848, rating: 4.88, price: 30, cost: '₹30 / person', description: '240-acre botanical paradise founded by Hyder Ali featuring centuries-old trees, lotus lake, and the London Crystal Palace Glass House.', icon: '🌺', color: '#10b981', type: 'place' },
      { id: 'blr-a2', name: 'Bangalore Palace', category: 'Tudor Architectural Palace', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80', lat: 12.9988, lng: 77.5921, rating: 4.82, price: 230, cost: '₹230 / person', description: '19th-century royal palace inspired by England’s Windsor Castle with fortified towers, stained glass, and elephant yards.', icon: '🏰', color: '#f59e0b', type: 'place' },
      { id: 'blr-a3', name: 'Cubbon Park & Vidhana Soudha', category: 'City Central Park & Parliament', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', lat: 12.9760, lng: 77.5929, rating: 4.85, price: 0, cost: 'Free', description: 'The 300-acre green lung of the Garden City surrounded by the grand neo-Dravidian Vidhana Soudha state legislature.', icon: '🌳', color: '#3b82f6', type: 'place' }
    ],
    restaurants: [
      { id: 'blr-r1', name: 'Vidyarthi Bhavan (Gandhi Bazaar)', category: 'Historic 1943 Crispy Masala Dosa', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=400&q=80', lat: 12.9442, lng: 77.5709, rating: 4.92, price: 150, cost: '₹150 / person', description: 'Legendary Basavanagudi heritage eatery revered for its thick golden crispy butter masala dosas and hot filter kaapi.', icon: '🥞', color: '#f59e0b', type: 'restaurant' },
      { id: 'blr-r2', name: 'Toit Brewpub (Indiranagar)', category: 'Craft Microbrewery & Sourdough Pizza', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80', lat: 12.9790, lng: 77.6408, rating: 4.9, price: 1200, cost: '₹1,200 / person', description: 'Bangalore’s pioneering craft beer institution serving signature Basmati Blonde, Tin Man, wood-fired pizzas, and steaks.', icon: '🍺', color: '#ef4444', type: 'restaurant' },
      { id: 'blr-r3', name: 'Mavalli Tiffin Room (MTR Lalbagh)', category: 'Iconic 1924 South Indian Institution', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80', lat: 12.9555, lng: 77.5862, rating: 4.88, price: 250, cost: '₹250 / person', description: 'Inventor of Rava Idli, serving authentic pure-ghee breakfast platters, bisibelebath, and chandrahara sweet.', icon: '☕', color: '#10b981', type: 'restaurant' }
    ],
    hotels: [
      { id: 'blr-h1', name: 'The Leela Palace Bengaluru', category: '5-Star Art-Deco Royal Palace', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 12.9606, lng: 77.6484, rating: 4.96, price: 22000, cost: '₹22,000 / night', description: 'Vijayanagara architectural palace in 7 acres of gardens with cascading waterfalls, luxury spa, and Jamavar dining.', icon: '👑', color: '#8b5cf6', type: 'hotel' },
      { id: 'blr-h2', name: 'Taj West End, Bengaluru', category: '1887 Heritage Sanctuary', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 12.9866, lng: 77.5825, rating: 4.9, price: 18000, cost: '₹18,000 / night', description: 'Bangalore’s oldest luxury hotel set in 20 acres of flora featuring the famous Blue Ginger Vietnamese restaurant.', icon: '🌳', color: '#10b981', type: 'hotel' }
    ]
  },
  'goa': {
    name: 'Goa, India',
    shortName: 'Goa',
    lat: 15.2993,
    lng: 74.1240,
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'goa-a1', name: 'Baga Beach Watersports', category: 'Beach & Coastal Watersports', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80', lat: 15.5553, lng: 73.7517, rating: 4.8, price: 500, cost: '₹500 / person', description: 'Thrilling parasailing, jet-skiing, and banana boat rides on North Goa’s most famous golden sandy coast.', icon: '🏖️', color: '#06b6d4', type: 'place' },
      { id: 'goa-a2', name: 'Aguada Fort & Lighthouse', category: 'Historic Portuguese Fort', image: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=400&q=80', lat: 15.4920, lng: 73.7737, rating: 4.85, price: 50, cost: '₹50 / person', description: '17th-century Portuguese fortress and 4-story lighthouse with sweeping views where Mandovi river meets Arabian Sea.', icon: '🏰', color: '#f59e0b', type: 'place' },
      { id: 'goa-a3', name: 'Basilica of Bom Jesus', category: 'UNESCO World Heritage Church', image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=400&q=80', lat: 15.5008, lng: 73.9116, rating: 4.9, price: 0, cost: 'Free', description: 'Historic 1605 baroque church holding the sacred mortal remains of St. Francis Xavier in Old Goa.', icon: '⛪', color: '#8b5cf6', type: 'place' },
      { id: 'goa-a4', name: 'Dudhsagar Waterfalls Trek', category: 'Scenic 4-Tier Waterfall', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', lat: 15.3144, lng: 74.3144, rating: 4.92, price: 500, cost: '₹500 jeep / person', description: 'Spectacular 310m milky 4-tier waterfall cascading inside Bhagwan Mahaveer Sanctuary with jungle jeep safaris.', icon: '🌊', color: '#10b981', type: 'place' }
    ],
    restaurants: [
      { id: 'goa-r1', name: 'Fisherman’s Wharf', category: 'Riverside Fresh Goan Seafood', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 15.1550, lng: 73.9450, rating: 4.85, price: 1100, cost: '₹1,100 / person', description: 'Riverside setting on the Sal River serving butter garlic crab, prawn curry rice, and live music.', icon: '🦐', color: '#3b82f6', type: 'restaurant' },
      { id: 'goa-r2', name: 'Gunpowder (Assagao)', category: 'Coastal South Indian & Cocktails', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', lat: 15.5900, lng: 73.7720, rating: 4.9, price: 900, cost: '₹900 / person', description: 'Boutique garden cafe in a Portuguese villa serving Malabar mutton curry, appams, and cocktails.', icon: '🥥', color: '#10b981', type: 'restaurant' },
      { id: 'goa-r3', name: 'Thalassa Greek Taverna (Siolim)', category: 'Cliffside Sunset & Mediterranean', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80', lat: 15.6200, lng: 73.7600, rating: 4.88, price: 1500, cost: '₹1,500 / person', description: 'Breathtaking cliffside sunset views over Chapora River with authentic Greek souvlaki, cocktails, and fire dance shows.', icon: '🌅', color: '#ef4444', type: 'restaurant' }
    ],
    hotels: [
      { id: 'goa-h1', name: 'Taj Exotica Resort & Spa (Benaulim)', category: '5-Star Beach Resort', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 15.2470, lng: 73.9180, rating: 4.95, price: 22000, cost: '₹22,000 / night', description: 'Mediterranean-style 5-star resort nestled across 56 acres of lush gardens along Benaulim Beach.', icon: '🌴', color: '#8b5cf6', type: 'hotel' },
      { id: 'goa-h2', name: 'W Goa (Vagator Beach)', category: 'Luxury Beachfront Resort', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 15.6020, lng: 73.7380, rating: 4.9, price: 26000, cost: '₹26,000 / night', description: 'High-energy luxury beach resort with dramatic cliff views, Rock Pool, and modern villa suites.', icon: '✨', color: '#ec4899', type: 'hotel' }
    ]
  },
  'ahmedabad': {
    name: 'Ahmedabad, Gujarat, India',
    shortName: 'Ahmedabad',
    lat: 23.0225,
    lng: 72.5714,
    coverImage: 'https://images.unsplash.com/photo-1599831104321-4f18b52f9b8c?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'ahm-a1', name: 'Sabarmati Riverfront', category: 'Scenic Promenade', image: 'https://images.unsplash.com/photo-1599831104321-4f18b52f9b8c?auto=format&fit=crop&w=400&q=80', lat: 23.0338, lng: 72.5704, rating: 4.8, price: 0, cost: 'Free', description: 'Picturesque two-level riverfront promenade ideal for scenic strolls, sunset cycling, and watersports.', icon: '🌊', color: '#3b82f6', type: 'place' },
      { id: 'ahm-a2', name: 'Atal Pedestrian Bridge', category: 'Architectural Landmark', image: 'https://images.unsplash.com/photo-1662991048705-59b48c66e2c3?auto=format&fit=crop&w=400&q=80', lat: 23.0261, lng: 72.5746, rating: 4.9, price: 30, cost: '₹30 / person', description: 'Spectacular flower-kite inspired footbridge over the Sabarmati river with vivid illuminated glass railings.', icon: '🌉', color: '#a855f7', type: 'place' },
      { id: 'ahm-a3', name: 'Adalaj Stepwell (Vav)', category: 'Heritage Wonder', image: 'https://images.unsplash.com/photo-1609137144822-263a2336338b?auto=format&fit=crop&w=400&q=80', lat: 23.1667, lng: 72.5800, rating: 4.95, price: 0, cost: 'Free', description: 'Intricately carved 5-story 15th-century subterranean marvel with stunning Solanki architectural pillars.', icon: '🏛️', color: '#f59e0b', type: 'place' },
      { id: 'ahm-a4', name: 'Sidi Saiyyed Mosque (Jali)', category: 'Historical Architecture', image: 'https://images.unsplash.com/photo-1596405527969-e74f1b0a7019?auto=format&fit=crop&w=400&q=80', lat: 23.0270, lng: 72.5813, rating: 4.85, price: 0, cost: 'Free', description: '16th-century heritage masterpiece celebrated worldwide for its ornate pierced stone window latticework Tree of Life.', icon: '🕌', color: '#10b981', type: 'place' },
      { id: 'ahm-a5', name: 'Gandhi Ashram (Sabarmati)', category: 'Historic Ashram & Museum', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80', lat: 23.0605, lng: 72.5801, rating: 4.9, price: 0, cost: 'Free', description: 'Historic home of Mahatma Gandhi preserving the salt march legacy, spinning charkha artifacts, and tranquil river grounds.', icon: '🕊️', color: '#f97316', type: 'place' }
    ],
    restaurants: [
      { id: 'ahm-r1', name: 'Agashiye - The House of MG', category: 'Authentic Gujarati Terrace Thali', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80', lat: 23.0267, lng: 72.5836, rating: 4.9, price: 950, cost: '₹950 / person', description: 'Rooftop dining serving unlimited royal Gujarati Thalis served on bronze plates accompanied by live folk sitar music.', icon: '🍛', color: '#f59e0b', type: 'restaurant' },
      { id: 'ahm-r2', name: 'Manek Chowk Night Food Market', category: 'Famous Street Food & Kulfi', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80', lat: 23.0244, lng: 72.5888, rating: 4.8, price: 300, cost: '₹300 / person', description: 'Bustling historical square turning at night into an open-air food paradise for chocolate cheese sandwiches and kulfi.', icon: '🥪', color: '#ef4444', type: 'restaurant' },
      { id: 'ahm-r3', name: 'Gordhan Thal (S.G. Highway)', category: 'Royal Kathiyawadi & Gujarati', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 23.0360, lng: 72.5120, rating: 4.8, price: 550, cost: '₹550 / person', description: 'Warm Gujarati hospitality offering over 25 traditional delicacies including dhokla, kadhi, rotla, and rabdi.', icon: '🍲', color: '#ec4899', type: 'restaurant' }
    ],
    hotels: [
      { id: 'ahm-h1', name: 'The House of MG (Heritage)', category: 'Heritage Boutique Hotel', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 23.0267, lng: 72.5836, rating: 4.9, price: 7500, cost: '₹7,500 / night', description: 'Lovingly restored 1924 textile mansion with indoor courtyard pool, artisan shops, and heritage courtyards.', icon: '🏛️', color: '#3b82f6', type: 'hotel' },
      { id: 'ahm-h2', name: 'ITC Narmada Luxury Hotel', category: '5-Star Grand Luxury', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 23.0310, lng: 72.5312, rating: 4.92, price: 12000, cost: '₹12,000 / night', description: '5-star urban sanctuary on Judges Bungalow Road inspired by Gujarat’s grand stepwells with world-class dining.', icon: '🏨', color: '#8b5cf6', type: 'hotel' }
    ]
  },
  'paris': {
    name: 'Paris, France',
    shortName: 'Paris',
    lat: 48.8566,
    lng: 2.3522,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'par-a1', name: 'Tour Eiffel', category: 'Iconic Monument', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=400&q=80', lat: 48.8584, lng: 2.2945, rating: 4.9, price: 2500, cost: '₹2,500 (€28) / person', description: 'World-famous 330m iron lattice tower offering unforgettable panoramic views across the Parisian skyline.', icon: '🗼', color: '#8b5cf6', type: 'place' },
      { id: 'par-a2', name: 'Louvre Museum', category: 'Art & Culture', image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=400&q=80', lat: 48.8606, lng: 2.3376, rating: 4.95, price: 1600, cost: '₹1,600 (€17) / person', description: 'The world’s largest art museum housing over 35,000 masterpieces including the Mona Lisa and Venus de Milo.', icon: '🎨', color: '#ec4899', type: 'place' },
      { id: 'par-a3', name: 'Arc de Triomphe & Champs-Élysées', category: 'Historic Monument', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80', lat: 48.8738, lng: 2.2950, rating: 4.8, price: 1200, cost: '₹1,200 (€13) / person', description: 'Triumphal arch at the western end of the Champs-Élysées honoring those who fought and died for France.', icon: '🏛️', color: '#a855f7', type: 'place' },
      { id: 'par-a4', name: 'Cathédrale Notre-Dame', category: 'Gothic Masterpiece', image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=400&q=80', lat: 48.8530, lng: 2.3499, rating: 4.7, price: 0, cost: 'Free', description: 'Medieval Catholic cathedral on the Île de la Cité celebrated for its French Gothic architecture and rose windows.', icon: '⛪', color: '#f97316', type: 'place' }
    ],
    restaurants: [
      { id: 'par-r1', name: 'Le Jules Verne (Tour Eiffel)', category: 'Haute Cuisine & Views', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 48.8584, lng: 2.2945, rating: 4.9, price: 17000, cost: '₹17,000 (€190) / person', description: 'Michelin-starred dining on the second floor of the Eiffel Tower offering French haute cuisine.', icon: '🍷', color: '#ef4444', type: 'restaurant' },
      { id: 'par-r2', name: 'Carette Trocadéro', category: 'Famous Parisian Cafe & Pastries', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80', lat: 48.8631, lng: 2.2872, rating: 4.85, price: 2700, cost: '₹2,700 (€30) / person', description: 'Classic Parisian salon de thé famous for thick hot chocolate, fresh whipped chantilly, and warm macarons.', icon: '☕', color: '#ec4899', type: 'restaurant' },
      { id: 'par-r3', name: 'Septime Paris', category: 'Modern Neo-Bistro', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', lat: 48.8536, lng: 2.3807, rating: 4.92, price: 7800, cost: '₹7,800 (€85) / person', description: 'Acclaimed modern neo-bistro in the 11th arrondissement focusing on natural wines and seasonal ingredients.', icon: '🍽️', color: '#10b981', type: 'restaurant' }
    ],
    hotels: [
      { id: 'par-h1', name: 'The Ritz Paris (Place Vendôme)', category: 'Palace Luxury Hotel', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 48.8682, lng: 2.3292, rating: 4.98, price: 145000, cost: '₹145,000 / night', description: 'Legendary palace hotel on Place Vendôme with lavish Belle Époque suites and Bar Hemingway.', icon: '👑', color: '#8b5cf6', type: 'hotel' },
      { id: 'par-h2', name: 'Four Seasons Hotel George V', category: '5-Star Palace Stay', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 48.8690, lng: 2.3015, rating: 4.95, price: 165000, cost: '₹165,000 / night', description: 'Art-deco landmark just off the Champs-Elysées with oversized suites and three Michelin-starred restaurants.', icon: '🏨', color: '#3b82f6', type: 'hotel' }
    ]
  },
  'tokyo': {
    name: 'Tokyo, Japan',
    shortName: 'Tokyo',
    lat: 35.6762,
    lng: 139.6503,
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'tok-a1', name: 'Shibuya Crossing & Hachiko Statue', category: 'Urban Landmark', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80', lat: 35.6595, lng: 139.7004, rating: 4.92, price: 0, cost: 'Free', description: 'The busiest pedestrian intersection in the world, surrounded by giant neon billboards, cafes, and Hachiko monument.', icon: '🚦', color: '#3b82f6', type: 'place' },
      { id: 'tok-a2', name: 'Senso-ji Temple (Asakusa)', category: 'Ancient Buddhist Temple', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=400&q=80', lat: 35.7148, lng: 139.7967, rating: 4.95, price: 0, cost: 'Free', description: 'Tokyo’s oldest temple founded in 645 AD featuring the massive Kaminarimon lantern and Nakamise shopping street.', icon: '⛩️', color: '#ef4444', type: 'place' },
      { id: 'tok-a3', name: 'Tokyo Skytree Tower', category: 'Observation Deck', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80', lat: 35.7100, lng: 139.8107, rating: 4.88, price: 1800, cost: '₹1,800 (¥3,100) / person', description: '634m broadcasting tower offering unmatched 360° panoramas extending all the way to Mount Fuji on clear days.', icon: '🗼', color: '#8b5cf6', type: 'place' },
      { id: 'tok-a4', name: 'Meiji Jingu Shrine & Harajuku', category: 'Shinto Shrine & Forest', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', lat: 35.6764, lng: 139.6993, rating: 4.9, price: 0, cost: 'Free', description: 'Tranquil 170-acre evergreen forest shrine honoring Emperor Meiji, right next to trendy Takeshita Street.', icon: '🌲', color: '#10b981', type: 'place' }
    ],
    restaurants: [
      { id: 'tok-r1', name: 'Ichiran Ramen Shibuya', category: 'Famous Tonkotsu Ramen Booths', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80', lat: 35.6620, lng: 139.6990, rating: 4.95, price: 950, cost: '₹950 (¥1,600) / person', description: 'World-famous solo dining flavor-concentration booths serving rich pork-bone tonkotsu ramen with custom noodles.', icon: '🍜', color: '#ef4444', type: 'restaurant' },
      { id: 'tok-r2', name: 'Tsukiji Outer Market Food Tour', category: 'Fresh Seafood & Wagyu Street Food', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 35.6655, lng: 139.7708, rating: 4.9, price: 1800, cost: '₹1,800 (¥3,000) / person', description: 'Bustling alleyways lined with sushi stalls, flame-torched wagyu skewers, tamagoyaki omelettes, and fresh sea urchin.', icon: '🍣', color: '#f59e0b', type: 'restaurant' },
      { id: 'tok-r3', name: 'Gonpachi Nishiazabu (Kill Bill Izakaya)', category: 'Iconic Izakaya & Yakitori', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', lat: 35.6601, lng: 139.7238, rating: 4.82, price: 3200, cost: '₹3,200 (¥5,500) / person', description: 'Traditional Japanese wooden izakaya that inspired Quentin Tarantino’s famous restaurant scene in Kill Bill.', icon: '🍢', color: '#10b981', type: 'restaurant' }
    ],
    hotels: [
      { id: 'tok-h1', name: 'Aman Tokyo (Otemachi)', category: '5-Star Urban Sanctuary', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 35.6865, lng: 139.7640, rating: 4.98, price: 110000, cost: '₹110,000 / night', description: 'Soaring high above the financial district with ryokan-inspired suites, washi paper lanterns, and indoor black granite pool.', icon: '👑', color: '#8b5cf6', type: 'hotel' },
      { id: 'tok-h2', name: 'Park Hyatt Tokyo (Shinjuku)', category: 'Iconic High-Rise Luxury', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 35.6858, lng: 139.6910, rating: 4.92, price: 85000, cost: '₹85,000 / night', description: 'World-famous luxury tower from Lost in Translation featuring the top-floor New York Grill & Bar with panoramic views.', icon: '🏨', color: '#3b82f6', type: 'hotel' }
    ]
  },
  'new york': {
    name: 'New York City, New York, USA',
    shortName: 'New York',
    lat: 40.7128,
    lng: -74.0060,
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'nyc-a1', name: 'Statue of Liberty & Ellis Island', category: 'National Monument', image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=400&q=80', lat: 40.6892, lng: -74.0445, rating: 4.9, price: 2200, cost: '₹2,200 ($25) / person', description: 'World-famous symbol of freedom on Liberty Island with ferry access to the museum and panoramic harbour views.', icon: '🗽', color: '#10b981', type: 'place' },
      { id: 'nyc-a2', name: 'Central Park & Bethesda Terrace', category: 'Historic Urban Park', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', lat: 40.7829, lng: -73.9654, rating: 4.95, price: 0, cost: 'Free', description: '843-acre lush wonderland in the middle of Manhattan with rowboats, Bow Bridge, strawberry fields, and castle.', icon: '🌳', color: '#3b82f6', type: 'place' },
      { id: 'nyc-a3', name: 'Empire State Building Observatory', category: 'Skyline Landmark', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=400&q=80', lat: 40.7484, lng: -73.9857, rating: 4.88, price: 3800, cost: '₹3,800 ($44) / person', description: 'Iconic 102-story art-deco skyscraper in Midtown offering heart-pounding open-air vistas of the entire metropolis.', icon: '🏙️', color: '#f59e0b', type: 'place' },
      { id: 'nyc-a4', name: 'Times Square & Broadway', category: 'Entertainment District', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80', lat: 40.7580, lng: -73.9855, rating: 4.8, price: 0, cost: 'Free', description: 'The Crossroads of the World pulsating with massive digital billboards, Broadway theatres, and street performers.', icon: '🎭', color: '#ec4899', type: 'place' }
    ],
    restaurants: [
      { id: 'nyc-r1', name: 'Katz’s Delicatessen (Lower East Side)', category: 'Legendary Pastrami Sandwiches', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80', lat: 40.7222, lng: -73.9874, rating: 4.9, price: 2500, cost: '₹2,500 ($28) / person', description: 'Operating since 1888, serving world-famous hand-carved monster pastrami on rye with pickles and cream soda.', icon: '🥪', color: '#ef4444', type: 'restaurant' },
      { id: 'nyc-r2', name: 'Joe’s Pizza (Greenwich Village)', category: 'Iconic NYC Street Slice', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', lat: 40.7305, lng: -74.0021, rating: 4.95, price: 500, cost: '₹500 ($5) / slice', description: 'The quintessential New York thin-crust fold-over pizza slice loved by locals, tourists, and Hollywood stars.', icon: '🍕', color: '#f59e0b', type: 'restaurant' },
      { id: 'nyc-r3', name: 'Le Bernardin (Midtown)', category: '3-Michelin Star French Seafood', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 40.7615, lng: -73.9818, rating: 4.98, price: 18000, cost: '₹18,000 ($200) / person', description: 'Chef Eric Ripert’s globally acclaimed 3-star seafood sanctuary delivering exquisite culinary perfection.', icon: '🍷', color: '#8b5cf6', type: 'restaurant' }
    ],
    hotels: [
      { id: 'nyc-h1', name: 'The Plaza New York (Fifth Ave)', category: 'Iconic Luxury Landmark', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 40.7645, lng: -73.9745, rating: 4.95, price: 85000, cost: '₹85,000 / night', description: 'Castle-like palace on Central Park South with 24-karat gold-plated bathroom fixtures and Champagne Bar.', icon: '👑', color: '#f59e0b', type: 'hotel' },
      { id: 'nyc-h2', name: 'The Standard, High Line (Meatpacking)', category: 'Trendy Boutique Hotel', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 40.7410, lng: -74.0080, rating: 4.88, price: 42000, cost: '₹42,000 / night', description: 'Rising above the High Line park on stilts with floor-to-ceiling Hudson River sunset views and rooftop lounge.', icon: '🏨', color: '#3b82f6', type: 'hotel' }
    ]
  },
  'london': {
    name: 'London, United Kingdom',
    shortName: 'London',
    lat: 51.5074,
    lng: -0.1278,
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'lon-a1', name: 'Big Ben & Palace of Westminster', category: 'Historic Parliament Clock', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80', lat: 51.5007, lng: -0.1246, rating: 4.95, price: 0, cost: 'Free', description: 'Iconic 96m neo-Gothic clock tower standing proud over the River Thames and Westminster Bridge.', icon: '🕰️', color: '#f59e0b', type: 'place' },
      { id: 'lon-a2', name: 'Tower Bridge & Tower of London', category: 'UNESCO Medieval Castle', image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=400&q=80', lat: 51.5055, lng: -0.0754, rating: 4.92, price: 3400, cost: '₹3,400 (£32) / person', description: 'Victorian twin-tower suspension bridge and royal fortress home to the Crown Jewels and Yeoman Warders.', icon: '🏰', color: '#ef4444', type: 'place' },
      { id: 'lon-a3', name: 'The British Museum', category: 'World Artifacts Museum', image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=400&q=80', lat: 51.5194, lng: -0.1270, rating: 4.9, price: 0, cost: 'Free', description: 'World-renowned museum under the soaring glass Great Court housing the Rosetta Stone and Egyptian mummies.', icon: '🏛️', color: '#3b82f6', type: 'place' },
      { id: 'lon-a4', name: 'London Eye Observation Wheel', category: 'Thames Skyline Wheel', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80', lat: 51.5033, lng: -0.1195, rating: 4.85, price: 3500, cost: '₹3,500 (£34) / person', description: 'Giant 135m Ferris wheel on the South Bank offering 30-minute slow flight views over the London skyline.', icon: '🎡', color: '#8b5cf6', type: 'place' }
    ],
    restaurants: [
      { id: 'lon-r1', name: 'Dishoom (Covent Garden)', category: 'Bombay Cafe & House Black Daal', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80', lat: 51.5126, lng: -0.1264, rating: 4.95, price: 2800, cost: '₹2,800 (£26) / person', description: 'Beloved Bombay-style cafe celebrated for its 24-hour slow-cooked House Black Daal and bacon naan rolls.', icon: '🍛', color: '#f59e0b', type: 'restaurant' },
      { id: 'lon-r2', name: 'The Wolseley (Mayfair)', category: 'Grand European Cafe & High Tea', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80', lat: 51.5070, lng: -0.1415, rating: 4.88, price: 4500, cost: '₹4,500 (£42) / person', description: 'Spectacular Venetian-inspired grand cafe on Piccadilly renowned for traditional English afternoon high tea.', icon: '🫖', color: '#ec4899', type: 'restaurant' },
      { id: 'lon-r3', name: 'Duck & Waffle (Bishopsgate)', category: '24/7 Dining on the 40th Floor', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', lat: 51.5160, lng: -0.0810, rating: 4.82, price: 3800, cost: '₹3,800 (£36) / person', description: 'Breathtaking 40th-floor skyline dining serving crispy duck confit, fried duck egg, and mustard maple syrup on waffles.', icon: '🧇', color: '#10b981', type: 'restaurant' }
    ],
    hotels: [
      { id: 'lon-h1', name: 'The Savoy London (Strand)', category: 'Legendary 5-Star Luxury', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 51.5103, lng: -0.1205, rating: 4.96, price: 75000, cost: '₹75,000 / night', description: 'Historic 1889 luxury hotel on the Thames with Edwardian art-deco suites, Gordon Ramsay Grill, and American Bar.', icon: '👑', color: '#3b82f6', type: 'hotel' },
      { id: 'lon-h2', name: 'Shangri-La The Shard, London', category: 'High-Rise Panoramic Luxury', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 51.5045, lng: -0.0865, rating: 4.92, price: 92000, cost: '₹92,000 / night', description: 'Occupying levels 34 to 52 of Western Europe’s tallest skyscraper with infinity skypool and floor-to-ceiling glass.', icon: '🏨', color: '#8b5cf6', type: 'hotel' }
    ]
  },
  'dubai': {
    name: 'Dubai, United Arab Emirates',
    shortName: 'Dubai',
    lat: 25.2048,
    lng: 55.2708,
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      { id: 'dxb-a1', name: 'Burj Khalifa (124th & 148th Observation Deck)', category: 'Tallest Building in the World', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80', lat: 25.1972, lng: 55.2744, rating: 4.95, price: 4200, cost: '₹4,200 (AED 185) / person', description: 'The pinnacle of modern engineering soaring 828m with super-fast double-decker elevators and desert-ocean views.', icon: '🗼', color: '#3b82f6', type: 'place' },
      { id: 'dxb-a2', name: 'Dubai Mall & The Dubai Fountain Show', category: 'World’s Largest Mall & Fountains', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 25.1985, lng: 55.2796, rating: 4.9, price: 0, cost: 'Free (Fountain Show)', description: 'Choreographed dancing fountains shooting 500ft in the air set against the sparkling illuminated Burj Khalifa.', icon: '⛲', color: '#06b6d4', type: 'place' },
      { id: 'dxb-a3', name: 'Museum of the Future', category: 'Futuristic Architecture', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80', lat: 25.2192, lng: 55.2818, rating: 4.92, price: 3400, cost: '₹3,400 (AED 149) / person', description: 'Toroidal architectural wonder inscribed with Arabic poetry calligraphy showcasing 50-year future innovations.', icon: '🛸', color: '#a855f7', type: 'place' },
      { id: 'dxb-a4', name: 'Desert Safari Dunes & BBQ Camp', category: 'Desert Adventure & Falconry', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', lat: 24.8500, lng: 55.5000, rating: 4.88, price: 2800, cost: '₹2,800 (AED 120) / person', description: 'Thrilling 4x4 red dune bashing, sandboarding, camel treks, belly dancing, and stargazing Arabian BBQ buffet.', icon: '🏜️', color: '#f59e0b', type: 'place' }
    ],
    restaurants: [
      { id: 'dxb-r1', name: 'Atmosphere (Burj Khalifa Level 122)', category: 'Highest Restaurant in the World', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', lat: 25.1972, lng: 55.2744, rating: 4.92, price: 9500, cost: '₹9,500 (AED 420) / person', description: 'Fine dining 442m in the sky with culinary excellence and panoramic vistas of the Arabian Gulf.', icon: '🍷', color: '#ef4444', type: 'restaurant' },
      { id: 'dxb-r2', name: 'Al Ustad Special Kebab (Meena Bazaar)', category: 'Historic 1978 Iranian Kebabs', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80', lat: 25.2600, lng: 55.2950, rating: 4.9, price: 800, cost: '₹800 (AED 35) / person', description: 'Old Dubai institution famous for melt-in-mouth yogurt-marinated mutton and chicken kebabs with saffron rice.', icon: '🍢', color: '#f59e0b', type: 'restaurant' },
      { id: 'dxb-r3', name: 'Pierchic (Madinat Jumeirah)', category: 'Overwater Italian & Ocean Views', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', lat: 25.1360, lng: 55.1840, rating: 4.88, price: 6500, cost: '₹6,500 (AED 290) / person', description: 'Set on a wooden pier out in the sea with direct views of the iconic Burj Al Arab sail.', icon: '🍝', color: '#10b981', type: 'restaurant' }
    ],
    hotels: [
      { id: 'dxb-h1', name: 'Burj Al Arab Jumeirah', category: 'The World’s Only 7-Star Hotel', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', lat: 25.1412, lng: 55.1853, rating: 4.99, price: 180000, cost: '₹180,000 / night', description: 'Sail-shaped global icon of Arabian luxury on its own island with duplex suites, 24k gold leaf, and private beach.', icon: '👑', color: '#f59e0b', type: 'hotel' },
      { id: 'dxb-h2', name: 'Atlantis The Royal (Palm Jumeirah)', category: 'Ultra-Luxury Experiential Resort', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', lat: 25.1370, lng: 55.1260, rating: 4.95, price: 95000, cost: '₹95,000 / night', description: 'Groundbreaking architectural wonder with 90m high sky pool, celebrity chef restaurants, and fountains.', icon: '🏰', color: '#8b5cf6', type: 'hotel' }
    ]
  }
};

// Dynamic Fallback Generator for any other custom searched city in the world
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
        name: `${shortName} Historic Fortress & Royal Palace`,
        category: 'Heritage Landmark',
        image: coverImage || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80',
        lat: lat + 0.005,
        lng: lng + 0.004,
        rating: 4.88,
        price: 50,
        cost: '₹50 / person',
        description: `Explore the celebrated grand historic fortress, architectural courtyards, and cultural museums in ${shortName}.`,
        icon: '🏛️',
        color: '#f05a36',
        type: 'place'
      },
      {
        id: `gen-a2-${Date.now()}`,
        name: `${shortName} Scenic Waterfront & Promenade`,
        category: 'Scenic Waterfront',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
        lat: lat - 0.006,
        lng: lng + 0.005,
        rating: 4.9,
        price: 0,
        cost: 'Free',
        description: `Picturesque walking promenade with serene reflection waters, sunset viewpoints, and relaxing parks.`,
        icon: '🌊',
        color: '#10b981',
        type: 'place'
      },
      {
        id: `gen-a3-${Date.now()}`,
        name: `${shortName} National Art & Cultural Museum`,
        category: 'Art & Heritage',
        image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=400&q=80',
        lat: lat + 0.007,
        lng: lng - 0.005,
        rating: 4.82,
        price: 100,
        cost: '₹100 / person',
        description: `Curated museum showcasing centuries of regional artifacts, master sculptures, and timeless art collections.`,
        icon: '🎨',
        color: '#a855f7',
        type: 'place'
      },
      {
        id: `gen-a4-${Date.now()}`,
        name: `${shortName} Botanical Nature Sanctuary`,
        category: 'Nature & Gardens',
        image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=400&q=80',
        lat: lat - 0.004,
        lng: lng - 0.006,
        rating: 4.8,
        price: 30,
        cost: '₹30 / person',
        description: `Expansive botanical reserve with exotic flora, winding walking trails, and serene water fountains.`,
        icon: '🌳',
        color: '#06b6d4',
        type: 'place'
      }
    ],
    restaurants: [
      {
        id: `gen-r1-${Date.now()}`,
        name: `${shortName} Heritage Kitchen & Grill`,
        category: 'Signature Local Cuisine',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80',
        lat: lat + 0.003,
        lng: lng - 0.004,
        rating: 4.9,
        price: 650,
        cost: '₹650 / person',
        description: `Beloved local dining institution celebrated for authentic regional specialties, wood-fired delicacies, and warm hospitality.`,
        icon: '🍽️',
        color: '#f59e0b',
        type: 'restaurant'
      },
      {
        id: `gen-r2-${Date.now()}`,
        name: `${shortName} Artisan Cafe & Roastery`,
        category: 'Specialty Coffee & Bistro',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
        lat: lat - 0.004,
        lng: lng + 0.003,
        rating: 4.85,
        price: 400,
        cost: '₹400 / person',
        description: `Chic aesthetic bistro offering single-origin coffees, fresh gourmet sourdoughs, and handcrafted desserts.`,
        icon: '☕',
        color: '#ec4899',
        type: 'restaurant'
      },
      {
        id: `gen-r3-${Date.now()}`,
        name: `${shortName} Rooftop Lounge & Fine Dining`,
        category: 'Skyline Dining & Cocktails',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
        lat: lat + 0.006,
        lng: lng + 0.005,
        rating: 4.88,
        price: 1400,
        cost: '₹1,400 / person',
        description: `Elevated rooftop dining experience with panoramic sunset city skyline views and contemporary gastronomy.`,
        icon: '🍷',
        color: '#8b5cf6',
        type: 'restaurant'
      }
    ],
    hotels: [
      {
        id: `gen-h1-${Date.now()}`,
        name: `The Grand ${shortName} Luxury Hotel & Spa`,
        category: '5-Star Premier Luxury Stay',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
        lat: lat - 0.005,
        lng: lng - 0.006,
        rating: 4.95,
        price: 14000,
        cost: '₹14,000 / night',
        description: `Premier 5-star hotel sanctuary with marble suites, infinity swimming pool, luxury spa, and 24/7 concierge.`,
        icon: '👑',
        color: '#3b82f6',
        type: 'hotel'
      },
      {
        id: `gen-h2-${Date.now()}`,
        name: `${shortName} Boutique Heritage Suites`,
        category: 'Historic Boutique Hotel',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
        lat: lat + 0.004,
        lng: lng + 0.006,
        rating: 4.85,
        price: 7500,
        cost: '₹7,500 / night',
        description: `Charming boutique retreat with antique furnishings, tranquil courtyard garden, and complimentary breakfast.`,
        icon: '🏨',
        color: '#8b5cf6',
        type: 'hotel'
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

  // Tripmates & Companion Selection (Send Plan to Friends)
  const [companionType, setCompanionType] = useState('Friends');
  const [showCompanionDropdown, setShowCompanionDropdown] = useState(false);
  const [tripmates, setTripmates] = useState(['Alex M.']);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [friendRole, setFriendRole] = useState('Editor');
  const [shareCustomNote, setShareCustomNote] = useState('Hey! Check out our trip itinerary with all our planned sights, restaurants and stays!');
  const [shareCopiedLink, setShareCopiedLink] = useState(false);
  const [sendPlanToast, setSendPlanToast] = useState('');

  // Number of People (Travelers) State
  const [peopleCount, setPeopleCount] = useState(2);
  const [showPeopleDropdown, setShowPeopleDropdown] = useState(false);

  // Over-Budget Alert State
  const [showOverBudgetModal, setShowOverBudgetModal] = useState(false);
  const [overBudgetItem, setOverBudgetItem] = useState(null);

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
  // Select Destination and update Map Center, Title, Cover, Attractions, Restaurants & Hotels
  const selectDestinationItem = async (dest) => {
    const rawKey = (dest.key || dest.name.split(',')[0]).toLowerCase().trim();
    const shortName = dest.name.split(',')[0].trim();
    const lowerShortName = shortName.toLowerCase();
    const lowerFullName = (dest.name || '').toLowerCase();
    
    // Robust search for matching city in our curated database
    const matchedKey = Object.keys(DESTINATIONS_DB).find(k => 
      k === rawKey || 
      lowerShortName.includes(k) || 
      k.includes(lowerShortName) ||
      lowerFullName.includes(k)
    );
    const matchedDB = matchedKey ? DESTINATIONS_DB[matchedKey] : null;

    const lat = dest.lat || (matchedDB ? matchedDB.lat : 28.6139);
    const lng = dest.lng || (matchedDB ? matchedDB.lng : 77.2090);
    const coverImage = matchedDB ? matchedDB.coverImage : (dest.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80');

    setDestinationInput(dest.name);
    setSelectedDestination({
      name: dest.name,
      shortName: shortName,
      lat: lat,
      lng: lng,
      coverImage: coverImage
    });

    setTripTitle(`Trip to ${shortName}`);
    setShowSuggestions(false);

    // If city is found in our rich curated database, load immediately with famous places, restaurants & hotels
    if (matchedDB) {
      setRecommendedPlaces(matchedDB.attractions);
      setMyPlaces(matchedDB.attractions.slice(0, 3));

      setRecommendedRestaurants(matchedDB.restaurants);
      setMyRestaurants(matchedDB.restaurants.slice(0, 2));

      setRecommendedHotels(matchedDB.hotels);
      setMyHotels(matchedDB.hotels.slice(0, 1));
      return;
    }

    try {
      // Query backend for real places/activities in this city
      const response = await axiosInstance.get(`/places?cityId=${encodeURIComponent(shortName)}&limit=100`);
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const dbPlaces = response.data.data;
        
        const attractions = dbPlaces.filter(p => !['restaurant', 'food', 'cafe', 'hotel', 'stay', 'accommodation'].includes(p.category?.toLowerCase()));
        const restaurants = dbPlaces.filter(p => ['restaurant', 'food', 'cafe', 'bar'].includes(p.category?.toLowerCase()));
        const hotels = dbPlaces.filter(p => ['hotel', 'stay', 'accommodation', 'resort'].includes(p.category?.toLowerCase()));

        const mapToFrontend = (item, type = 'place') => {
          const numericPrice = Number(item.estimatedCost) || (type === 'hotel' ? 8500 : type === 'restaurant' ? 600 : 50);
          return {
            id: item._id,
            name: item.name,
            category: item.category || (type === 'hotel' ? 'Hotel / Stay' : type === 'restaurant' ? 'Dining Spot' : 'Sightseeing'),
            image: item.image || coverImage,
            lat: item.latitude || lat,
            lng: item.longitude || lng,
            rating: item.rating || 4.8,
            price: numericPrice,
            cost: item.estimatedCost ? `₹${item.estimatedCost} / ${type === 'hotel' ? 'night' : 'person'}` : (numericPrice === 0 ? 'Free' : `₹${numericPrice}`),
            description: item.description || `Famous ${type} located in the heart of ${shortName} with outstanding visitor reviews.`,
            icon: type === 'hotel' ? '🏨' : type === 'restaurant' ? '🍽️' : (item.category === 'Park' ? '🌳' : '🏛️'),
            color: type === 'hotel' ? '#3b82f6' : type === 'restaurant' ? '#f59e0b' : '#f05a36',
            type: type
          };
        };

        setRecommendedPlaces(attractions.map(item => mapToFrontend(item, 'place')));
        setMyPlaces(attractions.slice(0, 3).map(item => mapToFrontend(item, 'place')));

        setRecommendedRestaurants(restaurants.map(item => mapToFrontend(item, 'restaurant')));
        setMyRestaurants(restaurants.slice(0, 2).map(item => mapToFrontend(item, 'restaurant')));

        setRecommendedHotels(hotels.map(item => mapToFrontend(item, 'hotel')));
        setMyHotels(hotels.slice(0, 1).map(item => mapToFrontend(item, 'hotel')));
      } else {
        const cityData = getDynamicPlacesForCity(shortName, lat, lng, matchedDB, coverImage);
        setRecommendedPlaces(cityData.attractions);
        setMyPlaces(cityData.attractions.slice(0, 3));
        setRecommendedRestaurants(cityData.restaurants);
        setMyRestaurants(cityData.restaurants.slice(0, 2));
        setRecommendedHotels(cityData.hotels);
        setMyHotels(cityData.hotels.slice(0, 1));
      }
    } catch (error) {
      console.warn('[CreateTripPage] Failed to fetch places from backend, falling back to mock generator:', error);
      const cityData = getDynamicPlacesForCity(shortName, lat, lng, matchedDB, coverImage);
      setRecommendedPlaces(cityData.attractions);
      setMyPlaces(cityData.attractions.slice(0, 3));
      setRecommendedRestaurants(cityData.restaurants);
      setMyRestaurants(cityData.restaurants.slice(0, 2));
      setRecommendedHotels(cityData.hotels);
      setMyHotels(cityData.hotels.slice(0, 1));
    }
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

  // Dynamic Item Cost Calculation Multiplier for People Count
  const calculateItemCost = (item, count = peopleCount) => {
    if (!item) return 0;
    const basePrice = Number(item.price) || 0;
    if (item.type === 'hotel' || item.category?.toLowerCase().includes('hotel') || item.category?.toLowerCase().includes('resort') || item.category?.toLowerCase().includes('stay')) {
      const rooms = Math.max(1, Math.ceil(count / 2));
      return basePrice * rooms;
    }
    return basePrice * count;
  };

  // Comprehensive Budget Calculations
  const placesCost = myPlaces.reduce((sum, p) => sum + calculateItemCost(p, peopleCount), 0);
  const restaurantsCost = myRestaurants.reduce((sum, r) => sum + calculateItemCost(r, peopleCount), 0);
  const hotelsCost = myHotels.reduce((sum, h) => sum + calculateItemCost(h, peopleCount), 0);
  const manualExpensesTotal = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const totalPlannedCost = placesCost + restaurantsCost + hotelsCost + manualExpensesTotal;
  const remainingBudget = maxBudget - totalPlannedCost;
  const isOverBudget = remainingBudget < 0;
  const overBudgetAmount = Math.abs(remainingBudget);
  const budgetPercentageUsed = maxBudget > 0 ? Math.min(100, Math.round((totalPlannedCost / maxBudget) * 100)) : 0;

  // Handlers for Adding & Removing Places, Restaurants & Hotels with Live Budget Deduction
  const handleTogglePlace = (place) => {
    const isCurrentlyAdded = myPlaces.some((p) => p.id === place.id);
    if (isCurrentlyAdded) {
      setMyPlaces(myPlaces.filter((p) => p.id !== place.id));
    } else {
      const itemCost = calculateItemCost(place, peopleCount);
      if (remainingBudget - itemCost < 0) {
        setOverBudgetItem(place);
        setShowOverBudgetModal(true);
      }
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
      price: 50,
      cost: '₹50 / person',
      description: `Custom sightseeing landmark in ${selectedDestination.shortName}.`,
      icon: '📍',
      color: '#f05a36',
      type: 'place'
    };
    const itemCost = calculateItemCost(newPlace, peopleCount);
    if (remainingBudget - itemCost < 0) {
      setOverBudgetItem(newPlace);
      setShowOverBudgetModal(true);
    }
    setMyPlaces([...myPlaces, newPlace]);
    setNewPlaceInput('');
  };

  const handleToggleRestaurant = (rest) => {
    const isCurrentlyAdded = myRestaurants.some((r) => r.id === rest.id);
    if (isCurrentlyAdded) {
      setMyRestaurants(myRestaurants.filter((r) => r.id !== rest.id));
    } else {
      const itemCost = calculateItemCost(rest, peopleCount);
      if (remainingBudget - itemCost < 0) {
        setOverBudgetItem(rest);
        setShowOverBudgetModal(true);
      }
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
      price: 500,
      cost: '₹500 / person',
      description: `Custom local eatery in ${selectedDestination.shortName}.`,
      icon: '🍽️',
      color: '#f59e0b',
      type: 'restaurant'
    };
    const itemCost = calculateItemCost(newRest, peopleCount);
    if (remainingBudget - itemCost < 0) {
      setOverBudgetItem(newRest);
      setShowOverBudgetModal(true);
    }
    setMyRestaurants([...myRestaurants, newRest]);
    setNewRestaurantInput('');
  };

  const handleToggleHotel = (hotel) => {
    const isCurrentlyAdded = myHotels.some((h) => h.id === hotel.id);
    if (isCurrentlyAdded) {
      setMyHotels(myHotels.filter((h) => h.id !== hotel.id));
    } else {
      const itemCost = calculateItemCost(hotel, peopleCount);
      if (remainingBudget - itemCost < 0) {
        setOverBudgetItem(hotel);
        setShowOverBudgetModal(true);
      }
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
      price: 8000,
      cost: '₹8,000 / night',
      description: `Custom stay & accommodation in ${selectedDestination.shortName}.`,
      icon: '🏨',
      color: '#3b82f6',
      type: 'hotel'
    };
    const itemCost = calculateItemCost(newHotel, peopleCount);
    if (remainingBudget - itemCost < 0) {
      setOverBudgetItem(newHotel);
      setShowOverBudgetModal(true);
    }
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
    if (remainingBudget - parseFloat(expenseForm.amount) < 0) {
      setOverBudgetItem({
        name: expenseForm.title,
        category: expenseForm.category,
        price: parseFloat(expenseForm.amount),
        type: 'place',
        image: selectedDestination.coverImage
      });
      setShowOverBudgetModal(true);
    }
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

  const handleStartPlanning = async () => {
    try {
      let isoCurrency = 'USD';
      if (currency === '₹') isoCurrency = 'INR';
      else if (currency === '€') isoCurrency = 'EUR';
      else if (currency === '£') isoCurrency = 'GBP';

      const payload = {
        name: tripTitle || `Trip to ${selectedDestination.shortName}`,
        description: `${companionType} trip with ${tripmates.join(', ')}`,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalBudget: Number(maxBudget) || 0,
        currency: isoCurrency,
        status: 'planning'
      };

      // POST to backend
      const response = await axiosInstance.post('/trips', payload);
      const createdTrip = response.data.data;
      console.log('Trip created successfully on backend:', createdTrip);
      
      // Store trip ID in localStorage for routing & itinerary mapping
      localStorage.setItem('activeTripId', createdTrip._id);
      
      setInWorkspace(true);
    } catch (err) {
      console.error('Failed to create trip:', err);
      alert(err.response?.data?.message || err.message || 'Failed to create trip. Please ensure you are logged in.');
    }
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
                onClick={handleStartPlanning}
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

                {/* Floating Trip Info Card with Travelers & Live Budget Meter */}
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

                    {/* Travelers / Number of People Selector */}
                    <div className="travelers-count-badge">
                      <Users size={14} className="travelers-icon" />
                      <select 
                        value={peopleCount} 
                        onChange={(e) => setPeopleCount(Number(e.target.value))}
                        className="travelers-select-input"
                        title="Number of Travelers"
                      >
                        <option value={1}>1 Person (Solo)</option>
                        <option value={2}>2 People (Duo)</option>
                        <option value={3}>3 People (Small Group)</option>
                        <option value={4}>4 People (Family/Group)</option>
                        <option value={5}>5 People (Group)</option>
                        <option value={6}>6 People (Large Group)</option>
                        <option value={8}>8 People (Group Tour)</option>
                        <option value={10}>10 People (Party)</option>
                      </select>
                    </div>

                    {/* Live Budget Meter Pill */}
                    <div 
                      className={`floating-budget-meter-pill ${isOverBudget ? 'over-budget-pill' : 'within-budget-pill'}`}
                      onClick={() => setShowSetBudgetModal(true)}
                      title={isOverBudget ? 'Click to adjust target budget' : 'Target Budget'}
                    >
                      <Coins size={14} />
                      {isOverBudget ? (
                        <span>⚠️ -{currency}{overBudgetAmount.toLocaleString()} Over Budget</span>
                      ) : (
                        <span>{currency}{totalPlannedCost.toLocaleString()} / {currency}{maxBudget.toLocaleString()}</span>
                      )}
                    </div>

                    <div className="collaborator-avatars">
                      <div className="avatar-circle">ME</div>
                      <button 
                        className="send-plan-pill-btn" 
                        onClick={() => setShowInviteModal(true)}
                        title="Send trip plan to friends & tripmates"
                      >
                        <Send size={12} />
                        <span>Send Plan</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* OVER-BUDGET ALERT BANNER (If Planned Costs Exceed Budget) */}
              {isOverBudget && (
                <div className="over-budget-warning-banner">
                  <div className="warning-banner-left">
                    <div className="warning-icon-badge">
                      <AlertTriangle size={20} color="#ef4444" />
                    </div>
                    <div>
                      <h4 className="warning-banner-title">Over-Budget Warning ({peopleCount} Travelers)</h4>
                      <p className="warning-banner-text">
                        Planned expenses (<strong>{currency}{totalPlannedCost.toLocaleString()}</strong>) exceed your budget of <strong>{currency}{maxBudget.toLocaleString()}</strong> by <span className="warning-highlight">{currency}{overBudgetAmount.toLocaleString()}</span>.
                      </p>
                    </div>
                  </div>

                  <div className="warning-banner-actions">
                    <button 
                      type="button" 
                      className="warning-adjust-btn"
                      onClick={() => {
                        setBudgetInputVal(String(Math.ceil(totalPlannedCost / 5000) * 5000));
                        setShowSetBudgetModal(true);
                      }}
                    >
                      Increase Budget
                    </button>
                    <button 
                      type="button" 
                      className="warning-view-btn"
                      onClick={() => setActiveNavTab('budget')}
                    >
                      View Breakdown
                    </button>
                  </div>
                </div>
              )}

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
                    <h3 className="section-title">Places to visit ({recommendedPlaces.length} attractions)</h3>
                  </div>
                  <div className="section-header-meta">
                    <span className="meta-cost-indicator">
                      Selected: <strong>{currency}{placesCost.toLocaleString()}</strong> ({myPlaces.length} added)
                    </span>
                  </div>
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

                {/* Rich Recommended Places Cards Grid */}
                <div className="recommended-rich-grid">
                  {recommendedPlaces.map((place) => {
                    const isAdded = myPlaces.some((p) => p.id === place.id);
                    const itemTotal = calculateItemCost(place, peopleCount);
                    return (
                      <div 
                        key={place.id} 
                        className={`rich-item-card ${isAdded ? 'selected-card' : ''}`}
                        onClick={() => handleTogglePlace(place)}
                      >
                        <div className="rich-card-img-wrap">
                          <img src={place.image} alt={place.name} className="rich-card-img" />
                          <div className="rich-card-badge-row">
                            <span className="category-pill-tag">{place.category}</span>
                            <span className="rating-pill-tag">★ {place.rating}</span>
                          </div>
                        </div>

                        <div className="rich-card-body">
                          <h4 className="rich-card-title">{place.name}</h4>
                          <p className="rich-card-desc">{place.description}</p>

                          <div className="rich-card-price-calc-row">
                            <div className="price-calc-box">
                              <span className="unit-price-label">
                                {place.price > 0 ? `${currency}${place.price} / person` : 'Free Entry'}
                              </span>
                              <span className="calc-multiplier">
                                {place.price > 0 && ` × ${peopleCount} = ${currency}${itemTotal.toLocaleString()}`}
                              </span>
                            </div>

                            <button 
                              type="button"
                              className={`select-item-action-btn ${isAdded ? 'added-btn' : 'add-btn'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePlace(place);
                              }}
                            >
                              {isAdded ? (
                                <>
                                  <Check size={14} />
                                  <span>Selected</span>
                                </>
                              ) : (
                                <>
                                  <Plus size={14} />
                                  <span>Select</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* User Added Places List */}
                {myPlaces.length > 0 && (
                  <div className="user-added-places-list">
                    <h5 className="added-places-title">Selected attractions ({myPlaces.length} mapped • Total: {currency}{placesCost.toLocaleString()}):</h5>
                    <div className="added-places-grid">
                      {myPlaces.map((item) => {
                        const itemTotal = calculateItemCost(item, peopleCount);
                        return (
                          <div key={item.id} className="added-place-row">
                            <div className="place-info">
                              <img src={item.image} alt={item.name} className="added-item-thumb" />
                              <div>
                                <strong className="place-name">{item.name}</strong>
                                <span className="place-cat">{item.category} • {item.description?.slice(0, 50)}...</span>
                              </div>
                            </div>
                            <div className="added-item-price-actions">
                              <span className="added-item-total-tag">
                                {currency}{itemTotal.toLocaleString()} ({peopleCount} {peopleCount === 1 ? 'person' : 'people'})
                              </span>
                              <button 
                                type="button"
                                className="remove-place-btn"
                                onClick={() => setMyPlaces(myPlaces.filter((p) => p.id !== item.id))}
                                title="Remove place"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>

              {/* 4. SECTION: RESTAURANTS & DINING */}
              <section id="section-restaurants" className="places-to-visit-section">
                <div className="section-header-row">
                  <div className="section-title-with-arrow">
                    <ChevronDown size={18} />
                    <h3 className="section-title">Restaurants & Dining ({recommendedRestaurants.length} spots)</h3>
                  </div>
                  <div className="section-header-meta">
                    <span className="meta-cost-indicator">
                      Selected: <strong>{currency}{restaurantsCost.toLocaleString()}</strong> ({myRestaurants.length} added)
                    </span>
                  </div>
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

                {/* Rich Recommended Restaurants Cards Grid */}
                <div className="recommended-rich-grid">
                  {recommendedRestaurants.map((rest) => {
                    const isAdded = myRestaurants.some((r) => r.id === rest.id);
                    const itemTotal = calculateItemCost(rest, peopleCount);
                    return (
                      <div 
                        key={rest.id} 
                        className={`rich-item-card ${isAdded ? 'selected-card' : ''}`}
                        onClick={() => handleToggleRestaurant(rest)}
                      >
                        <div className="rich-card-img-wrap">
                          <img src={rest.image} alt={rest.name} className="rich-card-img" />
                          <div className="rich-card-badge-row">
                            <span className="category-pill-tag dining-tag">{rest.category}</span>
                            <span className="rating-pill-tag">★ {rest.rating}</span>
                          </div>
                        </div>

                        <div className="rich-card-body">
                          <h4 className="rich-card-title">{rest.name}</h4>
                          <p className="rich-card-desc">{rest.description}</p>

                          <div className="rich-card-price-calc-row">
                            <div className="price-calc-box">
                              <span className="unit-price-label">
                                {currency}{rest.price || 0} / person
                              </span>
                              <span className="calc-multiplier">
                                {` × ${peopleCount} = ${currency}${itemTotal.toLocaleString()}`}
                              </span>
                            </div>

                            <button 
                              type="button"
                              className={`select-item-action-btn ${isAdded ? 'added-btn' : 'add-btn'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleRestaurant(rest);
                              }}
                            >
                              {isAdded ? (
                                <>
                                  <Check size={14} />
                                  <span>Selected</span>
                                </>
                              ) : (
                                <>
                                  <Plus size={14} />
                                  <span>Select</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* User Added Restaurants List */}
                {myRestaurants.length > 0 && (
                  <div className="user-added-places-list">
                    <h5 className="added-places-title">Selected restaurants & food spots ({myRestaurants.length} mapped • Total: {currency}{restaurantsCost.toLocaleString()}):</h5>
                    <div className="added-places-grid">
                      {myRestaurants.map((item) => {
                        const itemTotal = calculateItemCost(item, peopleCount);
                        return (
                          <div key={item.id} className="added-place-row">
                            <div className="place-info">
                              <img src={item.image} alt={item.name} className="added-item-thumb" />
                              <div>
                                <strong className="place-name">{item.name}</strong>
                                <span className="place-cat">{item.category} • {item.description?.slice(0, 50)}...</span>
                              </div>
                            </div>
                            <div className="added-item-price-actions">
                              <span className="added-item-total-tag">
                                {currency}{itemTotal.toLocaleString()} ({peopleCount} {peopleCount === 1 ? 'person' : 'people'})
                              </span>
                              <button 
                                type="button"
                                className="remove-place-btn"
                                onClick={() => setMyRestaurants(myRestaurants.filter((r) => r.id !== item.id))}
                                title="Remove restaurant"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>

              {/* 5. SECTION: HOTELS & ACCOMMODATIONS */}
              <section id="section-hotels" className="places-to-visit-section">
                <div className="section-header-row">
                  <div className="section-title-with-arrow">
                    <ChevronDown size={18} />
                    <h3 className="section-title">Hotels & Stays ({recommendedHotels.length} accommodations)</h3>
                  </div>
                  <div className="section-header-meta">
                    <span className="meta-cost-indicator">
                      Selected: <strong>{currency}{hotelsCost.toLocaleString()}</strong> ({myHotels.length} added)
                    </span>
                  </div>
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

                {/* Rich Recommended Hotels Cards Grid */}
                <div className="recommended-rich-grid">
                  {recommendedHotels.map((hotel) => {
                    const isAdded = myHotels.some((h) => h.id === hotel.id);
                    const itemTotal = calculateItemCost(hotel, peopleCount);
                    const roomsCount = Math.max(1, Math.ceil(peopleCount / 2));
                    return (
                      <div 
                        key={hotel.id} 
                        className={`rich-item-card ${isAdded ? 'selected-card' : ''}`}
                        onClick={() => handleToggleHotel(hotel)}
                      >
                        <div className="rich-card-img-wrap">
                          <img src={hotel.image} alt={hotel.name} className="rich-card-img" />
                          <div className="rich-card-badge-row">
                            <span className="category-pill-tag hotel-tag">{hotel.category}</span>
                            <span className="rating-pill-tag">★ {hotel.rating}</span>
                          </div>
                        </div>

                        <div className="rich-card-body">
                          <h4 className="rich-card-title">{hotel.name}</h4>
                          <p className="rich-card-desc">{hotel.description}</p>

                          <div className="rich-card-price-calc-row">
                            <div className="price-calc-box">
                              <span className="unit-price-label">
                                {currency}{hotel.price.toLocaleString()} / night
                              </span>
                              <span className="calc-multiplier">
                                {` × ${roomsCount} ${roomsCount === 1 ? 'room' : 'rooms'} = ${currency}${itemTotal.toLocaleString()}`}
                              </span>
                            </div>

                            <button 
                              type="button"
                              className={`select-item-action-btn ${isAdded ? 'added-btn' : 'add-btn'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleHotel(hotel);
                              }}
                            >
                              {isAdded ? (
                                <>
                                  <Check size={14} />
                                  <span>Selected</span>
                                </>
                              ) : (
                                <>
                                  <Plus size={14} />
                                  <span>Select</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* User Added Hotels List */}
                {myHotels.length > 0 && (
                  <div className="user-added-places-list">
                    <h5 className="added-places-title">Selected hotels & stays ({myHotels.length} mapped • Total: {currency}{hotelsCost.toLocaleString()}):</h5>
                    <div className="added-places-grid">
                      {myHotels.map((item) => {
                        const itemTotal = calculateItemCost(item, peopleCount);
                        const roomsCount = Math.max(1, Math.ceil(peopleCount / 2));
                        return (
                          <div key={item.id} className="added-place-row">
                            <div className="place-info">
                              <img src={item.image} alt={item.name} className="added-item-thumb" />
                              <div>
                                <strong className="place-name">{item.name}</strong>
                                <span className="place-cat">{item.category} • {item.description?.slice(0, 50)}...</span>
                              </div>
                            </div>
                            <div className="added-item-price-actions">
                              <span className="added-item-total-tag">
                                {currency}{itemTotal.toLocaleString()} ({roomsCount} {roomsCount === 1 ? 'room' : 'rooms'})
                              </span>
                              <button 
                                type="button"
                                className="remove-place-btn"
                                onClick={() => setMyHotels(myHotels.filter((h) => h.id !== item.id))}
                                title="Remove hotel"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
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
            /* TAB: COMPREHENSIVE BUDGETING & EXPENSE VIEW */
            <div className="budgeting-view-container">
              
              <div className="budgeting-header-row">
                <div>
                  <h2 className="budgeting-title">Trip Budgeting & Financial Overview</h2>
                  <p className="budgeting-subtitle">
                    Live dynamic budget tracking across attractions, dining, and accommodations for {peopleCount} {peopleCount === 1 ? 'traveler' : 'travelers'}.
                  </p>
                </div>

                <div className="budgeting-header-buttons">
                  <button 
                    type="button" 
                    className="set-budget-main-btn"
                    onClick={() => setShowSetBudgetModal(true)}
                  >
                    <DollarSign size={15} />
                    <span>Set Target Budget</span>
                  </button>
                  <button 
                    type="button"
                    className="add-expense-coral-btn"
                    onClick={() => setShowAddExpenseModal(true)}
                  >
                    <Plus size={15} />
                    <span>Log Expense</span>
                  </button>
                </div>
              </div>

              {/* OVER-BUDGET ALERT BANNER INSIDE BUDGET TAB */}
              {isOverBudget && (
                <div className="budget-tab-alert-box">
                  <AlertTriangle size={24} color="#ef4444" />
                  <div className="tab-alert-text">
                    <h4>Budget Overdraft Warning: -{currency}{overBudgetAmount.toLocaleString()}</h4>
                    <p>
                      You have allocated {currency}{totalPlannedCost.toLocaleString()} towards this trip for {peopleCount} people, which exceeds your set limit of {currency}{maxBudget.toLocaleString()}. Adjust selected hotels or increase your target budget.
                    </p>
                  </div>
                  <button 
                    type="button"
                    className="quick-budget-bump-btn"
                    onClick={() => {
                      setMaxBudget(Math.ceil(totalPlannedCost / 5000) * 5000);
                    }}
                  >
                    Auto-Adjust to {currency}{(Math.ceil(totalPlannedCost / 5000) * 5000).toLocaleString()}
                  </button>
                </div>
              )}

              {/* Hero Budget Balance Card */}
              <div className="budget-summary-card">
                <div className="budget-card-top-grid">
                  <div className="budget-metric-col">
                    <span className="metric-label">Total Planned Spend</span>
                    <div className="metric-value-row">
                      <span className="currency-symbol">{currency}</span>
                      <span className="balance-amount">{totalPlannedCost.toLocaleString()}</span>
                    </div>
                    <span className="metric-subtext">Across all selected sights, food & stays</span>
                  </div>

                  <div className="budget-metric-col">
                    <span className="metric-label">Target Trip Budget</span>
                    <div className="metric-value-row">
                      <span className="currency-symbol">{currency}</span>
                      <span className="target-budget-val">{maxBudget.toLocaleString()}</span>
                    </div>
                    <span className="metric-subtext">Configured spending ceiling</span>
                  </div>

                  <div className="budget-metric-col">
                    <span className="metric-label">Remaining Balance</span>
                    <div className="metric-value-row">
                      <span className="currency-symbol">{currency}</span>
                      <span className={`remaining-balance-val ${isOverBudget ? 'negative-balance' : 'positive-balance'}`}>
                        {isOverBudget ? `-${overBudgetAmount.toLocaleString()}` : remainingBudget.toLocaleString()}
                      </span>
                    </div>
                    <span className="metric-subtext">{isOverBudget ? '⚠️ Deficit to cover' : '🟢 Safe available funds'}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="budget-meter-wrap">
                  <div className="budget-meter-header">
                    <span>Budget Utilized: <strong>{budgetPercentageUsed}%</strong></span>
                    <span>{isOverBudget ? '⚠️ Exceeded Limit' : `${currency}${remainingBudget.toLocaleString()} left`}</span>
                  </div>
                  <div className="budget-progress-track">
                    <div 
                      className={`budget-progress-fill ${isOverBudget ? 'over-fill' : budgetPercentageUsed > 80 ? 'warn-fill' : 'safe-fill'}`}
                      style={{ width: `${Math.min(100, budgetPercentageUsed)}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Quick Controls */}
                <div className="budget-actions-row">
                  <div className="budget-pill-buttons-left">
                    <div className="budget-pill-btn-with-select">
                      <Users size={14} />
                      <span>Travelers:</span>
                      <select 
                        value={peopleCount} 
                        onChange={(e) => setPeopleCount(Number(e.target.value))}
                        className="budget-inline-select"
                      >
                        <option value={1}>1 Traveler (Solo)</option>
                        <option value={2}>2 Travelers (Duo)</option>
                        <option value={3}>3 Travelers</option>
                        <option value={4}>4 Travelers (Family)</option>
                        <option value={5}>5 Travelers</option>
                        <option value={6}>6 Travelers</option>
                        <option value={8}>8 Travelers</option>
                        <option value={10}>10 Travelers</option>
                      </select>
                    </div>

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

              {/* Categorized Breakdown Cards Grid */}
              <div className="budget-category-cards-grid">
                
                {/* Category 1: Places to Visit */}
                <div className="category-breakdown-card" onClick={() => scrollToSection('places')}>
                  <div className="cat-card-header">
                    <div className="cat-icon-box sights-bg">🏛️</div>
                    <div>
                      <h4 className="cat-name">Places & Attractions</h4>
                      <span className="cat-count">{myPlaces.length} places selected</span>
                    </div>
                  </div>
                  <div className="cat-cost-row">
                    <span className="cat-amount">{currency}{placesCost.toLocaleString()}</span>
                    <span className="cat-people-rate">{currency}{placesCost > 0 ? Math.round(placesCost / peopleCount) : 0}/person</span>
                  </div>
                </div>

                {/* Category 2: Restaurants & Dining */}
                <div className="category-breakdown-card" onClick={() => scrollToSection('restaurants')}>
                  <div className="cat-card-header">
                    <div className="cat-icon-box food-bg">🍽️</div>
                    <div>
                      <h4 className="cat-name">Dining & Food</h4>
                      <span className="cat-count">{myRestaurants.length} spots selected</span>
                    </div>
                  </div>
                  <div className="cat-cost-row">
                    <span className="cat-amount">{currency}{restaurantsCost.toLocaleString()}</span>
                    <span className="cat-people-rate">{currency}{restaurantsCost > 0 ? Math.round(restaurantsCost / peopleCount) : 0}/person</span>
                  </div>
                </div>

                {/* Category 3: Hotels & Stays */}
                <div className="category-breakdown-card" onClick={() => scrollToSection('hotels')}>
                  <div className="cat-card-header">
                    <div className="cat-icon-box hotel-bg">🏨</div>
                    <div>
                      <h4 className="cat-name">Hotels & Stays</h4>
                      <span className="cat-count">{myHotels.length} accommodations</span>
                    </div>
                  </div>
                  <div className="cat-cost-row">
                    <span className="cat-amount">{currency}{hotelsCost.toLocaleString()}</span>
                    <span className="cat-people-rate">{Math.max(1, Math.ceil(peopleCount / 2))} {Math.max(1, Math.ceil(peopleCount / 2)) === 1 ? 'room' : 'rooms'}</span>
                  </div>
                </div>

                {/* Category 4: Custom Expenses */}
                <div className="category-breakdown-card" onClick={() => setShowAddExpenseModal(true)}>
                  <div className="cat-card-header">
                    <div className="cat-icon-box misc-bg">💳</div>
                    <div>
                      <h4 className="cat-name">Custom Logged</h4>
                      <span className="cat-count">{expenses.length} custom expenses</span>
                    </div>
                  </div>
                  <div className="cat-cost-row">
                    <span className="cat-amount">{currency}{manualExpensesTotal.toLocaleString()}</span>
                    <span className="cat-people-rate">+ Add more</span>
                  </div>
                </div>

              </div>

              {/* Itemized Planned Selections Table */}
              <div className="itemized-breakdown-section">
                <div className="expenses-header-row">
                  <h3 className="expenses-title">Itemized Planned Itinerary Breakdown ({myPlaces.length + myRestaurants.length + myHotels.length + expenses.length} items)</h3>
                </div>

                <div className="itemized-list">
                  {/* Sights */}
                  {myPlaces.map((place) => (
                    <div key={place.id} className="itemized-row-card">
                      <div className="item-row-left">
                        <img src={place.image} alt={place.name} className="item-row-img" />
                        <div>
                          <strong className="item-row-title">{place.name}</strong>
                          <span className="item-row-cat">🏛️ {place.category} • {place.price > 0 ? `${currency}${place.price} / person` : 'Free Entry'}</span>
                        </div>
                      </div>
                      <div className="item-row-right">
                        <span className="item-row-cost">
                          {currency}{calculateItemCost(place, peopleCount).toLocaleString()}
                        </span>
                        <button 
                          type="button" 
                          className="item-delete-btn" 
                          onClick={() => setMyPlaces(myPlaces.filter(p => p.id !== place.id))}
                          title="Remove from budget"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Restaurants */}
                  {myRestaurants.map((rest) => (
                    <div key={rest.id} className="itemized-row-card">
                      <div className="item-row-left">
                        <img src={rest.image} alt={rest.name} className="item-row-img" />
                        <div>
                          <strong className="item-row-title">{rest.name}</strong>
                          <span className="item-row-cat">🍽️ {rest.category} • {currency}{rest.price} / person</span>
                        </div>
                      </div>
                      <div className="item-row-right">
                        <span className="item-row-cost">
                          {currency}{calculateItemCost(rest, peopleCount).toLocaleString()}
                        </span>
                        <button 
                          type="button" 
                          className="item-delete-btn" 
                          onClick={() => setMyRestaurants(myRestaurants.filter(r => r.id !== rest.id))}
                          title="Remove from budget"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Hotels */}
                  {myHotels.map((hotel) => (
                    <div key={hotel.id} className="itemized-row-card">
                      <div className="item-row-left">
                        <img src={hotel.image} alt={hotel.name} className="item-row-img" />
                        <div>
                          <strong className="item-row-title">{hotel.name}</strong>
                          <span className="item-row-cat">🏨 {hotel.category} • {currency}{hotel.price.toLocaleString()} / night</span>
                        </div>
                      </div>
                      <div className="item-row-right">
                        <span className="item-row-cost">
                          {currency}{calculateItemCost(hotel, peopleCount).toLocaleString()}
                        </span>
                        <button 
                          type="button" 
                          className="item-delete-btn" 
                          onClick={() => setMyHotels(myHotels.filter(h => h.id !== hotel.id))}
                          title="Remove from budget"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Custom Expenses */}
                  {expenses.map((exp) => (
                    <div key={exp.id} className="itemized-row-card">
                      <div className="item-row-left">
                        <div className="exp-custom-icon">💳</div>
                        <div>
                          <strong className="item-row-title">{exp.title}</strong>
                          <span className="item-row-cat">💳 {exp.category} • Paid by {exp.payer} on {exp.date}</span>
                        </div>
                      </div>
                      <div className="item-row-right">
                        <span className="item-row-cost">
                          {currency}{exp.amount.toFixed(2)}
                        </span>
                        <button 
                          type="button" 
                          className="item-delete-btn" 
                          onClick={() => setExpenses(expenses.filter(e => e.id !== exp.id))}
                          title="Remove expense"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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

      {/* MODAL 1: SEND PLAN TO FRIENDS & TRIPMATES */}
      {showInviteModal && (
        <div className="modal-backdrop" onClick={() => setShowInviteModal(false)}>
          <div className="dark-modal send-plan-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="header-icon-title">
                <Send size={20} color="#f05a36" />
                <h3>Send Plan to Friends</h3>
              </div>
              <button type="button" className="close-btn" onClick={() => setShowInviteModal(false)}>
                <X size={18} />
              </button>
            </div>
            
            <p className="modal-desc">
              Invite friends to collaborate in real-time on your <strong>{selectedDestination.shortName}</strong> trip, or send the complete itinerary via WhatsApp & Email.
            </p>

            {/* Live Trip Plan Summary Card */}
            <div className="plan-summary-card">
              <img 
                src={selectedDestination.coverImage} 
                alt={selectedDestination.shortName} 
                className="plan-card-thumb"
              />
              <div className="plan-card-details">
                <span className="plan-tag">✈️ LIVE TRIP PLAN</span>
                <h4>{tripTitle}</h4>
                <div className="plan-meta-stats">
                  <span>📅 {formatBadgeDates()}</span>
                  <span>👥 {peopleCount} Travelers</span>
                  <span>🏛️ {myPlaces.length} Sights</span>
                  <span>🍽️ {myRestaurants.length} Food</span>
                  <span>🏨 {myHotels.length} Stays</span>
                </div>
                <div className="plan-budget-stat">
                  <span>Total Estimated Budget: <strong>{currency}{totalPlannedCost.toLocaleString()}</strong></span>
                </div>
              </div>
            </div>

            {/* Option 1: Direct Email Invite */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (inviteEmail.trim()) {
                  setTripmates([...tripmates, inviteEmail.trim()]);
                  setSendPlanToast(`Trip plan successfully sent to ${inviteEmail.trim()}!`);
                  setInviteEmail('');
                  setTimeout(() => setSendPlanToast(''), 4000);
                }
              }}
              className="send-email-box"
            >
              <label className="send-section-label">1. Send via Email</label>
              <div className="send-input-group">
                <input
                  type="email"
                  placeholder="Enter friend's email (e.g. friend@gmail.com)"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="modal-email-input"
                  required
                />
                <select 
                  value={friendRole} 
                  onChange={(e) => setFriendRole(e.target.value)}
                  className="send-role-dropdown"
                >
                  <option value="Editor">Can Edit & Plan</option>
                  <option value="Viewer">Can View Only</option>
                </select>
                <button type="submit" className="modal-invite-btn">
                  <Send size={14} />
                  <span>Send</span>
                </button>
              </div>
              <textarea
                placeholder="Personal note for your friend..."
                value={shareCustomNote}
                onChange={(e) => setShareCustomNote(e.target.value)}
                className="send-note-textarea"
                rows={2}
              />
            </form>

            {/* Option 2: Instant WhatsApp & Copy Link */}
            <div className="send-instant-actions">
              <button 
                type="button" 
                className="instant-share-btn whatsapp-share"
                onClick={() => {
                  const msg = `*TripMate Itinerary: ${tripTitle}* ✈️\n📍 Destination: ${selectedDestination.name}\n📅 Dates: ${formatBadgeDates()}\n👥 Travelers: ${peopleCount} People\n🏛️ Sights: ${myPlaces.length} Planned\n🍽️ Dining: ${myRestaurants.length} Restaurants\n🏨 Hotels: ${myHotels.length} Stays\n💰 Estimated Budget: ${currency}${totalPlannedCost.toLocaleString()}\n🔗 View & Collaborate: ${window.location.href}`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                }}
              >
                <MessageSquare size={16} />
                <span>Share on WhatsApp</span>
              </button>

              <button 
                type="button" 
                className={`instant-share-btn copy-share ${shareCopiedLink ? 'copied' : ''}`}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShareCopiedLink(true);
                  setSendPlanToast('Trip plan link copied to clipboard!');
                  setTimeout(() => {
                    setShareCopiedLink(false);
                    setSendPlanToast('');
                  }, 3000);
                }}
              >
                {shareCopiedLink ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                <span>{shareCopiedLink ? 'Link Copied!' : 'Copy Plan Link'}</span>
              </button>
            </div>

            {/* Tripmates & Collaborators List */}
            <div className="modal-tripmates-list-box">
              <label className="send-section-label">Tripmates ({tripmates.length})</label>
              <div className="tripmates-tags-container">
                {tripmates.map((mate, idx) => (
                  <div key={idx} className="tripmate-tag-item">
                    <div className="mate-avatar">{mate.slice(0, 2).toUpperCase()}</div>
                    <span className="mate-name">{mate}</span>
                    <span className="mate-role-tag">{idx === 0 ? 'Owner' : 'Editor'}</span>
                    {idx > 0 && (
                      <button 
                        type="button" 
                        className="mate-remove-btn"
                        onClick={() => setTripmates(tripmates.filter((_, i) => i !== idx))}
                        title="Remove tripmate"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Global Toast Alert for Send Plan */}
      {sendPlanToast && (
        <div className="trip-toast-alert">
          <CheckCheck size={18} color="#22c55e" />
          <span>{sendPlanToast}</span>
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

      {/* MODAL 5: OVER-BUDGET WARNING POPUP MODAL */}
      {showOverBudgetModal && (
        <div className="modal-backdrop overbudget-backdrop" onClick={() => setShowOverBudgetModal(false)}>
          <div className="overbudget-modal-card glass-modal" onClick={(e) => e.stopPropagation()}>
            <div className="overbudget-modal-header">
              <div className="overbudget-header-icon-wrap">
                <AlertTriangle size={24} color="#ef4444" />
              </div>
              <div className="overbudget-header-text">
                <h3>Trip Budget Exceeded!</h3>
                <span className="overbudget-sub">Remaining balance is less than zero (₹)</span>
              </div>
              <button type="button" className="close-btn" onClick={() => setShowOverBudgetModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="overbudget-modal-body">
              <p className="overbudget-alert-intro">
                Adding <strong>{overBudgetItem?.name || 'this item'}</strong> exceeds your configured trip budget limit for <strong>{peopleCount} {peopleCount === 1 ? 'traveler' : 'travelers'}</strong>.
              </p>

              {/* Over-budget Stats Breakdown */}
              <div className="overbudget-stat-grid">
                <div className="overbudget-stat-col">
                  <span className="stat-label">Total Planned</span>
                  <span className="stat-val planned-val">{currency}{totalPlannedCost.toLocaleString()}</span>
                </div>
                <div className="overbudget-stat-col">
                  <span className="stat-label">Target Budget</span>
                  <span className="stat-val budget-val">{currency}{maxBudget.toLocaleString()}</span>
                </div>
                <div className="overbudget-stat-col">
                  <span className="stat-label">Budget Overdraft</span>
                  <span className="stat-val over-val">-{currency}{overBudgetAmount.toLocaleString()}</span>
                </div>
              </div>

              {overBudgetItem && (
                <div className="overbudget-item-preview">
                  <img 
                    src={overBudgetItem.image || selectedDestination.coverImage} 
                    alt={overBudgetItem.name} 
                    className="preview-img"
                  />
                  <div className="preview-info">
                    <span className="preview-title">{overBudgetItem.name}</span>
                    <span className="preview-cat">{overBudgetItem.category}</span>
                    <span className="preview-calc">
                      Cost: <strong>{currency}{calculateItemCost(overBudgetItem, peopleCount).toLocaleString()}</strong> for {peopleCount} {peopleCount === 1 ? 'person' : 'people'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="overbudget-modal-footer">
              <button 
                type="button" 
                className="overbudget-auto-increase-btn"
                onClick={() => {
                  const newSuggestedBudget = Math.ceil(totalPlannedCost / 5000) * 5000;
                  setMaxBudget(newSuggestedBudget);
                  setShowOverBudgetModal(false);
                }}
              >
                Increase Budget to {currency}{(Math.ceil(totalPlannedCost / 5000) * 5000).toLocaleString()}
              </button>

              <button 
                type="button" 
                className="overbudget-keep-warn-btn"
                onClick={() => setShowOverBudgetModal(false)}
              >
                Keep Item with Warning
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreateTripPage;
