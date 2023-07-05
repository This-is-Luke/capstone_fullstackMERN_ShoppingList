//auth.js

/*
This is the middleware for authentication. It will check for a token and verify it.
*/

// import jwt
const jwt = require('jsonwebtoken');
require('dotenv').config(); // import dotenv and call config() to use environment variables

// middleware function
module.exports = function(req, res, next) {
  console.log('Auth middleware - Start');

  // Skip authentication for GET /me/shoppinglist route, this is for debugging purposes
  if (req.originalUrl === '/me/shoppinglist' && req.method === 'GET') {
    console.log('Auth middleware - Skip authentication for GET /me/shoppinglist route');
    return next();
  }

  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    console.log('Auth middleware - No token');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    console.log('Auth middleware - Verifying token:', token); // debugging
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token
    console.log('Auth middleware - Decoded:', decoded);
    req.user = { // add the user to the request
      _id: decoded._id, 
      isAdmin: decoded.isAdmin
    };
    next(); // call next() to continue with the next middleware
  } catch (err) { // if an error occurs
    console.error('Auth middleware - Error:', err);
    res.status(401).json({ msg: 'Token is not valid' }); // send a 401 response with the error message
  }

  console.log('Auth middleware - End');
};
