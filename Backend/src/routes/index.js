import express from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import cityRoutes from './city.routes.js';
import placeRoutes from './place.routes.js';
import tripRoutes from './trip.routes.js';
import tripStopRoutes from './tripStop.routes.js';

const router = express.Router();

// ─── Public routes ───────────────────────────────────────────────────────────
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

// ─── Protected user & trip routes ─────────────────────────────────────────────
router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/stops', tripStopRoutes);

// ─── Travel data routes (public) ─────────────────────────────────────────────
router.use('/cities', cityRoutes);
router.use('/places', placeRoutes);

export default router;
