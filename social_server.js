const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const ensureAuthenticated = require("./public/javascripts/authMiddleware")

require('dotenv').config();
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false , httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
  }));

app.use(flash());

// View engine setup
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const homeRouter = require("./routes/homeRouter");
const loginRouter = require("./routes/loginRouter")
const userRouter = require("./routes/userRouter");
const signupRouter = require("./routes/signUpRouter");
const logoutRouter = require("./routes/logoutRouter");
const cryptoRouter = require("./routes/cryptoRouter");
const stockRouter = require("./routes/stockRouter");
const passwordResetRouter = require("./routes/passwordResetRouter");
const profileRouter = require("./routes/profileRouter");
const portfolioRouter = require('./routes/portfolioRouter')
const ratingRouter = require('./routes/ratingRouter'); // Import the router file
const aiRouter = require('./routes/aiRouter')

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
// these are found in the roots folder since they handle a url, these are get methods
app.use(ensureAuthenticated);
app.use('/', homeRouter);
app.use('/accounts', loginRouter);
app.use('/', ensureAuthenticated, portfolioRouter)
app.use('/Logout', logoutRouter)
app.use("/stocks", ensureAuthenticated, stockRouter);
app.use("/crypto", ensureAuthenticated, cryptoRouter);
app.use("/accounts", signupRouter);
app.use("/accounts", passwordResetRouter);
app.use("/user", ensureAuthenticated, profileRouter);
app.use('/rating', ratingRouter);
app.use("/AI",aiRouter)

// Auth0


  
 
  

// Connect to MongoDB
mongoose
  .connect(process.env.MONGOLINK)
  .then(() => {
    console.log("Successfully connected to online server");
  })
  .catch((error) => {
    console.error("Error connecting to online server:", error);
  });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
