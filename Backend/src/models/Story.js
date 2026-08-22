import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
      default: 'Traveler',
    },
    handle: {
      type: String,
      trim: true,
      default: '@traveler',
    },
    avatar: {
      type: String,
      trim: true,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const StorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Story title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Story content is required'],
      trim: true,
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    location: {
      type: String,
      trim: true,
      default: 'Global Explorer',
    },
    image: {
      type: String,
      required: [true, 'Story image URL is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['beaches', 'mountains', 'heritage', 'cities', 'adventure', 'food', 'general'],
      default: 'general',
      lowercase: true,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
      default: 'Alex Morgan',
    },
    handle: {
      type: String,
      trim: true,
      default: '@alex_globetrotter',
    },
    avatar: {
      type: String,
      trim: true,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    likes: {
      type: Number,
      default: 0,
      min: [0, 'Likes cannot be negative'],
    },
    likedBy: [
      {
        type: String, // Stores User ObjectId or IP/Session identifier
      },
    ],
    comments: [CommentSchema],
    commentsCount: {
      type: Number,
      default: 0,
      min: [0, 'Comments count cannot be negative'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for fast search and filtering
StorySchema.index({ title: 'text', content: 'text', location: 'text', tags: 'text' });
StorySchema.index({ category: 1, createdAt: -1 });
StorySchema.index({ likes: -1 });
StorySchema.index({ createdAt: -1 });

export default mongoose.model('Story', StorySchema);
