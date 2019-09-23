require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const session       = require('express-session');
const MongoStore    = require('connect-mongo')(session);
const flash         = require("connect-flash");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User          = require('./models/user-model');
const bcrypt        = require('bcryptjs');

mongoose
  .connect('mongodb://localhost/food-space', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';









app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));



app.use(passport.initialize());
// this line is basically turning passport on

app.use(passport.session());
// this line connects the passport instance you just created, with the session that you just created above it




app.use((flash()));





passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy((username, password, next) => {
  //                                ^
  //                                |
  //                                ------------------------------------
  //                                                                    |
  // passport by default will grab req.body.username and put it right here
// same thing is true for password

  User.findOne({ username }, (err, user) => {
    // in this callbacksyntax err will only exist if something goes wrong
    // user will only exist if everything goes right
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Sorry, wrong username" });
      // whatever message is equal to automatically gets set to req.flash('error')
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));











app.use((req, res, next)=>{
  res.locals.theUser = req.user;
  res.locals.errorMessage = req.flash('error');
  res.locals.successMessage = req.flash('success');
  next();
})
// creating a universal variable inside all the hbs files called theUser
// this variable is equal to the user in the session
// that means if there's no user in the session, this variable will be null/undefined (not sure which one)










const index = require('./routes/index');
app.use('/', index);

const user = require('./routes/user-routes');
app.use('/', user);

const upload = require('./routes/upload-pics');
app.use('/', upload);

module.exports = app;
