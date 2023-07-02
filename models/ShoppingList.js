//ShoppingList.js is the file that contains the ShoppingList model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoppingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [
    {
      name: String,
      quantity: Number
    }
  ]
});

module.exports = ShoppingList = mongoose.model('shoppingList', ShoppingListSchema);
