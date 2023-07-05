//server.js
// This file will be the main entry point for the application. It will contain most of the server code.
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Create the server
const app = express(); // initialize express
const port = process.env.PORT; // set port from env file
const db = process.env.MONGODB_URI; // set database from env file

// CORS Middleware
app.use(cors());

console.log('Server - Start');

// Bodyparser Middleware
console.log('Server - Setting up body-parser');
app.use(bodyParser.json());

// Connect to MongoDB
console.log('Server - Connecting to MongoDB');
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }) // connect to MongoDB
	.then(() => console.log(`\nServer - MongoDB Connected!\n`)) // log that MongoDB connected
	.catch((err) => console.log('Server - MongoDB connection error:', err)); // log the error if MongoDB fails to connect

// Add a route handler for the root route
app.get('/', (req, res) => {
	res.send('Server is running');
});

// Use Routes
console.log('Server - Setting up routes');
app.use('/api/user/me/shoppinglists', require('./routes/routesShoppingList')); // use the routes for shopping lists
app.use('/api/users', require('./routes/routesUsers')); // use the routes for users
app.use('/api/admin', require('./routes/routesAdmin')); // use the routes for admin

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
	console.log('Server - In production mode');
	// Set static folder
	app.use(express.static('client/build'));

	// Serve the HTML file
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

// // Start the server
// console.log(`Server - Starting on port ${port}`);
// app.listen(port, () => console.log(`Server - Started on port ${port}`));

module.exports = app; // For testing
