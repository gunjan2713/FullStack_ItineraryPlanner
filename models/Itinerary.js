const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  title: { type: String, required: true }, 
  startDate: {type: Date } ,
  endDate: {type: Date } ,
  destination: { type: String, required: true },
  
});

// Define the model only once
const Itinerary = mongoose.models.Itinerary || mongoose.model('Itinerary', ItinerarySchema);

module.exports = Itinerary;
