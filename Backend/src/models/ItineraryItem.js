import mongoose from 'mongoose';

const ItineraryItemSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip ID is required'],
      index: true,
    },
    tripStopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TripStop',
      required: [true, 'Trip Stop ID is required'],
      index: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'City ID is required'],
      index: true,
    },
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: [true, 'Place ID is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Activity date is required'],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required (e.g. "09:00")'],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, 'End time is required (e.g. "11:00")'],
      trim: true,
    },
    order: {
      type: Number,
      required: [true, 'Order is required'],
      min: [1, 'Order must be at least 1'],
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
    estimatedCost: {
      type: Number,
      default: 0,
      min: [0, 'Estimated cost cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying ordered activities on a trip date
ItineraryItemSchema.index({ tripId: 1, date: 1, order: 1 });

export default mongoose.model('ItineraryItem', ItineraryItemSchema);
