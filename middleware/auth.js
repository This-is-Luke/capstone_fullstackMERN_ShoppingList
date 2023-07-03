const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
  console.log('Auth middleware - Start');

  // Skip authentication for GET /me/shoppinglist route
  if (req.originalUrl === '/me/shoppinglist' && req.method === 'GET') {
    console.log('Auth middleware - Skip authentication for GET /me/shoppinglist route');
    return next();
  }

  const token = req.header('x-auth-token');

  if (!token) {
    console.log('Auth middleware - No token');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    console.log('Auth middleware - Verifying token:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Decoded:', decoded);
    req.user = {
      _id: decoded._id,
      isAdmin: decoded.isAdmin
    };
    next();
  } catch (err) {
    console.error('Auth middleware - Error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }

  console.log('Auth middleware - End');
};
