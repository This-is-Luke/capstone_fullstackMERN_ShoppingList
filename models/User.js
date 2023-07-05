//User.js

/*
This file is the model for the user to tell mongoose how to store the data.
*/

// import mongoose
const mongoose = require('mongoose');
// import jsonwebtoken
const jwt = require('jsonwebtoken');
// import Schema
const Schema = mongoose.Schema;

// create the UserSchema
const UserSchema = new Schema({
  name: { // the user's name
    type: String,
    required: true
  },
  email: { // the user's email
    type: String,
    required: true,
    unique: true
  },
  password: { // the user's password
    type: String,
    required: true
  },
  isAdmin: { // whether the user is an admin or not
    type: Boolean,
    default: false
  },
  shoppingLists: [ // the shopping lists that the user owns
    { 
      type: mongoose.Schema.Types.ObjectId, // id of the shopping list
      ref: 'shoppingList'
    }
  ]
});

// generate an auth token for the user
UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET); // generate a token
  return token;
}

// export the model
module.exports = User = mongoose.model('User', UserSchema);
