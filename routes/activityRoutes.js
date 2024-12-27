const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const authenticateUser = require('../middleware/authenticateUser')
// Create an activity
router.post('/:dayId/add-activity', authenticateUser, async (req, res) => {
  const { name, time, location, duration, cost, notes } = req.body;
  const { dayId } = req.params;
  try {
    const newActivity = new Activity({
      day: dayId,
      name,
      time,
      location,
      duration,
      cost,
      notes,
    });
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(500).json({ error: 'Error creating activity: ' + err.message });
  }
});

// Get activities for a specific day
router.get('/:dayId/activities', authenticateUser, async (req, res) => {
  const { dayId } = req.params;
  try {
    const activities = await Activity.find({ day:dayId });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching activities: ' + err.message });
  }
});

module.exports = router;
