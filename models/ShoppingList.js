//ShoppingList.js

/*
This file is the model for the shopping list to tell mongoose how to store the data.
*/

// import mongoose
const mongoose = require('mongoose');
// import Schema
const Schema = mongoose.Schema;

// create the ShoppingListSchema
const ShoppingListSchema = new mongoose.Schema({
  user: { // the user that owns the shopping list
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [ // the items in the shopping list
    {
      name: String,
      quantity: Number
    }
  ]
});

// export the model
module.exports = ShoppingList = mongoose.model('shoppingList', ShoppingListSchema);
