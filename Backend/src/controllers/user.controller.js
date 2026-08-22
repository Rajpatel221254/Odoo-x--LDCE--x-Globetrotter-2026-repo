import path from 'path';
import User from '../models/User.js';
import { uploadImageToImageKit } from '../services/imagekit.service.js';

// Fields that are allowed to be updated
const UPDATABLE_FIELDS = [
  'firstName',
  'lastName',
  'phoneNumber',
  'city',
  'country',
  'additionalInfo',
  'profilePhoto',
];

/**
 * GET /api/users/me
 * Protected — returns the full profile of the authenticated user.
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -__v');
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/me
 * Protected — updates allowed profile fields for the authenticated user.
 * Supports updating fields via JSON or multipart/form-data with profilePhoto file upload.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const updates = {};

    for (const field of UPDATABLE_FIELDS) {
      if (field in req.body) {
        updates[field] = req.body[field];
      }
    }

    // If an image file is attached with the update request, upload it to ImageKit
    if (req.file) {
      const ext = path.extname(req.file.originalname) || '.jpg';
      const fileName = `profile_${req.user._id}_${Date.now()}${ext}`;
      const uploadResult = await uploadImageToImageKit(
        req.file.buffer,
        fileName,
        'globetrotter/profiles'
      );
      updates.profilePhoto = uploadResult.url;
    }

    if (Object.keys(updates).length === 0) {
      const err = new Error('No valid fields provided for update.');
      err.statusCode = 400;
      return next(err);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        select: '-password -__v',
      }
    );

    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
