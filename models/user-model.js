const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    myRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Favorites' }],
    image: String
})



const User = mongoose.model('User', userSchema);


module.exports = User;