// routesAdmin.js
/*
In this file we create routes for the admin to view all users and view a user's shopping list.
*/
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
		// try to find all users and populate the shoppingLists field
		const users = await User.find().populate('shoppingLists');
		res.json(users);
	} catch (err) {
		// error handling
		console.error(err.message);
		res.status(500).send('Server error'); // server error
	}
});

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------

// @route   GET api/admin/users/:id/shoppinglist
// @desc    Get user's shopping list
// @access  Admin
router.get('/users/:id/shoppinglist', auth, admin, async (req, res) => {
	try {
		// try to find the user's shopping list
		const userId = req.params.id;
		const shoppingList = await ShoppingList.findOne({ user: userId }); // find the shopping list by the user id

		// If the shopping list doesn't exist
		if (!shoppingList) {
			return res.status(404).json({ msg: 'Shopping list not found' }); // return a 404 not found
		}

		// If the shopping list exists
		res.json(shoppingList); // return the shopping list
	} catch (err) {
		// error handling
		console.error(err.message); // log the error message
		res.status(500).send('Server error'); // server error
	}
});

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------

// @route   PUT api/admin/shoppinglist/:id
// @desc    Update shopping list
// @access  Admin
router.put('/shoppinglist/:id', auth, admin, async (req, res) => {
	try {
		// try to find the shopping list
		const shoppingListId = req.params.id; // get the shopping list id from the request parameters
		const shoppingList = await ShoppingList.findById(shoppingListId); // find the shopping list by the id

		// If the shopping list doesn't exist
		if (!shoppingList) {
			return res.status(404).json({ msg: 'Shopping list not found' }); // return a 404 not found
		}

		// Add the new items from the request body to the shopping list
		shoppingList.items = req.body.items;

		// Save the updated shopping list
		await shoppingList.save();

		// Return the updated shopping list
		res.json(shoppingList);
	} catch (err) {
		// error handling
		console.error(err.message);
		res.status(500).send('Server error'); // server error
	}
});

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------

// @route   GET api/admin/users/:id
// @desc    Get a single user
// @access  Admin
router.get('/users/:id', auth, admin, async (req, res) => {
	try {
		// try to find the user by the id and populate the shoppingLists field
		const user = await User.findById(req.params.id).populate('shoppingLists');
    // If the user doesn't exist
		if (!user) {
			return res.status(404).json({ msg: 'User not found' });// return a 404 not found
		}
    // If the user exists
		res.json(user); // return the user
	} catch (err) { // error handling
		console.error(err.message);
		if (err.kind == 'ObjectId') {
			return res.status(404).json({ msg: 'User not found' }); // return a 404 not found
		}
		res.status(500).send('Server error');
	}
});

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------

// @route   DELETE api/admin/shoppinglist/:listId/:itemId
// @desc    Delete an item from the shopping list
// @access  Admin
router.delete('/shoppinglist/:listId/:itemId', auth, admin, async (req, res) => {
	try {
	  // try to find the shopping list
	  const shoppingListId = req.params.listId; // get the shopping list id from the request parameters
	  const itemId = req.params.itemId; // get the item id from the request parameters
	  const shoppingList = await ShoppingList.findById(shoppingListId); // find the shopping list by the id
  
	  // If the shopping list doesn't exist
	  if (!shoppingList) {
		return res.status(404).json({ msg: 'Shopping list not found' }); // return a 404 not found
	  }
  
	  // Filter out the item to be removed
	  shoppingList.items = shoppingList.items.filter((item) => item._id.toString() !== itemId);
  
	  // Save the updated shopping list
	  await shoppingList.save();
  
	  // Return the updated shopping list
	  res.json(shoppingList);
	} catch (err) {
	  // error handling
	  console.error(err.message);
	  res.status(500).send('Server error'); // server error
	}
  });
  

// export the router
module.exports = router;
