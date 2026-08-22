import mongoose from 'mongoose';

const PLACE_CATEGORIES = ['Tourist attraction', 'Museum', 'Landmark', 'Park', 'Activity'];

const PlaceSchema = new mongoose.Schema(
  {
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    // externalId — the spec-compliant unique identifier from the external source (Geoapify place_id)
    externalId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    // placeId — kept for backward compatibility with existing seeded data
    placeId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: PLACE_CATEGORIES,
      trim: true,
    },
    description: {
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
    estimatedCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
    },
    duration: {
      type: Number,
      default: 60,
      min: 0,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for filtering and range queries
PlaceSchema.index({ cityId: 1 });
PlaceSchema.index({ cityId: 1, category: 1 });
PlaceSchema.index({ cityId: 1, estimatedCost: 1 });
PlaceSchema.index({ cityId: 1, duration: 1 });

export default mongoose.model('Place', PlaceSchema);
