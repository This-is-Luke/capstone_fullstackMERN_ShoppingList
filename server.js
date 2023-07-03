//server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT;
const db = process.env.MONGODB_URI;

app.use(cors());

console.log('Server - Start');

// Bodyparser Middleware
console.log('Server - Setting up body-parser');
app.use(bodyParser.json());

// Connect to MongoDB
console.log('Server - Connecting to MongoDB');
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`\nServer - MongoDB Connected!\n`))
  .catch(err => console.log('Server - MongoDB connection error:', err));

// Use Routes
console.log('Server - Setting up routes');
app.use('/api/user/me/shoppinglists', require('./routes/routesShoppingList'));
app.use('/api/users', require('./routes/routesUsers'));
app.use('/api/admin', require('./routes/routesAdmin'));  // This line has changed

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

console.log(`Server - Starting on port ${port}`);
app.listen(port, () => console.log(`Server - Started on port ${port}`));

module.exports = app;  // For testing
