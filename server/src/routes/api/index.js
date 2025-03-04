import express from 'express';
import jobsRoutes from './jobRoutes.js';
import userRoutes from './userRoutes.js';
import newsRoutes from './newsRoutes.js';
import messageRoutes from './messageRoutes.js'
import privateMessages from './postRoutes.js'

const router = express.Router();

router.use(jobsRoutes);
router.use('/user', userRoutes);
router.use(newsRoutes);
router.use(messageRoutes)
router.use("/private-messages", privateMessages)

export default router;