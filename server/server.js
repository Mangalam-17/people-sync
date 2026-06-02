import app from './app.js';
import env from './src/config/env.js';
import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(env.PORT, () => {
      logger.info(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║   🚀  PeopleSync API Server                   ║
  ║                                               ║
  ║   Port:    ${String(env.PORT).padEnd(35)}║
  ║   Mode:    ${String(env.NODE_ENV).padEnd(35)}║
  ║   Health:  http://localhost:${env.PORT}/api/v1/health   ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 10s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Rejection:', err);
      gracefulShutdown('unhandledRejection');
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      gracefulShutdown('uncaughtException');
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
