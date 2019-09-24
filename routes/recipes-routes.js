const express = require('express');
const router = express.Router();

const Recipe = require('../models/Recipe');
const axios = require('axios');
const unirest = require('unirest');






// function getRecipesFromAPI() {
//   axios.get('https://api.spoonacular.com/recipes/search?query=burger&number=2')
//     .then((res) => {

//       console.log(res);


//     })

// }



router.get('/randomRecipe', (req, res, next) => {


  var req = unirest("GET", "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random");

  req.query({
    "number": "1",
    "tags": "lunch"
  });

  req.headers({
    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "x-rapidapi-key": "7dcc32f944mshf83d252c5a63984p1df45fjsna9113f200bf3"
  });

  let recipesModel;

  req.end(function (res) {
    if (res.error) throw new Error(res.error);

    console.log(res.body.recipes);


    // the array of recipe objects from the api. we need to 
    let recipesFromDB = res.body.recipes;
    recipesModel = recipesFromDB.map((recipe) => {
      let newObj = {}
      newObj.title = recipe.title
      newObj.duration = recipe.readyInMinutes
      newObj.instructions = recipe.instructions
      newObj.image = recipe.image
      return newObj
    })
  });

  setTimeout(() => {
    Recipe.create(recipesModel)
      .then((randomRecipe) => {
        console.log('++++++++++++++++ rando recipe  +++++++++++++', randomRecipe)
        // res.redirect('/recipes/randomRecipe')
        res.render('recipes/randomRecipe', {recipe: randomRecipe})
      })
      .catch((err) => {
        next(err);
      })
  },1000)

})









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
    .then((res) => {

    })

  res.render('recipes/updateRecipe', recipe);


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