const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

  username: String,
  password: String,
  email: String,
  image: String
  // myRecipes: [{
  //   type: Schema.Type.ObjectId,
  //   ref: "Recipe"
  // }],
  // favorites: [{
  //   type: Schema.Type.ObjectId,
  //   ref: "Favorites"
  // }],
  // isAdmin: Boolean, wishlist
  // googleID: String, wishlist
})

const User = mongoose.model('User', userSchema);

module.exports = User;