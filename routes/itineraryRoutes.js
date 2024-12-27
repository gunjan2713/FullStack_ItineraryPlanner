// routes/itineraryRoutes.js
const express = require('express');
const router = express.Router();
const Itinerary = require('../models/Itinerary');
const Activity = require('../models/Activity')
const Day = require('../models/Day');
const authenticateUser = require('../middleware/authenticateUser')
// const { User } = require('./models/user'); 


// POST route to create itinerary
router.post('/create-itinerary', authenticateUser, (req, res) => {
  const { title, startDate, endDate, destination } = req.body;

  const newItinerary = new Itinerary({
    user: req.user._id, 
    title,
    startDate, 
    endDate,  
    destination,
  });

  newItinerary.save()
    .then(itinerary => {
      res.status(201).json(itinerary);
    })
    .catch(err => {
      res.status(500).json({ error: 'Error saving itinerary: ' + err });
    });
});

router.get('/itineraries', authenticateUser, (req, res) => {
  console.log('Authenticated User:', req.user); // Check if the user is properly set
  Itinerary.find({ user: req.user._id })
    .then(itineraries => {
      res.json(itineraries);
    })
    .catch(err => {
      res.status(500).json({ error: 'Error fetching itineraries: ' + err });
    });
});


// GET route to view a single itinerary
router.get('/itineraries/:id',authenticateUser, (req, res) => {
  const itineraryId = req.params.id;
  Itinerary.findById({ _id: itineraryId, user: req.user._id })
    .then(itinerary => {
      if (!itinerary) {
        return res.status(404).json({ error: 'Itinerary not found' });
      }
      res.json(itinerary);
    })
    .catch(err => {
      res.status(500).json({ error: 'Error fetching itinerary: ' + err });
    });
});

// DELETE route to delete an itinerary
router.delete('/itineraries/:id', authenticateUser, (req, res) => {
  const itineraryId = req.params.id;

  Itinerary.deleteOne( { _id: req.params.id, user: req.user._id })
    .then(result => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Itinerary not found' });
      }
      res.json({ message: 'Itinerary deleted successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: 'Error deleting itinerary: ' + err });
    });
});

module.exports = router;