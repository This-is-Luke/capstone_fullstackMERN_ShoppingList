//routesUsers.js is the file that contains all the routes for the user
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middleware/auth');

const User = require('../models/User');


router.post('/', async (req, res) => {
  console.log('POST / - Start');
  const { name, email, password, isAdmin } = req.body;

  try {
    console.log('POST / - Checking if user exists');
    let user = await User.findOne({ email });
    if (user) {
      console.log('POST / - User exists');
      return res.status(400).json({ msg: 'User already exists', error: 'User already exists' });
    }

    console.log('POST / - Creating new user');
    user = new User({
      name,
      email,
      password,
      isAdmin
    });

    console.log('POST / - Hashing password');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    console.log('POST / - Saving user');
    await user.save();

    console.log('POST / - Generating token');
    const token = user.generateAuthToken();
    res.json({ msg: 'User registered and token generated', token });
  } catch (err) {
    console.error('POST / - Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
  console.log('POST / - End');
});

router.post('/auth', async (req, res) => {
  console.log('POST /auth - Start');
  const { email, password } = req.body;

  try {
    console.log('POST /auth - Checking if user exists');
    let user = await User.findOne({ email });
    if (!user) {
      console.log('POST /auth - User does not exist');
      return res.status(400).json({ msg: 'Invalid Credentials', error: 'Invalid Credentials' });
    }

    console.log('POST /auth - Checking password');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('POST /auth - Invalid password');
      return res.status(400).json({ msg: 'Invalid Credentials', error: 'Invalid Credentials' });
    }

    console.log('POST /auth - Generating token');
    const token = user.generateAuthToken();

    // Remove the password from the user object before sending it in the response
    user = user.toObject();
    delete user.password;

    res.json({ msg: 'User authenticated and token generated', token, user }); // include user in the response
  } catch (err) {
    console.error('POST /auth - Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
  console.log('POST /auth - End');
});
router.post('/me/shoppinglists', auth, async (req, res) => {
  console.log('POST /me/shoppinglists - Start');
  try {
    console.log('POST /me/shoppinglists - Creating new shopping list');
    const newShoppingList = new ShoppingList({
        user: req.user._id,  // Changed from req.user.id to req.user._id
        items: req.body.items // assuming the shopping list is just an array of items
    });

    console.log('POST /me/shoppinglists - Saving shopping list');
    const shoppingList = await newShoppingList.save();
    
    res.json({ msg: 'Shopping list created', shoppingList });
  } catch (err) {
    console.error('POST /me/shoppinglists - Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
  console.log('POST /me/shoppinglists - End');
});


module.exports = router;
