import { verifyAccessToken } from '../utils/tokenUtils.js';
import AppError from '../utils/AppError.js';

/**
 * Authentication middleware.
 * Extracts and verifies JWT from Authorization header.
 * Attaches decoded user info to req.user.
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Access token is required', 'AUTH_NO_TOKEN');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    req.user = {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(AppError.unauthorized('Access token has expired', 'AUTH_TOKEN_EXPIRED'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(AppError.unauthorized('Invalid access token', 'AUTH_TOKEN_INVALID'));
    }
    next(error);
  }
};

export default authenticate;
