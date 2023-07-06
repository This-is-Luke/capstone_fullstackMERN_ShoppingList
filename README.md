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

Downlaod the repo and run `npm install` from the root directory. 

Then run `npm start` to start the app from the root directory.

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

I have set some unit tests for the backend and snapshot tests for the front end. 
To test the backend run `npm test` from the root directory to test the backend. 
To test the front end run `npm test` from the client directory.

## Security

This app uses JWT tokens to authenticate users. The tokens are stored in the local storage of the browser. 
It also uses Helmet to set some security headers.
No API keys are used in this app. but as mentioned above in installation a .env file is required to run the app.

### Page Structure
- __Login/Register Page__: This is the gateway to the application. A person can register as either an admin or a normal user.
- __User Home__: This page presents a simple layout containing a form to facilitate CRUD operations and hence allow a user to manage their shopping lists.
- __User View List__: This page shows a list of all the items in a users list. Users can use this page to manage their shopping lists.
    __User Edit List__: This page shows a list of all the items in a users list. Users can use this page to edit their shopping lists.
- __Admin Home__: This page shows a list of all users registered in the system. Admins can use this page to manage these users' shopping lists.
- __Admin View User__: This page shows a list of all the users and a link to their list. Admins can use this page to manage these users' shopping lists.
    __Admin Edit List__: This page shows a list of all the items in the specific users list. Admins can use this page to edit their shopping lists.
- __Sign Out Button__: A sign out button is universally visible, providing users with an easy way to sign out at any point during their session.

## License

This project is licensed under the MIT License 

## Upcoming updates

The following updates are planned for the next release:
    Adding ability to share lists with other users
    Adding ability to check off items as they are purchased
    Adding the ability to delete items from lists from the admin section

## Technologies Used

- MongoDB
- Express.js
- React.js
- Node.js
- mongoose
- axios
- react-router-dom
- react-styled-components

## Who will use the aplication?

This app is for anyone who wants to create and manage shopping lists amoung family memebers. 
The idea is to have a couple of users in a household that can add and edit their own shopping lists and a admin user who can manage lists for the household.
The set up is that the admin user will create a list for each user in the household and then the users can add items to their own lists. The admin user can then view all the lists and items and edit and delete them as needed.

## Planned updates

Google authentication
Ability to share lists with other users
Ability to check off items as they are purchased

## Credit

ThisIsLuke
contact@thisisluke.co.za
github.com/This-is-Luke