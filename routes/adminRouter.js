const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const adminRouter = express.Router();

// check if the user is an admin
function isAdmin(req, res, next) {
  if (req.session.userRole === 'admin') {
    return next(); 
  }
  res.redirect('/accounts/login'); // redirect to login if the user is not an admin
}

adminRouter.get('/profile', isAdmin, async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/accounts/login');
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect('/accounts/login');
    }
    const users = await User.find();
    res.render('adminProfile', {
      title: 'Admin Profile',
      username: user.username,
      email: user.email,
      users: users
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Server error');
  }
});

adminRouter.post('/profile', isAdmin, async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/accounts/login');
  }

  const { email, username } = req.body;

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect('/accounts/login');
    }

    user.email = email || user.email;
    user.username = username || user.username;
    await user.save();

    res.redirect('/admin/profile'); 
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).send('Server error');
  }
});


adminRouter.get('/create-user', isAdmin, (req, res) => {
    res.render('createUser', { title: 'Create New User', errorMessage: null });
  });
  
  adminRouter.post('/create-user', isAdmin, async (req, res) => {
    const { username, email, password, role } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.render('createUser', { title: 'Create New User', errorMessage: 'User already exists' });
      }
  
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
      console.error('Error creating user:', err.message);
      res.status(500).send('Server error');
    }
  });
  
  module.exports = adminRouter;