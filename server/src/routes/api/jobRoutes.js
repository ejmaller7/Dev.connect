import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getRemoteJobs, getOnSiteJobs, getAllJobs } from '../../controllers/jobController.js';

dotenv.config();

const router = express.Router();

router.use(cors());

router.get('/remote-jobs', getRemoteJobs);
router.get('/onsite-jobs', getOnSiteJobs);
router.get('/jobs', getAllJobs);

export default router;
