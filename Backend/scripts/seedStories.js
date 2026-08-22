import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import Story from '../src/models/Story.js';

const SEED_STORIES = [
  {
    title: 'Top Secret Sunrise Spots in Interlaken & Bernese Oberland',
    content: 'Just returned from a 10-day solo trek around the Eiger Ridge! If you take the 06:15 AM first gondola to First, you have the entire cliff walk completely to yourself with golden morning mist rising over the glaciers. Highly recommend packing windproof shells and sturdy trail crampons.',
    location: 'Interlaken, Switzerland',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    category: 'mountains',
    author: 'Elena Rostova',
    handle: '@elena_alpine',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    likes: 342,
    likedBy: [],
    commentsCount: 48,
    tags: ['#switzerland', '#alps', '#solotravel', '#hiking'],
    isVerified: true,
  },
  {
    title: 'Hidden Heritage Ryokans & Bamboo Groves in Arashiyama',
    content: 'For anyone planning Kyoto in October, avoid the noon crowds by booking morning tea workshops at Okochi Sanso garden. The matcha served with seasonal wagashi sweets while overlooking the emerald gorge is simply unforgettable.',
    location: 'Kyoto, Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    category: 'heritage',
    author: 'Kenji Sato',
    handle: '@kenji_explores',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    likes: 512,
    likedBy: [],
    commentsCount: 63,
    tags: ['#kyoto', '#japan', '#culturaltrip', '#teaceremony'],
    isVerified: true,
  },
  {
    title: 'Sailing the Cyclades: Best Catamaran Routes & Anchorages',
    content: 'We chartered a 42ft catamaran for 8 days across Paros, Naxos, and Santorini caldera. Best tip: anchor in Ammoudi Bay just before 6 PM for dinner at the cliffside tavernas. The fresh octopus and local Assyrtiko white wine are unmatched.',
    location: 'Santorini & Naxos, Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    category: 'beaches',
    author: 'Marcus Vance',
    handle: '@marcus_vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    likes: 289,
    likedBy: [],
    commentsCount: 31,
    tags: ['#greece', '#santorini', '#sailing', '#islandlife'],
    isVerified: true,
  },
  {
    title: 'Sunset Vibes & Secret Cliff Beaches in South Goa',
    content: 'Skip the overcrowded commercial beaches and rent a scooter towards Butterfly Beach and Cola Beach in South Goa! You get serene blue lagoons, palm tree canopies, and the freshest wood-fired seafood shacks overlooking the Arabian Sea.',
    location: 'Goa, India',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    category: 'beaches',
    author: 'Aarav Sharma',
    handle: '@aarav_wanderer',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    likes: 419,
    likedBy: [],
    commentsCount: 52,
    tags: ['#goa', '#beachlife', '#southgoa', '#indiatravel'],
    isVerified: true,
  },
  {
    title: 'Sunrise Hot Air Balloon Flight Over Fairy Chimneys',
    content: 'Floating 2,000 feet above the Göreme valley at dawn with hundreds of colorful balloons illuminated by the rising sun. Make sure to book your flight on your very first morning so you have backup weather days if needed!',
    location: 'Cappadocia, Turkey',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80',
    category: 'adventure',
    author: 'Sophie Dubois',
    handle: '@sophie_skies',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    likes: 673,
    likedBy: [],
    commentsCount: 89,
    tags: ['#cappadocia', '#hotairballoon', '#turkey', '#adventure'],
    isVerified: true,
  },
  {
    title: 'Parisian Cafe Hopping & Sunset Walks Along the Seine',
    content: 'The charm of Paris isn’t just in its museums—it’s in sitting on a wicker chair at a corner terrace in Saint-Germain-des-Prés with a warm café au lait and watching the city come alive. Make sure to stroll across Pont des Arts right around golden hour.',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    category: 'food',
    author: 'Camille Laurent',
    handle: '@camille_in_paris',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    likes: 580,
    likedBy: [],
    commentsCount: 74,
    tags: ['#paris', '#france', '#cafe', '#coffeelovers'],
    isVerified: true,
  },
];

const seedStories = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing stories (if any)...');
    await Story.deleteMany({});

    console.log('[Seed] Inserting initial curated travel stories...');
    const inserted = await Story.insertMany(SEED_STORIES);

    console.log(`[Seed] Successfully seeded ${inserted.length} travel stories into MongoDB!`);
    await mongoose.disconnect();
    console.log('[Seed] Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Error seeding stories: ${error.message}`);
    process.exit(1);
  }
};

seedStories();
