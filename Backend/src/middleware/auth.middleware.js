import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect middleware — verifies the JWT from the Authorization header.
 *
 * Expects:  Authorization: Bearer <token>
 *
 * On success: attaches the authenticated user document to req.user
 * On failure: passes a 401 error to the global error handler
 */
export const protect = async (req, res, next) => {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new Error('Access denied. No token provided.');
      err.statusCode = 401;
      return next(err);
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      const err = new Error(
        jwtError.name === 'TokenExpiredError'
          ? 'Token has expired. Please log in again.'
          : 'Invalid token. Please log in again.'
      );
      err.statusCode = 401;
      return next(err);
    }

    // 3. Load user from DB (confirm user still exists)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      const err = new Error('User no longer exists.');
      err.statusCode = 401;
      return next(err);
    }

    // 4. Attach to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
