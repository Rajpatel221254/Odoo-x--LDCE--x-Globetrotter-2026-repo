import express from 'express';
import healthRoutes from './health.routes.js';

const router = express.Router();

// Mount health routes
router.use('/health', healthRoutes);

export default router;
