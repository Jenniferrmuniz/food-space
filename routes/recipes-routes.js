const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const axios = require('axios');
const unirest = require('unirest');

const magicUploadTool = require('../config/cloudinary-settings');




router.post('/deletestep/:recipeid/step/:index', (req, res, next) =>{
  Recipe.findById(req.params.recipeid)
  .then((recipe) => {

    let step = recipe.instructions[req.params.index];

    Recipe.findByIdAndUpdate(req.params.recipeid, {$pull: {instructions: step}})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    })

  })
  .catch((err)=>{
    next(err);
  })
})


// router.get('/randomRecipe', (req, res, next) => {

//   var req = unirest("GET", "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random");

//   req.query({
//     "number": "2",
//     "tags": "breakfast"
//   });

//   req.headers({
//     "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
//     "x-rapidapi-key": "7dcc32f944mshf83d252c5a63984p1df45fjsna9113f200bf3"
//   });

//   let recipesModel;

//   req.end(function (res) {
//     if (res.error) throw new Error(res.error);



//     // the array of recipe objects from the api. we need to 
//     let recipesFromDB = res.body.recipes;
//     recipesModel = recipesFromDB.map((recipe) => {
//       let newObj = {}
//       newObj.title = recipe.title
//       newObj.duration = recipe.readyInMinutes
//       newObj.instructions = recipe.analyzedInstructions[0].steps //analyzed instructions?
//       newObj.image = recipe.image

//       if(newObj.instructions.length < 7){
//         newObj.difficulty = 'Easy'
//       }
//       else{
//         newObj.difficulty = 'Hard'
//       }

//       return newObj
//     })
//   });

//   setTimeout(() => {
//     Recipe.create(recipesModel)
//       .then((randomRecipe) => {
//         // console.log('++++++++++++++++ rando recipe  +++++++++++++', randomRecipe)
//         // res.redirect('/recipes/randomRecipe')
//         res.render('recipes/randomRecipe', {recipe: randomRecipe})
//       })
//       .catch((err) => {
//         next(err);
//       })
//   },1000)

// })



// GET route for a random recipe from our database
router.get('/randomRecipe', (req, res, next) => {
  // Get the count of all users
  Recipe.count().exec(function (err, count) {
    // Get a random entry
    var random = Math.floor(Math.random() * count)
    // Again query all users but only fetch one offset by our random #
    Recipe.findOne().skip(random).exec((err, result) => {
      res.redirect(`/recipes/details/${result._id}`)
    })
  })
})



/* GET recommended page */
router.get('/recommended', (req, res, next) => {

  // logic for recommended page 

  let difficulty;

  if(req.user.experience === 'Amateur'){
    difficulty = 'Easy';
  }
  if(req.user.experience === 'Professional'){
    difficulty = 'Hard'
  }

// passing a difficulty object here will only find the recipes with that difficulty key:value 
  Recipe.find({difficulty:difficulty})
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


router.post('/new', magicUploadTool.single('the-image-input-name'), (req, res, next) => {

  if(!req.user){
    res.reditect('/user/login')
  }


  let newRecipe = {
    title: req.body.theTitle,
    duration: req.body.theDuration,
    author: req.user._id,
    instructions: req.body.instructionInput,
    difficulty: req.body.theDifficulty
  }

  if(req.file){
    newRecipe.image = req.file.url;
  }

  
    Recipe.create(newRecipe)
    .then((result) => {
      res.redirect('/recipes/all')
    })
    .catch((err) => {
      next(err);
    })
})






router.get('/all', (req, res, next) => {


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


  Recipe.findById(id).populate('author')
    .then((theRecipe) => {
      

      Comment.find({recipe: id}).populate('author')
        .then((allComments) => {
          
          if(req.user){


            if(theRecipe.author){

              if(theRecipe.author.equals(req.user._id)){
                theRecipe.mine = true;
            }

            }



        }


          res.render('recipes/recipeDetails', {
            recipe: theRecipe,
            comments: allComments
          });

        })
        .catch((err) => {
          next(err);
        })
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

          //theRecipe.steps = theRecipe.instructions.length;

          if(theRecipe.difficulty='Easy'){
            theRecipe.easy = true;
          }

          //let numOfSteps = theRecipe.instructions.length;


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