const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');

const axios = require('axios');







/* GET home page */
router.get('/', (req, res, next) => {


  Recipe.find()
    .then((recommendedRecipes) => {

      res.render('recipes/recommended', {
        recipes: recommendedRecipes
      })
    })
    .catch((err) => {
      next(err)
    })
});






















// GET: recipe details page
router.get('/:id', (req, res, next) => {
  let id = req.params.id;

  Recipe.findById(id)
    .then((theRecipe) => {

      User.find()
        .then((allUsers) => {

          Comment.find()
            .then((allComments) => {

              // Find all of the comments associated with this recipe
              allComments.forEach((eachComment) => {
                  if (eachComment.recipe.equals(theRecipe._id)) {
                    eachComment.chosen = true;
                  }

                  allUsers.forEach((eachUser) => {

                    // Find the user that authored the recipe
                    if (eachUser._id.equals(theRecipe.author)) {
                      eachUser.chosen = true;
                    }

                    // Find the users that authored the comments
                    if(eachUser._id.equals(eachComment.author)){
                      eachUser.commentChosen = true;
                    }
                  })
              })

              res.render('recipes/recipeDetails', {recipe: theRecipe, users: allUsers, comments: allComments});

            })
            .catch((err)=>{
              next(err);
            })
        })
        .catch((err) =>{
          next(err);
        })
    })
    .catch((err)=>{
      next(err);
    })
})












// GET: recipe to be deleted and remove it from the DB
router.get('/delete/:id', (req, res, next) => {
  let id = req.params.id;

  Recipe.findByIdAndRemove(id)
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => {
      next(err);
    })
})











// GET: update recipe page
router.get('/update/:id', (req, res, next) => {
  let id = req.params.id;

  Recipe.findById(id)
    .then((theRecipe) => {
      
      User.find()
        .then((allUsers) => {
          
          // Find the author of the recipe
          allUsers.forEach((eachUser) => {
            if (eachUser._id.equals(theRecipe.author)) {
              eachUser.chosen = true;
            }
          })

          res.render('recipes/updateRecipe', { recipe: theRecipe, users: allUsers });
        })
        .catch((err) => {
          next(err);
        })
    })
    .catch((err) => {
      next(err);
    })

})





// POST: update the recipe using the info from update page
router.post('/update/:id', (req, res, next) => {
  let id = req.params.id;

  let updateRecipe = {
    name: req.body.theName,
    description: req.body.theDescription,
    image: req.body.theImage,
    duration: req.body.theDuration
  }

  Recipe.findByIdAndUpdate(id, updateRecipe)
    .then((result) => {
      res.redirect('/recipes/' + id);
    })
    .catch((err) => {
      next(err);
    })

})









module.exports = router;