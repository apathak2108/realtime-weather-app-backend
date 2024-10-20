const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  weatherData: {
    type: Object,
    required: true,
  },
  alertTriggered: {
    type: Boolean,
    default: false,
  },
});

const Weather = mongoose.model("Weather", weatherSchema);

module.exports = Weather;
