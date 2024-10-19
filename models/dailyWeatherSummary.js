const mongoose = require("mongoose");

const dailyWeatherSummarySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  averageTemperature: {
    type: Number,
    required: true,
  },
  maxTemperature: {
    type: Number,
    required: true,
  },
  minTemperature: {
    type: Number,
    required: true,
  },
  dominantCondition: {
    type: String,
    required: true,
  },
});

dailyWeatherSummarySchema.index({ date: 1, city: 1 }, { unique: true });

const DailyWeatherSummary = mongoose.model("DailyWeatherSummary", dailyWeatherSummarySchema);

module.exports = DailyWeatherSummary;
