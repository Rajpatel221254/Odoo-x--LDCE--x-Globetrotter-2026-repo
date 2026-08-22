import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    region: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    costIndex: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    popularity: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    image: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index — prevents duplicate city+country records
CitySchema.index({ name: 1, country: 1 }, { unique: true });

// Indexes for filter queries
CitySchema.index({ country: 1 });
CitySchema.index({ region: 1 });
CitySchema.index({ popularity: -1 });

// Text index for full-text search across name, country, region
CitySchema.index({ name: 'text', country: 'text', region: 'text' });

export default mongoose.model('City', CitySchema);
