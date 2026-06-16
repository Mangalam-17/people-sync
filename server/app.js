import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import env from './src/config/env.js';
import routes from './src/routes/index.js';
import errorHandler from './src/middlewares/errorHandler.js';
import { apiLimiter } from './src/middlewares/rateLimiter.js';
import logger from './src/utils/logger.js';

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

// --- HTTP Request Logging (Morgan + Winston) ---
if (env.NODE_ENV === 'development') {
  // Custom Morgan format for development with colors and emojis
  morgan.token('status-emoji', (req, res) => {
    const status = res.statusCode;
    if (status >= 500) return '💥';
    if (status >= 400) return '⚠️';
    if (status >= 300) return '🔄';
    if (status >= 200) return '✅';
    return '📡';
  });

  app.use(
    morgan(
      ':status-emoji :method :url :status :response-time ms - :res[content-length]',
      { stream: logger.stream }
    )
  );
} else {
  // Production: Standard combined format
  app.use(morgan('combined', { stream: logger.stream }));
}

// --- Rate Limiting ---
app.use('/api/', apiLimiter);

// --- API Routes ---
app.use('/api/v1', routes);

// --- 404 ---
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
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
