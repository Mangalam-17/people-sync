import authService from '../services/authService.js';
import { successResponse, createdResponse } from '../utils/responseFormatter.js';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/tokenUtils.js';

class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body, {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      return createdResponse(res, {
        user: result.user,
        tenant: result.tenant,
      }, 'Registration successful. Please check your email to verify your account.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  async login(req, res, next) {
    try {
      const result = await authService.login(req.body, {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      // Set refresh token in HttpOnly cookie
      setRefreshTokenCookie(res, result.refreshToken);

      return successResponse(res, {
        accessToken: result.accessToken,
        user: result.user,
      }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   */
  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: { code: 'AUTH_NO_REFRESH', message: 'No refresh token provided' },
        });
      }

      const result = await authService.refreshTokens(refreshToken, {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      // Set new refresh token cookie
      setRefreshTokenCookie(res, result.refreshToken);

      return successResponse(res, {
        accessToken: result.accessToken,
        user: result.user,
      }, 'Token refreshed');
    } catch (error) {
      clearRefreshTokenCookie(res);
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout
   */
  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      await authService.logout(refreshToken, req.user.userId, {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      clearRefreshTokenCookie(res);

      return successResponse(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/verify-email/:token
   */
  async verifyEmail(req, res, next) {
    try {
      const result = await authService.verifyEmail(req.params.token, {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      return successResponse(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const result = await authService.forgotPassword(req.body.email, {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      return successResponse(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/reset-password/:token
   */
  async resetPassword(req, res, next) {
    try {
      const result = await authService.resetPassword(
        req.params.token,
        req.body.password,
        {
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
        }
      );

      return successResponse(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  async me(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.userId);
      return successResponse(res, { user });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
