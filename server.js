const express = require("express");
const mongoose = require('mongoose');
const loginRouter = require('./routes/loginRouter'); 
const homeRouter = require('./routes/homeRouter');
require('dotenv').config();
const stockRouter = require('./routes/stockRouter')

const app = express();
const mongodbURL = process.env.MONGO;
const stockRouter = require('./routes/stockRouter')
const port = 3000;

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
app.use('/stocks', stockRouter)

app.use(express.static('public'));
app.use(express.json());  // using json library 
app.use(express.urlencoded({ extended: false })); // parses incoming URL-encoded form data 
//app.use(express.static(path.join(__dirname, 'public')));  // if displaying a file it will be in public folder

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