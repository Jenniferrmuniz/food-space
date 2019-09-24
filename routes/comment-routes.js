const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');



// router.get('/recipeDetails', (req, res, next)=>{
    
// })



router.post('/recipe/:id', (req, res, next) => {
    let recipeID = req.params.id;

    let newComment = {
        comment: req.body.theComment,
        author: req.body.theAuthor,
        recipe: req.body.theRecipe
    }


    Comment.create(newComment)
    .then((result) =>{
        res.redirect(`/recipes/details/${recipeID}`);
    })
    .catch((err)=>{
        next(err);
    })
})















module.exports = router;