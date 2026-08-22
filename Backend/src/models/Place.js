import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Tourist attraction', 'Museum', 'Landmark', 'Park', 'Activity'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  estimatedCost: {
    type: Number,
    default: 0 // Default cost: free (0) if not specified
  },
  duration: {
    type: Number,
    default: 120 // Default duration: 120 minutes (2 hours) if not specified
  },
  image: {
    type: String,
    trim: true
  },
  placeId: {
    type: String,
    required: true,
    unique: true, // Unique index to prevent duplicate place records
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Place', PlaceSchema);
