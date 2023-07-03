// routesAdmin.js

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

// @route   GET api/admin/users/:id/shoppinglist
// @desc    Get user's shopping list
// @access  Admin
router.get('/users/:id/shoppinglist', auth, admin, async (req, res) => {
  try {
    const userId = req.params.id;
    const shoppingList = await ShoppingList.findOne({ user: userId });

    if (!shoppingList) {
      return res.status(404).json({ msg: 'Shopping list not found' });
    }

    res.json(shoppingList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/admin/shoppinglist/:id
// @desc    Update shopping list
// @access  Admin
router.put('/shoppinglist/:id', auth, admin, async (req, res) => {
  try {
    const shoppingListId = req.params.id;
    const shoppingList = await ShoppingList.findById(shoppingListId);

    if (!shoppingList) {
      return res.status(404).json({ msg: 'Shopping list not found' });
    }

    // Add the new items from the request body to the shopping list
    shoppingList.items = req.body.items;

    // Save the updated shopping list
    await shoppingList.save();

    res.json(shoppingList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/admin/users/:id
// @desc    Get a single user
// @access  Admin
router.get('/users/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('shoppingLists');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});


module.exports = router;
