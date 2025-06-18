// Import the jsonwebtoken library, which is used for creating and verifying JSON Web Tokens.
import jwt from 'jsonwebtoken';

/**
 * Generates a JWT, then sets it as a secure, httpOnly cookie in the Express response object.
 * @param {object} res - The Express response object, used to set the cookie.
 * @param {string} userId - The MongoDB user ID, which will be embedded into the token's payload.
 */
const generateToken = (res, userId) => {
  // Create a new JSON Web Token using the sign method.
  const token = jwt.sign(
    // 1. The payload: An object containing the data to be stored in the token.
    // Here, we are encoding the user's unique ID.
    { userId },

    // 2. The secret key: A private key stored in environment variables.
    // This secret is used to sign the token, ensuring its integrity and that it hasn't been tampered with.
    process.env.JWT_SECRET,

    // 3. Options: An object to configure the token, such as its expiration time.
    {
      // The token's lifetime is also read from environment variables (e.g., '30d' for 30 days).
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  // For debugging purposes: logs the generated token to the server-side console.
  console.log(token);

  // Sets the generated token as a cookie on the response object.
  // This will send a 'Set-Cookie' header back to the browser.
  res.cookie('jwt', token, {
    // httpOnly: true - This is a crucial security flag. It prevents the cookie
    // from being accessed by client-side JavaScript (e.g., via document.cookie),
    // which helps mitigate Cross-Site Scripting (XSS) attacks.
    httpOnly: true,

    // secure: true - This flag ensures the cookie is only sent over HTTPS connections.
    // We disable this in the development environment (when NODE_ENV is not 'production')
    // to allow testing on a local server with HTTP.
    secure: process.env.NODE_ENV !== 'development',

    // sameSite: 'strict' - This flag helps prevent Cross-Site Request Forgery (CSRF) attacks.
    // It ensures the cookie is only sent for requests originating from the same site.
    sameSite: 'strict',

    // maxAge: Sets the cookie's expiration date in milliseconds.
    // This calculation represents 30 days: 30 days * 24 hours/day * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second.
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

// Export the function as the default export of this module, so it can be imported and used in other files.
export default generateToken;