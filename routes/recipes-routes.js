const express = require('express');
const router = express.Router();

const Recipe = require('../models/Recipe');
const axios = require('axios');







function getRecipesFromAPI() {
  axios.get('https://api.spoonacular.com/recipes/search?query=burger&number=2')
    .then((res) => {

      console.log(res);


    })

}

//Create recipes
router.get('/randomRecipe', (req, res, next) => {
  axios.get('https://api.spoonacular.com/recipes/search?query=burger&number=2', { headers: { "X-RapidAPI-Key": process.env.API_KEY } })
    .then((res) => {

      console.log(res);
      

    })
    .catch((err) => {
      next(err);
    })
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
  .then((result) =>{
    res.redirect('/');
  })
  .catch((err) =>{
    next(err);
  })
})





//Get update recipe page
router.get('/update/:id', (req, res, next) =>{
  let id = req.params.id;

  Recipe.findById(id)
  .then((res)=>{
    
  })

  res.render('recipes/updateRecipe', recipe);


})










//Update the recipe
router.post('/update/:id', (req, res, next) =>{
  let id = req.params.id;


  let updateRecipe = {
    name: req.body.theName,
    description: req.body.theDescription,
    image: req.body.theImage,
    duration: req.body.theDuration
  }


  Recipe.findByIdAndUpdate(id, updateRecipe)
  .then((result) => {
    res.redirect('/recipes/'+id);
  })
  .catch((err) =>{
    next(err);
  })

})




module.exports = router;