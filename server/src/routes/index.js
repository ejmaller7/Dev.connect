import express from 'express';
import apiRoutes from './api/index.js';

const router = express.Router();

// Combine all API routes under '/api' prefix
router.use('/api', apiRoutes);

export default router;
