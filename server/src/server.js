import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import routes from './routes/index.js'

const app = express();

// Enhanced MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define allowed origins based on environment
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://dev-connect-1-eiz8.onrender.com']  // Production origins
  : [
      'http://localhost:5173',    // Vite default
      'http://127.0.0.1:5173',    // Vite alternative
      'http://localhost:3000',    // Common React port
      'http://localhost:5000',    // Your backend port
      'http://127.0.0.1:5000'     // Alternative backend URL
    ];

// Configure CORS
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json()); 

// Use routes
app.use(routes);

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the Dev.Connect Backend API');
});

// Error handling for CORS
app.use((err, req, res, next) => {
  if (err.message.startsWith('The CORS policy')) {
    return res.status(403).json({
      error: 'CORS Error',
      message: err.message
    });
  }
  next(err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing graceful shutdown');
  mongoose.connection.close();
  process.exit(0);
});