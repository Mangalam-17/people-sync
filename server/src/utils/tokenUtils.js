import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import env from '../config/env.js';

/**
 * Generate a JWT access token.
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
};

/**
 * Generate a JWT refresh token.
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
};

/**
 * Verify an access token.
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

/**
 * Verify a refresh token.
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};

/**
 * Hash a token using SHA-256 (for storing refresh tokens securely).
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generate a random token for email verification / password reset.
 */
export const generateRandomToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hashedToken };
};

/**
 * Parse JWT expiry string to milliseconds.
 * Supports: '15m', '1h', '7d'
 */
export const parseExpiryToMs = (expiryStr) => {
  const units = { m: 60000, h: 3600000, d: 86400000 };
  const match = expiryStr.match(/^(\d+)([mhd])$/);
  if (!match) throw new Error(`Invalid expiry format: ${expiryStr}`);
  return parseInt(match[1]) * units[match[2]];
};

/**
 * Set refresh token as HttpOnly cookie.
 */
export const setRefreshTokenCookie = (res, token) => {
  const maxAge = parseExpiryToMs(env.JWT_REFRESH_EXPIRES_IN);
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge,
    path: '/api/v1/auth',
  });
};

/**
 * Clear refresh token cookie.
 */
export const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/api/v1/auth',
  });
};
