/**
 * @file server.js
 * @description Entry point for the FinanceFlow Backend API.
 * Configures Express, middleware, security, and routes.
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import { seedDefaultCategories } from './utils/seedCategories.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import budgetRoutes from './routes/budget.routes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Database Connection
// Triggering deployment with updated IAM permissions
connectDB().then(() => {
  logger.info('MongoDB Connected Successfully');
  // Seed initial data like default transaction categories
  seedDefaultCategories();
});

const app = express();

/**
 * Global Middleware Configuration
 */

// Body parsing middleware (JSON and URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * Security Middleware
 */

// Sanitize NoSQL queries to prevent injection attacks
app.use(mongoSanitize());

// Set security-related HTTP headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate Limiting: Prevent brute-force and DDoS by limiting requests per IP
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

/**
 * Static Asset Serving
 */
app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')));

/**
 * Route Mounting
 */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/budgets', budgetRoutes);

/**
 * API Health Check
 * Useful for monitoring and automated deployment checks.
 */
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Global Error Handling Middleware
 * Catch-all for any errors thrown in routes or controllers.
 */
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

/**
 * Process-wide Error Handling
 */
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection Error: ${err.message}`);
  // Gracefully close server & exit process on critical errors
  server.close(() => process.exit(1));
});
