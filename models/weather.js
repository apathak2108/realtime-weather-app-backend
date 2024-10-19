const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  date: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  weatherId: {
    type: Number,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
  },
  feelsLike: {
    type: Number,
    required: true,
  },
  tempMin: {
    type: Number,
    required: true,
  },
  tempMax: {
    type: Number,
    required: true,
  },
  averageTemp: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  sunrise: {
    type: Number,
    required: true,
  },
  sunset: {
    type: Number,
    required: true,
  },
  wind: {
    type: Number,
    required: true,
  },
  alertTriggered: {
    type: Boolean,
    default: false,
  },
});

const Weather = mongoose.model("Weather", weatherSchema);

module.exports = Weather;
