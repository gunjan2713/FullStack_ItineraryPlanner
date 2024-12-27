const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  day: { type: mongoose.Schema.Types.ObjectId, ref: 'Day', required: true },
  name: { type: String, required: true }, // e.g., "Visit Central Park"
  time: { type: String, required: true }, // e.g., "10:00 AM - 12:00 PM"
  location: { type: String }, 
  duration: { type: String }, 
  cost: { type: Number, default: 0 }, 
  notes: { type: String } 
});

module.exports = mongoose.model('Activity', ActivitySchema);
