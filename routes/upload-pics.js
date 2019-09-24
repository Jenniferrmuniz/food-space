 const express = require('express');
 const router = express.Router();
// const User = require('../models/User');
// const session = require("express-session");
// const MongoStore = require("connect-mongo")(session);
// const bcrypt = require('bcryptjs');
// const passport = require('passport');


// const multer  = require('multer');
// const Picture = require('../models/Picture');








// // Route to upload from project base path
// const upload = multer({ dest: './public/uploads/' });

// router.post('/upload', upload.single('photo'), (req, res) => {

//   const pic = new Picture({
//     name: req.body.name,
//     path: `/uploads/${req.file.filename}`,
//     originalName: req.file.originalname
//   });

//   pic.save((err) => {
//       res.redirect('/upload');
//   });
// });





// /* GET home page. */
// router.get('/upload', function(req, res, next) {

//     Picture.find((err, pictures) => {
//         console.log(pictures);
//       res.render('index', {pictures: pictures});
//     })
//   });








module.exports = router;