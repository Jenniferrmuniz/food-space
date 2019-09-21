const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    myRecipes: [{ type: Schema.Type.ObjectId, ref: "Recipe" }],
    favorites: [{ type: Schema.Type.ObjectId, ref: "Favorites" }],
    image: String
})


const User = mongoose.model('User', userSchema);


module.exports = User;
