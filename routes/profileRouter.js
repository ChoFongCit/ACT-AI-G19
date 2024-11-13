const express = require("express");
const User = require("../models/users");
const profileRouter = express.Router();
const transporter = require("../mailer");

function isLoggedIn(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/accounts/login");
  }
  next(); 
}


profileRouter.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect("/accounts/login");
    }
    res.render("profile", {
      title: "Your Profile",
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Server error");
  }
});

profileRouter.post("/profile", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/accounts/login");
  }

  const { email, username } = req.body;

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect("/accounts/login");
    }

    user.email = email || user.email;
    user.username = username || user.username;
    await user.save();
    res.redirect("/user/profile");
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send("Server error");
  }
});

profileRouter.post("/profile", isLoggedIn, async (req, res) => {
  const { email, username } = req.body;

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect("/accounts/login");
    }

    user.email = email || user.email;
    user.username = username || user.username;
    await user.save();
    res.redirect("/user/profile");
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send("Server error");
  }
});

module.exports = profileRouter;
