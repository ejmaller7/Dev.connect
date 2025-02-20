import express from 'express';
import jobsRoutes from './jobRoutes.js';
import userRoutes from './userRoutes.js';
import newsRoutes from './newsRoutes.js';

const router = express.Router();

router.use(jobsRoutes);
router.use(userRoutes);
router.use(newsRoutes);

export default router;