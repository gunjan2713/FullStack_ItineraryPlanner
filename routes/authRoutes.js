// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username, 
      email, 
      password: hashedPassword 
    });
    
    await newUser.save();
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: { id: newUser._id, username: newUser.username, email: newUser.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during signup' 
    });
  }
});

// Login Route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Authentication error' 
      });
    }
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: info.message || 'Invalid credentials' 
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Login error' 
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: { 
          id: user._id, 
          username: user.username, 
          email: user.email 
        }
      });
    });
  })(req, res, next);
});

// Logout Route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Logout failed' 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  });
});

// Check Auth Status Route
router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email
      }
    });
  } else {
    res.json({
      isAuthenticated: false
    });
  }
});

module.exports = router; 