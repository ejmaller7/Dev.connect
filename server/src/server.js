import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import jobsRoutes from './routes/api/jobRoutes.js';
import userRoutes from './routes/api/userRoutes.js';
import newsRoutes from './routes/api/newsRoutes.js';

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(express.json()); 
app.use(cors());

app.use('/api', jobsRoutes);
app.use('/api', userRoutes);
app.use('/api', newsRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to the Dev.Connect Backend API ');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
