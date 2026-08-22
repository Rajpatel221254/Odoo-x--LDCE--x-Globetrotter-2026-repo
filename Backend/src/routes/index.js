import express from 'express';
import healthRoutes from './health.routes.js';
import cityRoutes from './city.routes.js';
import placeRoutes from './place.routes.js';

const router = express.Router();

// Mount API routes
router.use('/health', healthRoutes);
router.use('/cities', cityRoutes);
router.use('/places', placeRoutes);

export default router;
