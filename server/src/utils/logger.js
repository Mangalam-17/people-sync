import winston from 'winston';
import env from '../config/env.js';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom format for development - colorful and readable
const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  // Add emoji icons for better visibility
  const icons = {
    error: '❌',
    warn: '⚠️ ',
    info: '✅',
    debug: '🔍',
    http: '📡',
  };
  
  const icon = icons[level] || '📝';
  let log = `${icon} [${timestamp}] [${level.toUpperCase()}]: ${stack || message}`;
  
  // Add metadata if present
  if (Object.keys(meta).length > 0 && meta.service !== 'peoplesync-api') {
    log += `\n   ${JSON.stringify(meta, null, 2)}`;
  }
  
  return log;
});

// Custom format for production - JSON for log aggregation
const prodFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  json()
);

// Create the logger
const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  defaultMeta: { service: 'peoplesync-api' },
  transports: [],
});

// Development: Colorful console output
if (env.NODE_ENV === 'development') {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize({ 
          all: true,
          colors: {
            error: 'bold red',
            warn: 'bold yellow',
            info: 'bold green',
            debug: 'bold blue',
            http: 'bold magenta',
          }
        }),
        timestamp({ format: 'HH:mm:ss' }),
        devFormat
      ),
    })
  );
}

// Production: JSON logs to files
if (env.NODE_ENV === 'production') {
  // Error logs
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: prodFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  
  // Combined logs
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: prodFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  
  // Console in production (for PM2/Docker logs)
  logger.add(
    new winston.transports.Console({
      format: prodFormat,
    })
  );
}

// Create a stream object for Morgan integration
logger.stream = {
  write: (message) => {
    // Remove trailing newline and log as HTTP level
    logger.http(message.trim());
  },
};

export default logger;
