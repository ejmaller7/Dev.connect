import express from 'express';
import jobsRoutes from './api/jobRoutes.js';
import userRoutes from './api/userRoutes.js';
import newsRoutes from './api/newsRoutes.js';

const router = express.Router();

// Combine all API routes under '/api' prefix
router.use(jobsRoutes);
router.use(userRoutes);
router.use(newsRoutes);

export default router;
