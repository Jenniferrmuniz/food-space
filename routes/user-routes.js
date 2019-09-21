const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bcrypt = require('bcryptjs');
const passport = require('passport');




router.get('/signup', (req, res, next) => {
    res.render('users/signup');
})



router.post('/signup', (req, res, next) => {
    const username = req.body.theUsername;
    const password = req.body.thePassword;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = {
        username: username,
        password: hashPassword
    }

    User.create(newUser)
        .then((data) => {
            res.redirect('/')
        })
        .catch((err) => {
            next(err);
        })
})



router.get('/login', (req, res, next) => {
    res.render('users/login');
})


router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
    passReqToCallback: true
}));



router.post('/logout', (req, res, next) => {

    req.logout();
    res.redirect('/');
})




router.get('/profile', (req, res, next)=>{

    if(req.user){
        res.render('users/profile', {theUser: req.user})
    } else{
        res.redirect('/')
    }
})




module.exports = router;