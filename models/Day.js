const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
  itinerary: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary', required: true },
  dayNumber: { type: Number, required: true }, 
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }], 
  date: { type: Date } 
});

module.exports = mongoose.model('Day', DaySchema);
