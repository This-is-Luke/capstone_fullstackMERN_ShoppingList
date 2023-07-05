// index.js
const app = require('./server'); // Import the app instance
const port = process.env.PORT; // set port from env file

// Start the server
app.listen(port, () => console.log(`Server - Started on port ${port}`));
