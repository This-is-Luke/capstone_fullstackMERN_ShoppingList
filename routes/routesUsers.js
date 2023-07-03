//routesUsers.js is the file that contains all the routes for the user
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middleware/auth');
const ShoppingList = require('../models/ShoppingList');

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

    console.log('POST / - Creating new shopping list for user');
    const newShoppingList = new ShoppingList({
      user: user._id,
      items: [] // start with an empty list
    });

    console.log('POST / - Saving shopping list');
    await newShoppingList.save();

    console.log('POST / - Adding shopping list to user');
    user.shoppingLists.push(newShoppingList._id); // add the shopping list's ID to the user's shoppingLists array

    console.log('POST / - Saving user');
    await user.save();

    console.log('POST / - Generating token');
    const token = user.generateAuthToken();
    res.json({ msg: 'User registered, shopping list created, and token generated', token });
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
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User password:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('isMatch:', isMatch);

    if (!isMatch) {
      console.log('POST /auth - Invalid password');
      return res.status(400).json({ msg: 'Invalid Credentials', error: 'Invalid Credentials' });
    }

    console.log('POST /auth - Generating token');
    const token = user.generateAuthToken();

    // Remove the password from the user object before sending it in the response
    user = user.toObject();
    delete user.password;

    res.json({ msg: 'User authenticated and token generated', token, user });
  } catch (err) {
    console.error('POST /auth - Error:', err);
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

router.put('/me/shoppinglists/:id', auth, async (req, res) => {
  console.log('PUT /me/shoppinglists/:id - Start');
  try {
    console.log('PUT /me/shoppinglists/:id - Finding shopping list');
    let shoppingList = await ShoppingList.findOne({ _id: req.params.id, user: req.user._id });

    if (!shoppingList) {
      console.log(`PUT /me/shoppinglists/:id - Shopping list not found ${req.params.id}`);
      return res.status(404).json({ msg: 'Shopping list not found', error: 'Shopping list not found' });
    }

    console.log('PUT /me/shoppinglists/:id - Updating shopping list');
    shoppingList.items = req.body.items; // update the items in the shopping list
    shoppingList = await shoppingList.save();

    res.json({ msg: 'Shopping list updated', shoppingList });
  } catch (err) {
    console.error('PUT /me/shoppinglists/:id - Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
  console.log('PUT /me/shoppinglists/:id - End');
});

router.get('/me/shoppinglist', auth, async (req, res) => {
  console.log('GET /me/shoppinglist - Start');
  try {
    console.log('GET /me/shoppinglist - Finding shopping list');
    const shoppingList = await ShoppingList.findOne({ user: req.user._id });

    if (!shoppingList) {
      console.log('GET /me/shoppinglist - Shopping list not found');
      return res.status(404).json({ msg: 'Shopping list not found', error: 'Shopping list not found' });
    }

    res.json({ msg: 'Shopping list found', shoppingList });
  } catch (err) {
    console.error('GET /me/shoppinglist - Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
  console.log('GET /me/shoppinglist - End');
});

router.delete('/me/shoppinglists/:id', auth, async (req, res) => {
  console.log('DELETE /me/shoppinglists/:id - Start');
  try {
    console.log('DELETE /me/shoppinglists/:id - Finding shopping list');
    let shoppingList = await ShoppingList.findOne({ _id: req.params.id, user: req.user._id });

    if (!shoppingList) {
      console.log('DELETE /me/shoppinglists/:id - Shopping list not found');
      return res.status(404).json({ msg: 'Shopping list not found', error: 'Shopping list not found' });
    }

    console.log('DELETE /me/shoppinglists/:id - Removing item from shopping list');
    const itemIndex = shoppingList.items.findIndex(item => item._id.toString() === req.body.itemId);
    if (itemIndex === -1) {
      console.log('DELETE /me/shoppinglists/:id - Item not found in shopping list');
      return res.status(404).json({ msg: 'Item not found in shopping list', error: 'Item not found in shopping list' });
    }
    shoppingList.items.splice(itemIndex, 1); // remove the item from the shopping list
    shoppingList = await shoppingList.save();

    res.json({ msg: 'Item removed from shopping list', shoppingList });
  } catch (err) {
    console.error('DELETE /me/shoppinglists/:id - Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
  console.log('DELETE /me/shoppinglists/:id - End');
});


module.exports = router;
