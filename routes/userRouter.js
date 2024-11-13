require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const userRouter = express.Router();

userRouter.get('/profile', (req, res) => {
    if (req.user) {
        res.render('profile', { name: req.user.name }); // Pass the name to the profile page
    } else {
        res.redirect('/login');
    }
});

module.exports = userRouter;