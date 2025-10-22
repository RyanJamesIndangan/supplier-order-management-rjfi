const { validationResult } = require('express-validator');
const { ApiError } = require('./errorHandler');

/**
 * Middleware to handle validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value
    }));
    
    throw new ApiError(400, 'Validation failed', errorMessages);
  }
  
  next();
};

module.exports = validate;

