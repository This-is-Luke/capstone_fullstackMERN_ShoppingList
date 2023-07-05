# Shopping List Web App

## Description

This app is a shopping list app that allows users to create and manage shopping lists. Users can create lists, add items to lists, Users can also edit and delete lists and items.

It also has a admin section that allows admins to view users and their lists.

In upcomming releases of this software we will be adding the ability to share lists with other users and check off items as they are purchased.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Contributing](#contributing)
4. [Tests](#tests)
5. [License](#license)

## Installation

Downlaod the repo and run `npm install` from the root directory. Then run `npm start` to start the app.

to setup the env file, create a file called `.env` in the root directory and add the following:

MONGODB_URI
JWT_SECRET
PORT

## Usage 

At the start Register yourself as a user. Then login and start creating lists. You can also create a admin user by setting the `isAdmin` field to true in the database or ticking the `isAdmin` checkbox when registering.

Then in the user section you can view your list and add items to them. You can also add and delete items.

As an admin you can view all users and their lists. You can also edit and delete items.

## Contributing

As this is part of a capstone project for a bootcamp we will not be accepting contibutions at this time. However, if you have any suggestions or feedback please feel free to contact us.

## Tests

I have set some unit tests for the backend and snapshot tests for the front end. To run the tests, run `npm test` from the root directory.

## License

This project is licensed under the MIT License 

## Technologies Used

- MongoDB
- Express.js
- React.js
- Node.js

## Contact Information

ThisIsLuke
contact@thisisluke.co.za
github.com/This-is-Luke