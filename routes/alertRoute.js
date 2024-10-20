const express = require("express");
const Threshold = require("../models/threshold");
const Weather = require("../models/weather");
const router = express.Router();

// POST route to set temperature threshold
router.post("/set-threshold", async (req, res) => {
  const { city, temperatureThreshold } = req.body;

  if (!city || temperatureThreshold === undefined) {
    return res.status(400).json({ message: "City and threshold are required" });
  }

  try {
    const threshold = await Threshold.findOneAndUpdate(
      { city },
      { temperatureThreshold },
      { new: true, upsert: true }
    );

    res.json({ message: `Threshold set for ${city} at ${temperatureThreshold}°C`, threshold });
  } catch (err) {
    res.status(500).json({ error: "Error setting threshold" });
  }
});

// GET route to check alerts
router.get("/check-alerts/:city", async (req, res) => {
  try {
    const city = req.params.city; 

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const weatherRecords = await Weather.find({
      city: city,
      date: { $gte: startOfDay.getTime() / 1000, $lt: endOfDay.getTime() / 1000 },
    });

    if (weatherRecords.length === 0) {
      return res.status(404).json({ message: `No weather records found for ${city}` });
    }

    const alerts = await Promise.all(
      weatherRecords.map(async (record) => {
        const threshold = await Threshold.findOne({ city: record.city });
        if (threshold && record.temperature > threshold.temperatureThreshold) {
          return record.city;
        }
        return null;
      })
    );

    const citiesExceedingThreshold = alerts.filter((city) => city !== null);

    res.json({
      message: citiesExceedingThreshold.length > 0 ? "Alert triggered" : "No alerts",
      cities: citiesExceedingThreshold,
    });
  } catch (error) {
    console.error("Error checking alerts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
