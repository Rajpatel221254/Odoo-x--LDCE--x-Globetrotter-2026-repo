import express from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { uploadProfilePhoto } from '../middleware/upload.middleware.js';
import { updateProfileSchema } from '../validators/auth.validator.js';

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get the authenticated user's full profile (including profilePhoto URL)
 * @access  Protected
 */
router.get('/me', protect, getProfile);

/**
 * @route   PATCH /api/users/me
 * @desc    Update profile fields (accepts JSON or multipart/form-data with profilePhoto)
 * @access  Protected
 */
router.patch('/me', protect, uploadProfilePhoto, validate(updateProfileSchema), updateProfile);

export default router;
