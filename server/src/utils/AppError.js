/**
 * Custom application error class with HTTP status code and error code.
 * Extends native Error for consistent error handling across the app.
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errorCode) {
    return new AppError(message, 400, errorCode);
  }

  static unauthorized(message = 'Unauthorized', errorCode = 'AUTH_001') {
    return new AppError(message, 401, errorCode);
  }

  static forbidden(message = 'Forbidden', errorCode = 'AUTH_003') {
    return new AppError(message, 403, errorCode);
  }

  static notFound(message = 'Resource not found', errorCode = 'NOT_FOUND') {
    return new AppError(message, 404, errorCode);
  }

  static conflict(message, errorCode = 'CONFLICT') {
    return new AppError(message, 409, errorCode);
  }

  static tooMany(message = 'Too many requests', errorCode = 'RATE_LIMIT') {
    return new AppError(message, 429, errorCode);
  }

  static internal(message = 'Internal server error', errorCode = 'INTERNAL') {
    return new AppError(message, 500, errorCode);
  }
}

export default AppError;
