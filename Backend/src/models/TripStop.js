import mongoose from 'mongoose';

const TripStopSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip ID is required'],
      index: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'City ID is required'],
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Stop start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'Stop end date is required'],
    },
    order: {
      type: Number,
      required: [true, 'Stop order is required'],
      min: [1, 'Order must be at least 1'],
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate city stops inside the same trip
TripStopSchema.index({ tripId: 1, cityId: 1 }, { unique: true });

// Compound index to quickly fetch ordered stops for a trip
TripStopSchema.index({ tripId: 1, order: 1 });

export default mongoose.model('TripStop', TripStopSchema);
