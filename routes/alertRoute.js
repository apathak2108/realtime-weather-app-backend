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

    res.json({
      message: `Threshold set for ${city} at ${temperatureThreshold}°C`,
      threshold,
    });
  } catch (err) {
    res.status(500).json({ error: "Error setting threshold" });
  }
});

// GET route to check alerts
router.get("/check-alerts/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const weatherRecords = await Weather.find({
      city: city,
      date: {
        $gte: startOfDay.getTime() / 1000,
        $lt: endOfDay.getTime() / 1000,
      },
    });

    if (weatherRecords.length === 0) {
      return res
        .status(404)
        .json({ message: `No weather records found for ${city}` });
    }

    let alertTriggered = false;

    for (const record of weatherRecords) {
      const threshold = await Threshold.findOne({ city: record.city });
      if (threshold && record.temperature > threshold.temperatureThreshold) {
        alertTriggered = true;

        const recipientEmail = "ananyapathak190@gmail.com";
        await sendAlertEmail(recipientEmail, city, threshold);

        console.log(
          `Alert email sent for ${city}. Temperature exceeded threshold ${threshold}.`
        );
      }
    }

    res.json({
      message: alertTriggered ? "Alert triggered and email sent." : "No alerts",
    });
  } catch (error) {
    console.error("Error checking alerts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
