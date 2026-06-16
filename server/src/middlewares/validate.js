import { errorResponse } from '../utils/responseFormatter.js';

/**
 * Generic Zod validation middleware.
 * Validates `req.body` against the provided schema.
 */
export const validate = (schema) => (req, res, next) => {
  console.log('Validating request body:', JSON.stringify(req.body, null, 2));
  const result = schema.safeParse(req.body);

  if (!result.success) {
    console.log('Validation failed:', result.error.errors);
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return errorResponse(res, 'Validation failed', 422, 'VALIDATION_ERROR', errors);
  }

  req.body = result.data;
  next();
};

/**
 * Validate query parameters.
 */
export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return errorResponse(res, 'Invalid query parameters', 422, 'VALIDATION_ERROR', errors);
  }

  req.query = result.data;
  next();
};

/**
 * Validate URL parameters.
 */
export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return errorResponse(res, 'Invalid URL parameters', 422, 'VALIDATION_ERROR', errors);
  }

  req.params = result.data;
  next();
};
