import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Set default port
const PORT = process.env.PORT || 5000;

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: '*', // Allow all origins for development, can be restricted later
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware (JSON and URLencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connection status helper
const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running...',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    database: getDBStatus()
  });
});

// 404 handler for api routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(`[Server Error] ${err.stack}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Start the server and connect to DB
const startServer = async () => {
  console.log('Starting Calorie Tracker API Server...');
  
  // Try connecting to database
  await connectDB();
  
  // Start listening
  app.listen(PORT, () => {
    console.log(`[Server] Server is running on port ${PORT}`);
    console.log(`[Server] Health check available at http://localhost:${PORT}/api/health`);
  });
};

startServer();
