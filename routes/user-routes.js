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

  // let admin = false;

  // if (req.user) {
  //   // check if logged in  
  //   if (req.user.isAdmin) {
  //     //check if logged in user in an admin if so give them true value to is admin
  //     admin = req.body.role ? req.body.role : false;
  //   }
  // }


  let username = req.body.theUsername;
  let password = req.body.thePassword;

  let salt = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);

  // check for if no password entered...
  
  // if (username === "" || password === "") {
  //   res.render("user/signup", {
  //     errorMessage: "Indicate a username and a password to sign up"
  //   });
  //   return;
  // }

  User.create({
      username: username,
      password: hashPass,
      //isAdmin: admin
    })
    .then((result) => {

      res.redirect('/recipes');

      // if no user then do the auto login when signing up
      // if (!req.user) {
      //   req.login(result, function (err, user) {
      //     if (!err) {
      //       res.redirect('/recommended');
      //     } else {
      //       next(err);
      //     }
      //   })
      // } 
      // else {
      //   res.redirect('/admin/active-users') //when admin creates a user go to all users page
      // }
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




//creates route to profile or myaccount page so user can delete their account if they want. gives some control to user
// router.get('/profile', (req, res, next) => {
//   res.render('user/profile');
// })

//submits post for user to delete account from DB
// router.post('/account/delete-my-account', (req, res, next) => {
//   User.findByIdAndRemove(req.user._id)
//     .then(() => {
//       res.redirect('/')
//     })
//     .catch((err) => {
//       next(err);
//     })
// })

// router.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: [
//       "https://www.googleapis.com/auth/userinfo.profile",
//       "https://www.googleapis.com/auth/userinfo.email"
//     ]
//   })
// );

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "/celebrity",
//     failureRedirect: "/user/login" // here you would redirect to the login page using traditional login approach
//   })
// );


module.exports = router;