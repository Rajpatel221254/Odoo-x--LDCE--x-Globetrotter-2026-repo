import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse incoming URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', apiRoutes);

// Catch-all 404 handler for unhandled routes
app.use(notFoundHandler);

// Global error-handling middleware
app.use(errorHandler);

export default app;
