import path from 'path';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { uploadImageToImageKit } from '../services/imagekit.service.js';

// ─── Token helper ─────────────────────────────────────────────────────────────
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Body (validated): firstName, lastName, phoneNumber, email, password, (optional: city, country, additionalInfo)
 * File (optional): profilePhoto (or photo, avatar, image) uploaded via Multer and stored in ImageKit
 */
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, email, password, city, country, additionalInfo } =
      req.body;

    // Check duplicate email early
    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error('An account with this email already exists.');
      err.statusCode = 409;
      return next(err);
    }

    let profilePhoto = req.body.profilePhoto || null;

    // If an image file was provided in multipart/form-data, upload to ImageKit
    if (req.file) {
      const ext = path.extname(req.file.originalname) || '.jpg';
      const fileName = `profile_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
      const uploadResult = await uploadImageToImageKit(
        req.file.buffer,
        fileName,
        'globetrotter/profiles'
      );
      profilePhoto = uploadResult.url;
    }

    const user = await User.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      city: city || null,
      country: country || null,
      additionalInfo: additionalInfo || null,
      profilePhoto,
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      data: user.toPublicJSON(),
    });
  } catch (error) {
    if (error.code === 11000) {
      const err = new Error('An account with this email already exists.');
      err.statusCode = 409;
      return next(err);
    }
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Body (validated): email, password
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password (it's excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      return next(err);
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      data: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Protected — returns the authenticated user's profile.
 * User identity is read from req.user set by the auth middleware (never from body).
 */
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user.toPublicJSON ? req.user.toPublicJSON() : req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Stateless JWT — the client is responsible for discarding the token.
 */
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully. Please discard your token.',
  });
};
