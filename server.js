const express = require("express");
const mongoose = require('mongoose');
const loginRouter = require('./routes/loginRouter'); 
const homeRouter = require('./routes/homeRouter');
require('dotenv').config()
//const passport = require('passport'); // importing middleware for authentication
//const GoogleStrategy = require('passport-google-oauth20').Strategy;

const port = 3000;
const app = express();
const mongodbURL = process.env.MONGO;

// // configure passport with Google OAuth2 
// //------------------
// passport.use(new GoogleStrategy({
//   clientID: 'YOUR_GOOGLE_CLIENT_ID',
//   clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
//   callbackURL: 'http://localhost:3000/auth/google/callback'
// },
// function(accessToken, refreshToken, profile, cb) {
//   User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     return cb(err, user);
//   });
// }
// ));
//------------------

// view engine setup
app.set('view engine', 'ejs'); // specifying the view engine in the express app

// app.use(express.json()); // parsing JSON data
app.use(express.urlencoded({ extended: true })); // parsing user input
// logs info about request method, status code, and response time
//var logger = require('morgan');

app.use(express.static('public'));

// these are found in the roots folder since they handle a url, these are get methods
app.use('/', homeRouter);
app.use('/accounts', loginRouter);

app.use(express.static('public'));
app.use(express.json());  // using json library 
app.use(express.urlencoded({ extended: false })); // parses incoming URL-encoded form data 
//app.use(express.static(path.join(__dirname, 'public')));  // if displaying a file it will be in public folder

// init passport 
// app.use(passport.initialize());
// app.use(passport.session());

// Connect to MongoDB using Mongoose
mongoose.connect(mongodbURL)
  .then(() => {
    console.log(' Successfully connected to server');
  })
  .catch((error) => {
    console.error('Error connecting to server:', error);
  });
  
  
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
  

    // exporting the app object to make it available in other files 
    module.exports = app;