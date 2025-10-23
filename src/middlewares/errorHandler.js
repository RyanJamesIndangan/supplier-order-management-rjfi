/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
};

/**
 * Global error handler with enhanced user-friendly messages
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // User-friendly error messages for common status codes
  const friendlyMessages = {
    400: 'Bad Request - Please check your input data',
    401: 'Unauthorized - Please login to access this resource',
    403: 'Forbidden - You do not have permission to perform this action',
    404: 'Not Found - The requested resource does not exist',
    409: 'Conflict - This resource already exists',
    413: 'File Too Large - Maximum file size is 10MB',
    415: 'Unsupported Media Type - Please upload Excel or CSV files only',
    422: 'Validation Error - Please check the provided data',
    429: 'Too Many Requests - Please try again later',
    500: 'Internal Server Error - Something went wrong on our end',
    502: 'Bad Gateway - External service is unavailable',
    503: 'Service Unavailable - The service is temporarily down',
    504: 'Gateway Timeout - The request took too long to process'
  };

  // Build enhanced response
  const response = {
    success: false,
    status: statusCode,
    message: message,
    error: {
      code: err.code || `ERR_${statusCode}`,
      type: err.name || 'Error',
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    },
    ...(err.errors && { validationErrors: err.errors })
  };

  // Add helpful hints for common errors
  if (statusCode === 400 && req.body) {
    response.hint = 'Check that all required fields are provided and in the correct format';
  }
  if (statusCode === 404) {
    response.hint = 'Verify that the resource ID exists. Check /docs for available endpoints';
  }
  if (statusCode === 415) {
    response.hint = 'Supported formats: .xlsx, .xls, .csv';
  }
  if (statusCode === 413) {
    response.hint = 'Please reduce your file size or split into multiple smaller files';
  }
  if (statusCode === 500) {
    response.hint = 'If this persists, please contact support with the error timestamp';
  }

  // Include stack trace and details in development mode
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.debugInfo = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers
    };
  }

  // Log error for monitoring
  console.error(`[ERROR] ${statusCode} - ${message}`);
  console.error(`  Path: ${req.method} ${req.originalUrl}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json(response);
};

module.exports = {
  ApiError,
  errorHandler,
  notFoundHandler
};

