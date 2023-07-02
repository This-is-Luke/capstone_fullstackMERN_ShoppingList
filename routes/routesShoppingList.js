//routesShoppingList.js is the file that contains all the routes for the shopping list
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ShoppingList = require('../models/ShoppingList');
const User = require('../models/User');


router.post('/', auth, async (req, res) => {
  console.log('POST / - Start');
  try {
    console.log('POST / - Creating new shopping list');
    const newShoppingList = new ShoppingList({
      user: req.user.id,
      items: req.body.items
    });

    console.log('POST / - Saving shopping list');
    const shoppingList = await newShoppingList.save();

    console.log('POST / - Adding shopping list to user');
    await User.updateOne(
      { _id: req.user.id },
      { $push: { shoppingLists: shoppingList._id } }
    );

    console.log('POST / - Shopping list saved');
    res.json(shoppingList);
  } catch (err) {
    console.error('POST / - Error:', err.message);
    res.status(500).send('Server Error');
  }
  console.log('POST / - End');
});

router.get('/', auth, async (req, res) => {
  try {
    console.log('GET / - Start');
    const shoppingLists = await ShoppingList.find({ user: req.user });
    console.log('GET / - Shopping lists found');
    res.json({ msg: 'Shopping lists found', shoppingLists });
  } catch (err) {
    console.error('GET / - Error:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
  console.log('GET / - End');
});

router.put('/:id', auth, async (req, res) => {
  console.log('PUT /:id - Start');
  try {
    console.log('PUT /:id - Finding shopping list');
    const shoppingList = await ShoppingList.findById(req.params.id);

    if (!shoppingList) {
      console.log('PUT /:id - Shopping list not found');
      return res.status(404).json({ msg: 'Shopping list not found', error: 'Shopping list not found' });
    }

    if (!shoppingList.user) {
      console.error('PUT /:id - Error: Shopping list has no user');
      return res.status(500).json({ msg: 'Server error', error: 'Shopping list has no user' });
    } else if (shoppingList.user.toString() !== req.user) {
      console.log('PUT /:id - User not authorized');
      return res.status(401).json({ msg: 'User not authorized', error: 'User not authorized' });
    }

    console.log('PUT /:id - Appending new item to shopping list');
    const newItem = {
      name: req.body.items[0].name,
      quantity: req.body.items[0].quantity
    };
    shoppingList.items.push(newItem);
    await shoppingList.save();

    res.json({ msg: 'Shopping list updated', shoppingList });
  } catch (err) {
    console.error('PUT /:id - Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
  console.log('PUT /:id - End');
});


router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('DELETE /:id - Start');
    const shoppingList = await ShoppingList.findById(req.params.id);

    if (!shoppingList) {
      console.log('DELETE /:id - Shopping list not found');
      return res.status(404).json({ msg: 'Shopping list not found' });
    }

    if (shoppingList.user.toString() !== req.user.id) {
      console.log('DELETE /:id - User not authorized');
      return res.status(401).json({ msg: 'User not authorized' });
    }

    console.log('DELETE /:id - Removing shopping list');
    await shoppingList.remove();
    console.log('DELETE /:id - Shopping list removed');
    res.json({ msg: 'Shopping list removed' });
  } catch (err) {
    console.error('DELETE /:id - Error:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
  console.log('DELETE /:id - End');
});

router.delete('/:id/:itemId', auth, async (req, res) => {
  try {
    console.log('DELETE /:id/:itemId - Start');
    const shoppingList = await ShoppingList.findById(req.params.id);

    if (!shoppingList) {
      console.log('DELETE /:id/:itemId - Shopping list not found');
      return res.status(404).json({ msg: 'Shopping list not found' });
    }

    if (shoppingList.user.toString() !== req.user) {
      console.log('DELETE /:id/:itemId - User not authorized');
      return res.status(401).json({ msg: 'User not authorized' });
    }

    console.log('DELETE /:id/:itemId - Finding item');
    const item = shoppingList.items.find(item => item.id === req.params.itemId);

    if (!item) {
      console.log('DELETE /:id/:itemId - Item not found');
      return res.status(404).json({ msg: 'Item not found' });
    }

    console.log('DELETE /:id/:itemId - Removing item');
    shoppingList.items = shoppingList.items.filter(item => item.id !== req.params.itemId);
    await shoppingList.save();
    console.log('DELETE /:id/:itemId - Item removed');
    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error('DELETE /:id/:itemId - Error:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
  console.log('DELETE /:id/:itemId - End');
});


module.exports = router;
