const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;
const passport = require('passport');

const magicUploadTool = require('../config/cloudinary-settings');









// GET: signup page
router.get('/signup', (req, res, next) => {
  res.render('user/signup');
})



// POST: create user with info from sign up page
router.post('/signup', magicUploadTool.single('the-image-input-name'), (req, res, next) => {

  let username = req.body.theUsername;
  let password = req.body.thePassword;
  let experience = req.body.theExperience;
  let salt = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);

  let newUser = {
    username: username,
    password: hashPass,
    experience: experience
  }


  // if(req.body['the-image-input-name']){
  //   newUser.profileImage = req.body['the-image-input-name'];
  // }

  if (req.file) {
    newUser.profileImage = req.file.url;
  }

  User.create(newUser)
    .then((result) => {

      res.redirect('/recipes/recommended');

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
  successRedirect: "/recipes/recommended",
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

          // // Find recipes that were created by the profile owner
          allRecipes.forEach((eachRecipe) => {
            console.log(eachRecipe);



            if (eachRecipe.author) {
              if (eachRecipe.author.equals(id)) {
                eachRecipe.recipeChosen = true;
              }
            }


          })

          // // Check if it is the profile of the user that is logged in
          if (req.user) {
            if (req.user._id.equals(id)) {
              req.user.profileOwner = true;
            } else {
              req.user.profileOwner = false;
            }
          }


          res.render('user/profile', {
            allRecipes: allRecipes,
            profileInfo: userData
          });

        })
        .catch((err) => {
          next(err);
        })

    })

})


router.post('/:id', magicUploadTool.single('the-image-input-name'),(req, res, next) => {
  let id = req.params.id;


  User.findByIdAndUpdate(id, {profileImage: req.file.url} )
    .then((me) => {
      
      res.redirect(`/user/${me._id}`);
    })
    .catch((err) => {
      next(err);
    })

})











module.exports = router;