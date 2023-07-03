//User.js is the file that contains the User model
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  shoppingLists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'shoppingList'
    }
  ]
});

UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET);
  return token;
}

module.exports = User = mongoose.model('User', UserSchema);
