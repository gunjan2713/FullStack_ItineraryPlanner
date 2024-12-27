const express = require('express');
const router = express.Router();
const Day = require('../models/Day');
const authenticateUser = require('../middleware/authenticateUser');

// Create a day
router.post('/:itineraryId/create-day', authenticateUser, async (req, res) => {
  const { dayNumber, date } = req.body;
  const { itineraryId } = req.params;

  try {
    // Optionally validate the itineraryId (e.g., format, user authorization)
    const newDay = new Day({
      itinerary: itineraryId, // Directly use the itineraryId from params
      dayNumber,
      date,
    });

    await newDay.save();
    res.status(201).json(newDay);
  } catch (err) {
    res.status(500).json({ error: 'Error creating day: ' + err.message });
  }
});

// Get days for a specific itinerary
router.get('/:itineraryId/days', authenticateUser, async (req, res) => {
  const { itineraryId } = req.params;

  try {
    const days = await Day.find({ itinerary: itineraryId }); // Use itineraryId directly
    res.json(days);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching days: ' + err.message });
  }
});

module.exports = router;
