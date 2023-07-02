//admin.js is the file that contains the middleware for checking if the user is an admin
module.exports = function(req, res, next) {
  console.log('Admin middleware - Start');
  console.log('Admin middleware - isAdmin type:', typeof req.user.isAdmin);
  console.log('Admin middleware - isAdmin value:', req.user.isAdmin);
  // Check if the user object exists and if the isAdmin property is true
  if (!req.user || !req.user.isAdmin) {
      console.log('Admin middleware - User is not an admin');
      return res.status(403).json({ msg: 'Access denied' });
  }
  console.log('Admin middleware - User is an admin');
  next();
  console.log('Admin middleware - End');
};
