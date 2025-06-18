// Import jsonwebtoken to verify the authenticity of the token.
import jwt from 'jsonwebtoken';
// Import express-async-handler to automatically handle exceptions in async functions and pass them to the error middleware.
import asyncHandler from 'express-async-handler';
// Import the User model to fetch user data from the database.
import User from '../models/user.js';

/**
 * Middleware to protect routes that require a user to be logged in.
 * It verifies the JWT token sent in the httpOnly cookie.
 */
const protect = asyncHandler(async (req, res, next) => {
  // Declare a variable to hold the token.
  let token;

  // Read the JWT from the 'jwt' cookie sent by the browser.
  token = req.cookies.jwt;

  // Check if a token exists.
  if (token) {
    try {
      // Verify the token using the secret key stored in environment variables.
      // This will throw an error if the token is invalid or expired.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // If verification is successful, use the user ID from the token's payload to find the user in the database.
      // We exclude the password from the returned user object for security.
      req.user = await User.findById(decoded.userId).select('-password');
      
      // If the user is found, pass control to the next middleware or route handler.
      next();
    } catch (error) {
      // If token verification fails (e.g., invalid signature, expired),
      // set the status to 401 (Unauthorized) and throw an error.
      res.status(401);
      throw new Error('Not authorized, token failed.');
    }
  } else {
    // If no token is found in the cookies, the user is not authenticated.
    // Set the status to 401 (Unauthorized) and throw an error.
    res.status(401);
    throw new Error('Not authorized, no token.');
  }
});

/**
 * Middleware to restrict routes to admin users only.
 * This middleware should be used AFTER the 'protect' middleware.
 */
const admin = (req, res, next) => {
  // Check if a user object was attached to the request by the 'protect' middleware AND if that user has the 'admin' role.
  if (req.user && req.user.role === 'admin') {
    // If the user is an admin, pass control to the next handler.
    next();
  } else {
    // If the user is not an admin, set the status to 403 (Forbidden) and throw an error.
    res.status(403);
    throw new Error('Not authorized as an administrator.');
  }
};

// Export the 'protect' and 'admin' middleware functions to be used in route files.
export { protect, admin };