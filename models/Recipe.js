const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({

  name: String,
  description: String,
  image: String, //(image upload from breakout session W5D4)
  duration: Number, //(total + Prep, this could go in description ? )
  // ingredients: [String],
  // instructions: [String], 
  //cooking + prep

})

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;