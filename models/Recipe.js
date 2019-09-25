const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({

  author: {type: Schema.Types.ObjectId, ref: 'User'},
  title: String,
  instructions: Array,
  image: String, //(image upload from breakout session W5D4)
  duration: Number,
  difficulty: String
})

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;


