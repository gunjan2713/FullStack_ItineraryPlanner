require('./config.js');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const itineraryRoutes = require('./routes/itineraryRoutes');
const path = require('path');
const session = require('express-session');
const connectDB = require('./db');
const hbs = require('hbs');
const authRoutes = require('./routes/authRoutes.js');
const dayRoutes = require('./routes/dayRoutes.js');
const activityRoutes = require('./routes/activityRoutes.js')
const initializePassport = require('./passport-config');
const passport = require('passport');
const cors = require('cors');

// Add this line before defining your routes

connectDB();
mongoose.connection.syncIndexes();
const app = express();
initializePassport(passport);
app.use(cors());

// OR configure CORS for specific origins
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from React frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // If you use cookies, authentication headers, etc.
}));
// Session configuration
const sessionOptions = {
  secret: '126%#@U$Y%T2bdyr72',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,        // Ensures cookie cannot be accessed via JavaScript
    secure: false,         // Set to true if using HTTPS in production
    sameSite: 'lax',       // 'Strict' or 'None' for stricter cookie handling
  }
};
app.use(session(sessionOptions));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

// View engine setup (for legacy support)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Helper function for date
hbs.registerHelper('formatDate', function (date) {
  return new Date(date).toLocaleDateString();
});


// module.exports = authenticateUser;


app.use('/api', itineraryRoutes);
app.use('/api', authRoutes);
app.use('/api', dayRoutes);
app.use('/api', activityRoutes);

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/dist')));

// Catch-all route - This should be LAST
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});