// middleware/authenticateUser.js
const express = require('express');

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized. Please log in.' });
};

module.exports = authenticateUser;
