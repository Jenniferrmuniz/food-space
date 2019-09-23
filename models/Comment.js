const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({

    comment: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    recipe: {type: Schema.Types.ObjectId, ref: 'Recipe'}

})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;