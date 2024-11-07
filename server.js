const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");


const app = express();
const url = "mongodb://127.0.0.1:27017/loginRoute"
const port = 3000;

require('dotenv').config();
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }
// }));


app.use(flash());

// View engine setup
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const loginRouter = require("./routes/loginRouter");
const homeRouter = require("./routes/homeRouter");
const userRouter = require("./routes/userRouter");
const signupRouter = require("./routes/signUpRouter");
const cryptoRouter = require("./routes/cryptoRouter");
const stockRouter = require("./routes/stockRouter");
const passwordResetRouter = require("./routes/passwordResetRouter");
const profileRouter = require("./routes/profileRouter");

app.use("/", homeRouter);
app.use("/accounts", loginRouter);
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
