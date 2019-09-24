const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;
const passport = require('passport');











// GET: signup page
router.get('/signup', (req, res, next) => {
  res.render('user/signup');
})




// POST: create user with info from sign up page
router.post('/signup', (req, res, next) => {

  let username = req.body.theUsername;
  let password = req.body.thePassword;
  let salt = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);


  User.create({
    username: username,
    password: hashPass
  })
    .then((result) => {

      res.redirect('/recipes');

    })
    .catch((err) => {
      next(err);
    })
})










// GET: login page
router.get('/login', (req, res, next) => {
  res.render('user/login')
})



// POST: use info from login page to login
router.post("/login", passport.authenticate("local", {
  successRedirect: "/recipes",
  failureRedirect: "/user/login",
  failureFlash: true,
  passReqToCallback: true
}));








// GET: logout button
router.get("/logout", (req, res, next) => {
  req.logout(); //passport specific logout. without passport we use req.session.destroy()
  res.redirect("/user/login");
});











// GET: profile page
router.get('/:id', (req, res, next) => {

  let id = req.params.id;

  User.findById(id)
    .then((userData) => {

      Recipe.find()
        .then((allRecipes) => {

          // Find recipes that were created by the profile owner
          allRecipes.forEach((eachRecipe) => {
            if (eachRecipe.author.equals(id)) {
              eachRecipe.recipeChosen = true;
            }
          })

          // Check if it is the profile of the user that is logged in
          if (theUser._id === id) {
            theUser.profileOwner = true;
          }
          else {
            theUser.profileOwner = false;
          }

          res.render('user/profile', { profileInfo: userData, allRecipes: allRecipes });

        })
        .catch((err) => {
          next(err);
        })

    })

})














module.exports = router;