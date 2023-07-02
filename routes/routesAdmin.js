//routesAdmin.js is the file that contains all the routes for the admin user
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ShoppingList = require('../models/ShoppingList');

// Middleware for verifying token and role checking
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find().populate('shoppingLists');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/admin/shoppinglists
// @desc    Get all shopping lists
// @access  Admin
router.get('/shoppinglists', auth, admin, async (req, res) => {
  try {
    const shoppingLists = await ShoppingList.find();
    res.json(shoppingLists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Include more admin routes as needed...

module.exports = router;
