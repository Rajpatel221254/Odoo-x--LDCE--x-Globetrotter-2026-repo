import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true,
      maxlength: [100, 'Trip name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    coverImage: {
      type: String,
      trim: true,
      default: null,
    },
    totalBudget: {
      type: Number,
      default: 0,
      min: [0, 'Total budget cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['planning', 'ongoing', 'completed', 'cancelled'],
      default: 'planning',
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for stops associated with this trip
TripSchema.virtual('stops', {
  ref: 'TripStop',
  localField: '_id',
  foreignField: 'tripId',
  options: { sort: { order: 1 } },
});

TripSchema.index({ userId: 1, createdAt: -1 });
TripSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Trip', TripSchema);
