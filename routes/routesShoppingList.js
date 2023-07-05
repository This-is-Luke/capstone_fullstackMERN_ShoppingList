//routesShoppingList.js

/*
This file contains all of the routes for the shopping list API.
*/
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ShoppingList = require('../models/ShoppingList');
const User = require('../models/User');

// @route   POST api/shoppinglist
// @desc    Create shopping list
// @access  Private
router.post('/', auth, async (req, res) => {
	console.log('POST / - Start');
	try {
		// Create a new shopping list
		console.log('POST / - Creating new shopping list');
		const newShoppingList = new ShoppingList({
			user: req.user.id, // debugging use req.user.id instead of req.user
			items: req.body.items, // debugging use req.body.items instead of req.body
		});

		// Save the shopping list
		console.log('POST / - Saving shopping list');
		const shoppingList = await newShoppingList.save();

		// Add the shopping list to the user
		console.log('POST / - Adding shopping list to user');
		await User.updateOne(
			{ _id: req.user.id }, // using
			{ $push: { shoppingLists: shoppingList._id } } // push the shopping list id to the user's shopping lists array
		);

		console.log('POST / - Shopping list saved');
		res.json(shoppingList); // send the shopping list in the response
	} catch (err) {
		// if an error occurs
		console.error('POST / - Error:', err.message);
		res.status(500).send('Server Error'); // send a 500 response with the error message
	}
	console.log('POST / - End');
});

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------

// @route   GET api/shoppinglist
// @desc    Get shopping list
// @access  Private
router.get('/', auth, async (req, res) => {
	try {
		// Find the shopping list for the user
		console.log('GET / - Start');
		// this is to await the user to be found
		const shoppingLists = await ShoppingList.find({ user: req.user.id }); // debugging use req.user.id instead of req.user
		console.log('GET / - Shopping lists found');
		res.json({ msg: 'Shopping lists found', shoppingLists }); // send the shopping list in the response
	} catch (err) {
		// if an error occurs
		console.error('GET / - Error:', err.message);
		res.status(500).json({ msg: 'Server Error', error: err.message }); // send a 500 response with the error message
	}
	console.log('GET / - End');
});

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------

// @route   PUT api/shoppinglist/:id
// @desc    Update shopping list
// @access  Private
router.put('/:id', auth, async (req, res) => {
	console.log('PUT /:id - Start');
	try {
		// Find the shopping list for the user
		console.log('PUT /:id - Finding shopping list');
		const shoppingList = await ShoppingList.findById(req.params.id); // find by ID

		if (!shoppingList) {
			// if the shopping list is not found
			console.log('PUT /:id - Shopping list not found');
			return res
				.status(404)
				.json({
					msg: 'Shopping list not found',
					error: 'Shopping list not found',
				}); // send a 404 response with the error message
		}

		// Check if the user is authorized to update the shopping list
		if (!shoppingList.user) {
			console.error('PUT /:id - Error: Shopping list has no user');
			return res
				.status(500)
				.json({ msg: 'Server error', error: 'Shopping list has no user' });
		} else if (shoppingList.user.toString() !== req.user.id) {
			// use req.user.id instead of req.user
			console.log('PUT /:id - User not authorized');
			return res
				.status(401)
				.json({ msg: 'User not authorized', error: 'User not authorized' }); // send a 401 response with the error message
		}

		console.log('PUT /:id - Appending new item to shopping list');
		const newItem = {
			name: req.body.items[0].name, // pass in the name from the request body
			quantity: req.body.items[0].quantity, // pass in the quantity from the request body
		};
		shoppingList.items.push(newItem); // push the new item to the shopping list
		await shoppingList.save(); // then save the shopping list

		res.json({ msg: 'Shopping list updated', shoppingList }); // send the shopping list in the response
	} catch (err) { // if an error occurs
		console.error('PUT /:id - Error:', err.message);
		res.status(500).json({ msg: 'Server error', error: err.message }); // send a 500 response with the error message
	}
	console.log('PUT /:id - End');
});

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------

// @route   DELETE api/shoppinglist/:id
// @desc    Delete shopping list
// @access  Private
router.delete('/:id', auth, async (req, res) => {
	try { // try to delete the shopping list
		console.log('DELETE /:id - Start');
		const shoppingList = await ShoppingList.findById(req.params.id);// find by ID

    // Check if the shopping list exists
		if (!shoppingList) {
			console.log('DELETE /:id - Shopping list not found');
			return res.status(404).json({ msg: 'Shopping list not found' });
		}

    // Check if the user is authorized to delete the shopping list
		if (shoppingList.user.toString() !== req.user.id) {
			console.log('DELETE /:id - User not authorized');
			return res.status(401).json({ msg: 'User not authorized' });
		}

    // Remove the shopping list
		console.log('DELETE /:id - Removing shopping list');
		await shoppingList.remove(); // remove the shopping list
		console.log('DELETE /:id - Shopping list removed');
		res.json({ msg: 'Shopping list removed' });
	} catch (err) { // if an error occurs
		console.error('DELETE /:id - Error:', err.message);
		res.status(500).json({ msg: 'Server Error', error: err.message }); // send a 500 response with the error message
	}
	console.log('DELETE /:id - End');
});

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------

// @route   DELETE api/shoppinglist/:id/:itemId
// @desc    Delete item from shopping list
// @access  Private
router.delete('/:id/:itemId', auth, async (req, res) => {
	try { // try to delete the item from the shopping list
		console.log('DELETE /:id/:itemId - Start');
		const shoppingList = await ShoppingList.findById(req.params.id); // find by ID

    // Check if the shopping list exists
		if (!shoppingList) {
			console.log('DELETE /:id/:itemId - Shopping list not found');
			return res.status(404).json({ msg: 'Shopping list not found' }); // send a 404 response with the error message
		}

    // Check if the user is authorized to delete the item from the shopping list
		if (shoppingList.user.toString() !== req.user) {
			console.log('DELETE /:id/:itemId - User not authorized');
			return res.status(401).json({ msg: 'User not authorized' });
		}

    // Find the item
		console.log('DELETE /:id/:itemId - Finding item');
		const item = shoppingList.items.find(
			(item) => item.id === req.params.itemId// find by ID
		);

    // Check if the item exists
		if (!item) {
			console.log('DELETE /:id/:itemId - Item not found');
			return res.status(404).json({ msg: 'Item not found' }); // send a 404 response with the error message
		}

    // Remove the item
		console.log('DELETE /:id/:itemId - Removing item');
		shoppingList.items = shoppingList.items.filter(
			(item) => item.id !== req.params.itemId
		);
    // Save the shopping list with the item removed
		await shoppingList.save();
		console.log('DELETE /:id/:itemId - Item removed');
		res.json({ msg: 'Item removed' }); // send a 200 response with the message
	} catch (err) { // if an error occurs
		console.error('DELETE /:id/:itemId - Error:', err.message);
		res.status(500).json({ msg: 'Server Error', error: err.message }); // send a 500 response with the error message
	}
	console.log('DELETE /:id/:itemId - End');
});

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------

// export the router
module.exports = router;
