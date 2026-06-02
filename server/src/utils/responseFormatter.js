/**
 * Consistent API response formatters.
 * Every response from the API follows this structure.
 */

export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const createdResponse = (res, data, message = 'Created successfully') => {
  return successResponse(res, data, message, 201);
};

export const paginatedResponse = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};

export const errorResponse = (res, message, statusCode = 400, errorCode = null, details = null) => {
  const response = {
    success: false,
    error: {
      message,
      ...(errorCode && { code: errorCode }),
      ...(details && { details }),
    },
  };
  return res.status(statusCode).json(response);
};
