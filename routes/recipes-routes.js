const express = require('express');
const router = express.Router();

const Recipe = require('../models/Recipe');
const axios = require('axios');











// function getRecipesFromAPI() {
//   axios.get('https://api.spoonacular.com/recipes/search?query=burger&number=2')
//     .then((res) => {

//       console.log(res);


//     })

// }

// //Create recipes
// router.get('/randomRecipe', (req, res, next) => {
//   axios.get('https://api.spoonacular.com/recipes/search?query=burger&number=2', { headers: { "X-RapidAPI-Key": process.env.API_KEY } })
//     .then((res) => {

//       console.log(res);


//     })
//     .catch((err) => {
//       next(err);
//     })
// })


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






















// GET recipe details page
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
                for (let i = 0; i < theRecipe.comments.length; i++) {
                  if (eachComment._id.equals(theRecipe.comments[i])) {
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
                }
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












//Delete recipe
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











//Get update recipe page
router.get('/update/:id', (req, res, next) => {
  let id = req.params.id;

  Recipe.findById(id)
    .then((theRecipe) => {
      User.find()
        .then((allUsers) => {
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



//Update the recipe
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