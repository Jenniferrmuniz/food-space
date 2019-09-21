const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const recipeSchema = new Schema({
    name: String,
    description: String,
    image: String,
    duration: Number,
    ingredients: [String],
    prep: [String],
    cook: [String]
})



const Recupe = mongoose.model('Recipe', recipeSchema);


module.exports = Recipe;
