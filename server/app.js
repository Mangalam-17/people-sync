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

/* ==================================================
   SECURITY
================================================== */

app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  'https://people-sync-navy.vercel.app',
  env.CLIENT_URL,
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman, curl, mobile apps, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/* ==================================================
   BODY PARSING
================================================== */

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

/* ==================================================
   REQUEST LOGGING
================================================== */

if (env.NODE_ENV === 'development') {
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
      {
        stream: logger.stream,
      }
    )
  );
} else {
  app.use(
    morgan('combined', {
      stream: logger.stream,
    })
  );
}

/* ==================================================
   HEALTH CHECK
================================================== */

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'PeopleSync API',
    version: '1.0.0',
    environment: env.NODE_ENV,
    status: 'running',
  });
});

/* ==================================================
   RATE LIMITING
================================================== */

app.use('/api/', apiLimiter);

/* ==================================================
   API ROUTES
================================================== */

app.use('/api/v1', routes);

/* ==================================================
   404 HANDLER
================================================== */

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

/* ==================================================
   GLOBAL ERROR HANDLER
================================================== */

app.use(errorHandler);

export default app;