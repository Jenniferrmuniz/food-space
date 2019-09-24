const express = require('express');
const router = express.Router();

const User = require('../models/User')

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;
const passport = require('passport');


router.get('/signup', (req, res, next) => {

  res.render('user/signup');

})

router.post('/signup', (req, res, next) => {


  let username = req.body.theUsername;
  let password = req.body.thePassword;

  let salt = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);



  User.create({
    username: username,
    password: hashPass,
    //isAdmin: admin
  })
    .then((result) => {

      res.redirect('/recipes');

    })
    .catch((err) => {
      next(err);
    })
})

//route to login page
router.get('/login', (req, res, next) => {

  res.render('user/login')

})


//route for actually login in. if successful, takes you to celebrity page, if not back to login in again.
router.post("/login", passport.authenticate("local", {
  successRedirect: "/recipes",
  failureRedirect: "/user/login",
  failureFlash: true,
  passReqToCallback: true
}));


router.get("/logout", (req, res, next) => {

  req.logout(); //passport specific logout. without passport we use req.session.destroy()
  res.redirect("/user/login");

});











router.get('/:id', (req, res, next) => {

  let id = req.params.id;

  User.findById(id)
    .then((userData) => {

      Recipe.find()
        .then((allRecipes) => {
          allRecipes.forEach((eachRecipe) => {
            if (eachRecipe.author.equals(id)) {
              eachRecipe.recipeChosen = true;
            }
          })

          if (theUser._id === id) {
            theUser.profileOwner = true;
          }
          else {
            theUser.profileOwner = false;
          }

          res.render('user/profile', {profileInfo: userData, allRecipes: allRecipes});

        })
        .catch((err) => {
          next(err);
        })

    })

})














module.exports = router;