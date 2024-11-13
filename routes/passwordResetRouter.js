const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/users');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const router = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Request Password Reset
router.get('/request-password-reset', (req, res) => {
    res.render('passwordResetRequest', { title: 'Request Password Reset', errorMessage: null, successMessage: null });
});

// Handle Password Reset
router.post('/request-password-reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('passwordResetRequest', { title: 'Request Password Reset', errorMessage: 'No user found with this email', successMessage: null });
        }

        // Generate token and set expiration
        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetURL = `http://127.0.0.1:3000/accounts/reset-password/${token}`; 
        const msg = {
            to: email,
            from: 'AgenticCorporateTrader@gmail.com',
            subject: 'ACT-AI Password Reset',
            html: `<p>You have requested a password reset. 
                   Click <a href="${resetURL}">here</a> to reset your password.</p>`
        };

        await sgMail.send(msg);
        res.render('passwordResetRequest', { title: 'Request Password Reset', errorMessage: null, successMessage: 'Email sent. Check your spam' });
    } catch (error) {
        console.error(error);
        res.render('passwordResetRequest', { title: 'Request Password Reset', errorMessage: 'Failed to send email', successMessage: null });
    }
});

router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
        if (!user) {
            return res.render('passwordResetRequest', { title: 'Request Password Reset', errorMessage: 'Token has expired', successMessage: null });
        }
        res.render('passwordResetForm', { title: 'Reset Password', token, errorMessage: null });
    } catch (err) {
        console.error(err);
        res.render('passwordResetRequest', { title: 'Request Password Reset', errorMessage: 'Server error', successMessage: null });
    }
});

router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;

    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
        if (!user) {
            return res.render('passwordResetForm', { title: 'Reset Password', token, errorMessage: 'Token has expired' });
        }

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password, salt);

        // Clear the reset token and expiration
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        await user.save();
        res.render('login', { title: 'Login', errorMessage: null, successMessage: 'Password has been reset successfully. Please log in.' });
    } catch (error) {
        console.error(error);
        res.render('passwordResetForm', { title: 'Reset Password', token, errorMessage: 'Server error' });
    }
});

module.exports = router;
