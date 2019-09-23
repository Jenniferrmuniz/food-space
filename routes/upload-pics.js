

const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bcrypt = require('bcryptjs');
const passport = require('passport');


const multer  = require('multer');
const Picture = require('../models/picture-model');








// Route to upload from project base path
const upload = multer({ dest: './public/uploads/' });

router.post('/upload', upload.single('photo'), (req, res) => {

  const pic = new Picture({
    name: req.body.name,
    path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname
  });

  pic.save((err) => {
      res.redirect('/');
  });
});





/* GET home page. */
router.get('/', function(req, res, next) {
    Picture.find((err, pictures) => {
      res.render('index', {pictures})
    })
  });






module.exports = router;