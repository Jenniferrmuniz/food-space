const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const axios = require('axios');
const unirest = require('unirest');




// router.get('/randomRecipe', (req, res, next) => {

//   var req = unirest("GET", "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random");

//   req.query({
//     "number": "1",
//     "tags": "lunch"
//   });

//   req.headers({
//     "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
//     "x-rapidapi-key": "7dcc32f944mshf83d252c5a63984p1df45fjsna9113f200bf3"
//   });

//   let recipesModel;

//   req.end(function (res) {
//     if (res.error) throw new Error(res.error);

//     console.log(res.body.recipes);


//     // the array of recipe objects from the api. we need to 
//     let recipesFromDB = res.body.recipes;
//     recipesModel = recipesFromDB.map((recipe) => {
//       let newObj = {}
//       newObj.title = recipe.title
//       newObj.duration = recipe.readyInMinutes
//       newObj.instructions = recipe.instructions
//       newObj.image = recipe.image
//       return newObj
//     })
//   });

//   setTimeout(() => {
//     Recipe.create(recipesModel)
//       .then((randomRecipe) => {
//         console.log('++++++++++++++++ rando recipe  +++++++++++++', randomRecipe)
//         // res.redirect('/recipes/randomRecipe')
//         res.render('recipes/randomRecipe', {recipe: randomRecipe})
//       })
//       .catch((err) => {
//         next(err);
//       })
//   },1000)

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



// GET route to create new comments 
router.get('/new', (req, res, next) => {
  res.render('recipes/new')
})


router.post('/new', (req, res, next) => {

  let title = req.body.theTitle;
  let duration = req.body.theDuration;
  let instructions = req.body.theInstructions;
  let image = req.body.theImage;

  Recipe.create({
          title: title,
          duration: duration,
          instructions: instructions,
          image: image
      })
      .then((result) => {
          res.redirect('/recipes/all')
      })
      .catch((err) => {
          next(err);
      })
})






router.get('/all', (req,res,next)=> {
  

  Recipe.find()
    .then((allTheRecipes) => {


      res.render('recipes/all', {
        recipes: allTheRecipes
      })
    })
    .catch((err) => {
      next(err)
    })
})







// GET: recipe details page
router.get('/details/:id', (req, res, next) => {
  let id = req.params.id;


  Recipe.findById(id)
    .then((theRecipe) => {

      console.log(theRecipe);

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
                  if (eachUser._id.equals(eachComment.author)) {
                    eachUser.commentChosen = true;
                  }
                })
              })

              res.render('recipes/recipeDetails', {
                recipe: theRecipe,
                users: allUsers,
                comments: allComments
              });

            })
            .catch((err) => {
              next(err);
            })
        })
        .catch((err) => {
          next(err);
        })
    })
    .catch((err) => {
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

          res.render('recipes/updateRecipe', {
            recipe: theRecipe,
            users: allUsers
          });
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