import express from 'express';
import cors from 'cors';
// import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import jobsRoutes from './routes/api/jobRoutes.js';

const app = express();

app.use(express.json()); 
app.use(cors());

app.use('/api', jobsRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Dev.Connect Backend API ');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
