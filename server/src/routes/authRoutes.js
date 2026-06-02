import { Router } from 'express';
import authController from '../controllers/authController.js';
import authenticate from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import { authLimiter, strictLimiter } from '../middlewares/rateLimiter.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/authValidator.js';

const router = Router();

// Public routes
router.post('/register', strictLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authLimiter, authController.refresh);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', strictLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password/:token', strictLimiter, validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.get('/me', authenticate, authController.me);
router.post('/logout', authenticate, authController.logout);

export default router;
