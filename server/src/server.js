import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import routes from './routes/index.js'

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(express.json()); 
app.use(cors({ origin: ['https://dev-connect-1-eiz8.onrender.com','http://localhost:5173', 'http://127.0.0.1:5173'] }));

app.use(routes)

app.get('/', (req, res) => {
  res.send('Welcome to the Dev.Connect Backend API ');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));