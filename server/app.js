import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import env from './src/config/env.js';
import routes from './src/routes/index.js';
import errorHandler from './src/middlewares/errorHandler.js';
import { apiLimiter } from './src/middlewares/rateLimiter.js';

const app = express();

// --- Security ---
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// --- Parsing ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// --- Logging ---
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// --- Rate Limiting ---
app.use('/api/', apiLimiter);

// --- API Routes ---
app.use('/api/v1', routes);

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
});

// --- Error Handler ---
app.use(errorHandler);

export default app;
