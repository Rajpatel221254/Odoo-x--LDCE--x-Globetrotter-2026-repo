import express from 'express';
import {
  getStories,
  getStoryById,
  createStory,
  toggleLikeStory,
  addCommentStory,
  deleteStory,
} from '../controllers/story.controller.js';
import { protect, optionalProtect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public / optionally authenticated routes
router.get('/', optionalProtect, getStories);
router.get('/:id', optionalProtect, getStoryById);

// Create story (supports both logged-in users and guests)
router.post('/', optionalProtect, createStory);

// Interaction routes
router.post('/:id/like', optionalProtect, toggleLikeStory);
router.post('/:id/comment', optionalProtect, addCommentStory);

// Protected delete route
router.delete('/:id', protect, deleteStory);

export default router;
