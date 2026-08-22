import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  region: {
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
  costIndex: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  popularity: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate city-country records
CitySchema.index({ name: 1, country: 1 }, { unique: true });

export default mongoose.model('City', CitySchema);
