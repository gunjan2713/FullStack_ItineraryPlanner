const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  day: { type: mongoose.Schema.Types.ObjectId, ref: 'Day'},
  name: { type: String }, 
  time: { type: String }, 
  location: { type: String }, 
  duration: { type: String }, 
  cost: { type: Number, default: 0 }, 
  notes: { type: String } 
});

module.exports = mongoose.model('Activity', ActivitySchema);
