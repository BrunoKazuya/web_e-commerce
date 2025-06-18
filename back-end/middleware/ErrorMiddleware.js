// src/middleware/errorMiddleware.js (Documented)

/**
 * Middleware to handle requests for routes that do not exist (404 Not Found).
 * This should be placed after all other routes in server.js.
 */
const notFound = (req, res, next) => {
  // Create a new Error object with a helpful message indicating the non-existent URL.
  const error = new Error(`Not Found - ${req.originalUrl}`);
  // Set the response status code to 404.
  res.status(404);
  // Pass the error object to the next middleware in line, which will be our main errorHandler.
  next(error);
};

/**
 * Centralized error handler middleware for the Express application.
 * It catches all errors thrown by route handlers and formats a standard JSON response.
 * Note the special signature with four arguments (err, req, res, next).
 */
const errorHandler = (err, req, res, next) => {
  // Determine the status code for the response.
  // If the status code is still 200 (OK) but an error was thrown, default to 500 (Internal Server Error).
  // Otherwise, use the status code that was already set (e.g., 401, 403, 404).
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  // Get the message from the error object.
  let message = err.message;

  // Specific check for Mongoose CastError, which occurs with a badly formatted ObjectId.
  // Instead of a generic 500 error, we'll treat it as a 404 Not Found for a better user experience.
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Send the final, formatted JSON error response to the client.
  res.status(statusCode).json({
    message: message,
    // Include the error stack trace only when not in production for debugging purposes.
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// Export both middleware functions.
export { notFound, errorHandler };