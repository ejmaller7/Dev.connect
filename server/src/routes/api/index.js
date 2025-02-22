import express from 'express';
import jobsRoutes from './jobRoutes.js';
import userRoutes from './userRoutes.js';
import newsRoutes from './newsRoutes.js';
import messageRoutes from './messageRoutes.js'

const router = express.Router();

router.use(jobsRoutes);
router.use(userRoutes);
router.use(newsRoutes);
router.use(messageRoutes)

export default router;