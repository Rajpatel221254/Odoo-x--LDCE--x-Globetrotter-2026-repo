import mongoose from 'mongoose';

export const EXPENSE_CATEGORIES = [
  'transport',
  'accommodation',
  'food',
  'activity',
  'miscellaneous',
];

const ExpenseSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip ID is required'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: EXPENSE_CATEGORIES,
        message: `Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}`,
      },
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Expense description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Expense amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
      uppercase: true,
    },
    date: {
      type: Date,
      required: [true, 'Expense date is required'],
      index: true,
    },
    itineraryItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItineraryItem',
      default: null,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying a trip's expenses by date
ExpenseSchema.index({ tripId: 1, date: -1 });
ExpenseSchema.index({ tripId: 1, category: 1 });

export default mongoose.model('Expense', ExpenseSchema);
