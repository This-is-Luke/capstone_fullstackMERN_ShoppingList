//routesUsers.js
/*
This file will contain all the routes for the user. It will handle
registering a new user, logging in, and getting the user's information.
*/
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middleware/auth');
const ShoppingList = require('../models/ShoppingList');

// User Model - Needed to make queries
const User = require('../models/User');

//--------------------------------------------------------------------------------------------------
// @route   POST /users
// @desc    Register new user
// @access  Public
router.post('/', async (req, res) => {
	console.log('POST / - Start');
	const { name, email, password, isAdmin } = req.body; // get the name, email, password, and isAdmin from the request body

	try { // then try to do the following
		console.log('POST / - Checking if user exists');
		let user = await User.findOne({ email }); // check if the user exists
		if (user) { // if the user exists, return an error
			console.log('POST / - User exists');
			return res // return a response
				.status(400) // with a status of 400
				.json({ msg: 'User already exists', error: 'User already exists' }); // and a JSON object with a message and an error
		}

    // if the user does not exist, create a new user
		console.log('POST / - Creating new user');
		user = new User({ // create a new user
			name,
			email,
			password,
			isAdmin,
		});

    // then hash the password
		console.log('POST / - Hashing password');
		const salt = await bcrypt.genSalt(10); // generate a salt using bcrypt, 10 was recommended
		user.password = await bcrypt.hash(password, salt); // hash the password using bcrypt and the salt

    // then generate the user's shopping list id in the database, this adds a shopping list to the user at the same time
		console.log('POST / - Creating new shopping list for user');
		const newShoppingList = new ShoppingList({
			user: user._id,
			items: [], // start with an empty list
		});

    // then save the shopping list
		console.log('POST / - Saving shopping list');
		await newShoppingList.save();

    // then add the shopping list to the user
		console.log('POST / - Adding shopping list to user');
		user.shoppingLists.push(newShoppingList._id); // add the shopping list's ID to the user's shoppingLists array

    // then save the user, now with the shopping list
		console.log('POST / - Saving user');
		await user.save();

    // then generate the token
		console.log('POST / - Generating token');
		const token = user.generateAuthToken();
		res.json({
			msg: 'User registered, shopping list created, and token generated',
			token, // send the token
		});
	} catch (err) { // error handling
		console.error('POST / - Error:', err.message);
		res.status(500).json({ msg: 'Server error', error: err.message });// send a 500 status and a JSON object with a message and an error
	}
	console.log('POST / - End');
});
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
// @route   POST /auth
// @desc    Authenticate user
// @access  Private
router.post('/auth', async (req, res) => { 
	console.log('POST /auth - Start');
	const { email, password } = req.body; // get the email and password from the request body

	try { //then try to do the following
		console.log('POST /auth - Checking if user exists');
		let user = await User.findOne({ email });// check if the user exists
		if (!user) { // if the user does not exist, return an error
			console.log('POST /auth - User does not exist');
			return res
				.status(400)
				.json({ msg: 'Invalid Credentials', error: 'Invalid Credentials' }); // return a response with a status of 400 and a JSON object with a message and an error
		}
    // logging for debugging
		console.log('POST /auth - Checking password');
		console.log('Email:', email);
		console.log('Password:', password);
		console.log('User password:', user.password);

    // then check if the password is correct
		const isMatch = await bcrypt.compare(password, user.password);// compare the password to the user's password
		console.log('isMatch:', isMatch);

    // if the password is not correct, return an error
		if (!isMatch) { 
			console.log('POST /auth - Invalid password');
			return res
				.status(400)
				.json({ msg: 'Invalid Credentials', error: 'Invalid Credentials' });// return a response with a status of 400 and a JSON object with a message and an error
		}

		console.log('POST /auth - Generating token');
		const token = user.generateAuthToken(); // generate the token

		// Remove the password from the user object before sending it in the response for security reasons
		user = user.toObject();
		delete user.password; // remove the password from the user object

		res.json({ msg: 'User authenticated and token generated', token, user }); // return a response with a message, the token, and the user object
	} catch (err) { // error handling
		console.error('POST /auth - Error:', err);
		res.status(500).json({ msg: 'Server error', error: err.message }); // return a response with a status of 500 and a JSON object with a message and an error
	}
	console.log('POST /auth - End');
});

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
// @route   POST /me/shoppinglists
// @desc    Create a new shopping list
// @access  Private
router.post('/me/shoppinglists', auth, async (req, res) => {
	console.log('POST /me/shoppinglists - Start');
	try { //Try to do the following
		console.log('POST /me/shoppinglists - Creating new shopping list');
		const newShoppingList = new ShoppingList({ // create a new shopping list
			user: req.user._id, // get the user's ID from the request
			items: req.body.items, // get the items from the request
		});

    // then save the shopping list
		console.log('POST /me/shoppinglists - Saving shopping list');
		const shoppingList = await newShoppingList.save();

    // then add the shopping list to the user
		res.json({ msg: 'Shopping list created', shoppingList });
	} catch (err) {// error handling
		console.error('POST /me/shoppinglists - Error:', err.message);
		res.status(500).json({ msg: 'Server error', error: err.message }); // return a response with a status of 500 and a JSON object with a message and an error
	}
	console.log('POST /me/shoppinglists - End');
});

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
// @route   PUT /me/shoppinglists
// @desc    Update a shopping list
// @access  Private
router.put('/me/shoppinglists/:id', auth, async (req, res) => { // update a shopping list
	console.log('PUT /me/shoppinglists/:id - Start');
	try { // try to do the following
		console.log('PUT /me/shoppinglists/:id - Finding shopping list');
		let shoppingList = await ShoppingList.findOne({ // find the shopping list using findOne
			_id: req.params.id, // get the shopping list's ID from the request
			user: req.user._id, // get the user's ID from the request
		});

    // if the shopping list does not exist, return an error
		if (!shoppingList) {
			console.log(
				`PUT /me/shoppinglists/:id - Shopping list not found ${req.params.id}` // log the error for debugging
			);
			return res // return a response with a status of 404 and a JSON object with a message and an error
				.status(404)
				.json({
					msg: 'Shopping list not found',
					error: 'Shopping list not found',
				});
		}

		console.log('PUT /me/shoppinglists/:id - Updating shopping list');
		shoppingList.items = req.body.items; // update the items in the shopping list
		shoppingList = await shoppingList.save();// save the shopping list

    // then return a response with a message and the shopping list
		res.json({ msg: 'Shopping list updated', shoppingList });
	} catch (err) { // error handling
		console.error('PUT /me/shoppinglists/:id - Error:', err.message);
		res.status(500).json({ msg: 'Server error', error: err.message }); // return a response with a status of 500 and a JSON object with a message and an error
	}
	console.log('PUT /me/shoppinglists/:id - End');
});

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
// @route   GET /me/shoppinglists
// @desc    Get all shopping lists
// @access  Private
router.get('/me/shoppinglist', auth, async (req, res) => {
	console.log('GET /me/shoppinglist - Start');
	try {// try to do the following
		console.log('GET /me/shoppinglist - Finding shopping list');
		const shoppingList = await ShoppingList.findOne({ user: req.user._id });// find the shopping list using findOne

    // if the shopping list does not exist, return an error
		if (!shoppingList) {
			console.log('GET /me/shoppinglist - Shopping list not found');
			return res
				.status(404)
				.json({
					msg: 'Shopping list not found',
					error: 'Shopping list not found',
				});
		}

    // then return a response with a message and the shopping list
		res.json({ msg: 'Shopping list found', shoppingList });
	} catch (err) {
		console.error('GET /me/shoppinglist - Error:', err.message);
		res.status(500).json({ msg: 'Server error', error: err.message });
	}
	console.log('GET /me/shoppinglist - End');
});

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
// @route   DELETE /me/shoppinglists/:id
// @desc    Delete a shopping list
// @access  Private
router.delete('/me/shoppinglists/:id', auth, async (req, res) => {
	console.log('DELETE /me/shoppinglists/:id - Start');
	try { // try to do the following
		console.log('DELETE /me/shoppinglists/:id - Finding shopping list');
		let shoppingList = await ShoppingList.findOne({ // find the shopping list using findOne
			_id: req.params.id, // get the shopping list's ID from the request
			user: req.user._id, // get the user's ID from the request
		});

    // if the shopping list does not exist, return an error
		if (!shoppingList) {
			console.log('DELETE /me/shoppinglists/:id - Shopping list not found');
			return res
				.status(404)
				.json({
					msg: 'Shopping list not found',
					error: 'Shopping list not found',
				});
		}

		console.log(
			'DELETE /me/shoppinglists/:id - Removing item from shopping list'
		);
    // find the index of the item in the shopping list
		const itemIndex = shoppingList.items.findIndex(
			(item) => item._id.toString() === req.body.itemId// get the item's ID from the request
		);
    // if the item does not exist, return an error
		if (itemIndex === -1) {
			console.log(
				'DELETE /me/shoppinglists/:id - Item not found in shopping list'
			);
			return res
				.status(404)
				.json({
					msg: 'Item not found in shopping list',
					error: 'Item not found in shopping list',
				});
		}
    // remove the item from the shopping list
		shoppingList.items.splice(itemIndex, 1); // remove the item from the shopping list
		shoppingList = await shoppingList.save(); // save the shopping list

    // then return a response with a message and the shopping list
		res.json({ msg: 'Item removed from shopping list', shoppingList });
	} catch (err) { // error handling
		console.error('DELETE /me/shoppinglists/:id - Error:', err.message);
		res.status(500).json({ msg: 'Server error', error: err.message }); // return a response with a status of 500 and a JSON object with a message and an error
	}
	console.log('DELETE /me/shoppinglists/:id - End');
});

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------

// export the router
module.exports = router;
