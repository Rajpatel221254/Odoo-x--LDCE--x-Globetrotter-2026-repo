import express from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import cityRoutes from './city.routes.js';
import placeRoutes from './place.routes.js';
import tripRoutes from './trip.routes.js';
import tripStopRoutes from './tripStop.routes.js';
import itineraryRoutes from './itinerary.routes.js';
import expenseRoutes from './expense.routes.js';
import shareRoutes from './share.routes.js';

const router = express.Router();

// ─── Public routes ───────────────────────────────────────────────────────────
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/share', shareRoutes);

// ─── Protected user, trip, itinerary & expense routes ────────────────────────
router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/stops', tripStopRoutes);
router.use('/itinerary', itineraryRoutes);
router.use('/expenses', expenseRoutes);

// ─── Travel data routes (public) ─────────────────────────────────────────────
router.use('/cities', cityRoutes);
router.use('/places', placeRoutes);

export default router;
