const express = require('express');
const router = express.Router();

const Recipe = require('../models/Recipe')

/* GET home page */
router.get('/', (req, res, next) => {
  

  //error message to login
  // if(!req.user){
  //   req.flash('error', 'Please login to view this page')
  //   req.flash('/login')
  // }

  Recipe.find()
    .then((recommendedRecipes) => {

      // only lets users delete/edit movies that they created. Admin can do everything
      // allTheCelebrities.forEach((eachMovie)=>{
      //   if(eachMovie.creator.equals(req.user._id) || req.user.isAdmin) {
      //     eachMovie.mine = true;
      //   }
      // })

      res.render('recipes/recommended', {
        recipes: recommendedRecipes
      })
    })
    .catch((err) => {
      next(err)
    })
});



module.exports = router;