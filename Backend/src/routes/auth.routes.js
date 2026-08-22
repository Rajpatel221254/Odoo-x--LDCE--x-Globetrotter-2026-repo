import express from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { uploadProfilePhoto } from '../middleware/upload.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account (accepts JSON or multipart/form-data with profilePhoto)
 * @access  Public
 */
router.post('/register', uploadProfilePhoto, validate(registerSchema), register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
router.post('/login', validate(loginSchema), login);

/**
 * @route   GET /api/auth/me
 * @desc    Return the currently authenticated user
 * @access  Protected
 */
router.get('/me', protect, getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (stateless — instructs client to discard token)
 * @access  Protected
 */
router.post('/logout', protect, logout);

export default router;
