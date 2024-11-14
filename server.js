const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
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
const cryptoRouter = require("./routes/cryptoRouter");
const stockRouter = require("./routes/stockRouter");
const passwordResetRouter = require("./routes/passwordResetRouter");
const profileRouter = require("./routes/profileRouter");
const portfolioRouter = require('./routes/portfolioRouter')

// these are found in the roots folder since they handle a url, these are get methods
app.use('/', homeRouter);
app.use('/accounts', loginRouter);
app.use('/', portfolioRouter)
app.use("/stocks", stockRouter);
app.use("/crypto", cryptoRouter);
app.use("/accounts", signupRouter);
app.use("/accounts", passwordResetRouter);
app.use("/user", profileRouter);

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
