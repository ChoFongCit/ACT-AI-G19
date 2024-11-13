require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const signupRouter = express.Router();


signupRouter.route('/register')
    .get((req, res) => {
        res.render('register', { title: 'Register', errorMessage: null });
    })
    .post(async (req, res) => {
        const { username, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) return res.render('register', { title: 'Register', errorMessage: 'User already exists' });

            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({
                username,
                email,
                password: hashedPassword
            });

            await user.save();

            // Redirect to the login page after successful registration
            res.redirect('/accounts/login');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

// Route for admin only user creation 
signupRouter.route('/admin/register')
    .get((req, res) => {
        res.render('createUser', { title: 'Admin Register', errorMessage: null });
    })
    .post(async (req, res) => {
        const { username, email, password, role } = req.body;

        if (req.session.userRole !== 'admin') {
            return res.redirect('/accounts/login');  
        }

        try {
            let user = await User.findOne({ email });
            if (user) return res.render('createAdmin', { title: 'Admin Register', errorMessage: 'User already exists' });

            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({
                username,
                email,
                password: hashedPassword,
                role: role || 'user'
            });

            await user.save();

            res.redirect('/admin/profile');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

module.exports = signupRouter;