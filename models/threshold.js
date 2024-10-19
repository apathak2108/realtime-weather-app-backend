const mongoose = require('mongoose');

const thresholdSchema = new mongoose.Schema({
  city: { type: String, required: true },
  temperatureThreshold: { type: Number, required: true },
});

module.exports = mongoose.model('Threshold', thresholdSchema);
