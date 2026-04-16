const { validationResult } = require('express-validator');

/**
 * Wraps async route handlers to catch errors and pass to error middleware.
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Returns 400 with validation errors if express-validator found issues.
 * Call in route: const err = validateRequest(req); if (err) return err;
 */
function validateRequest(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
}

/**
 * 404 handler for unknown routes (mount after all routes).
 */
function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}

/**
 * Global error handler. Logs error and sends 500.
 */
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
}

module.exports = {
  asyncHandler,
  validateRequest,
  notFound,
  errorHandler,
};
