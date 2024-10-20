const axios = require("axios");
const dotenv = require("dotenv");
const Weather = require("../models/weather");
const Threshold = require("../models/threshold");
const DailyWeatherSummary = require("../models/dailyWeatherSummary");

dotenv.config();

const cities = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "Hyderabad",
];

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

const fetchWeatherForCity = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );

    const weatherData = response.data;

    try {
      const weatherRecord = new Weather({
        weatherData: weatherData,
      });
      await weatherRecord.save();
      console.log("Weather data saved successfully.");
    } catch (error) {
      console.error("Error saving weather data:", error.message);
    }

    await checkForAlerts(city, weatherData.temperature);
  } catch (error) {
    console.error(
      `Error fetching weather for ${city}:`,
      error.message || error
    );
  }
};

const fetchWeatherForAllCities = async () => {
  await Promise.all(cities.map((city) => fetchWeatherForCity(city)));
};

const calculateDailySummary = async () => {
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

  for (const city of cities) {
    try {
      const weatherData = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );

      const dailySummaryData = {
        date: startOfDay,
        city: city,
        weatherData: weatherData.data,
      };

      await DailyWeatherSummary.updateOne(
        { date: startOfDay, city: city },
        { $set: dailySummaryData },
        { upsert: true }
      );
      console.log(
        `Daily summary for ${city} on ${startOfDay} saved/updated successfully.`
      );
    } catch (error) {
      console.error(
        `Error fetching or saving data for ${city}:`,
        error.message
      );
    }
  }
};

const checkForAlerts = async (city, temperature) => {
  try {
    if (temperature === undefined) {
      console.log(`Temperature for ${city} is undefined.`);
      return;
    }

    const threshold = await Threshold.findOne({ city });

    if (threshold && temperature > threshold.temperatureThreshold) {
      console.log(
        `Alert triggered for ${city}: Temperature ${temperature} exceeds threshold ${threshold.temperatureThreshold}`
      );

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

      const updatedWeather = await Weather.updateOne(
        {
          city: city,
          date: {
            $gte: Math.floor(startOfDay.getTime() / 1000),
            $lt: Math.floor(endOfDay.getTime() / 1000),
          },
        },
        { $set: { alertTriggered: true } }
      );

      if (updatedWeather.nModified > 0) {
        console.log(
          `Weather record for ${city} updated with alertTriggered flag.`
        );

        const recipientEmail = "ananyapathak190@gmail.com";
        await sendAlertEmail(recipientEmail, city);

        console.log(
          `Alert email sent for ${city}. Temperature exceeded threshold ${threshold.temperatureThreshold}.`
        );
      } else {
        console.log(
          `No weather record found for ${city} on the current day to update.`
        );
      }
    } else {
      console.log(
        `No alert triggered for ${city}. Current temperature (${temperature}°C) is below the threshold (${
          threshold ? threshold.temperatureThreshold : "No threshold set"
        }°C).`
      );
    }
  } catch (error) {
    console.error(`Error checking for alerts in ${city}:`, error);
  }
};

module.exports = {
  fetchWeatherForAllCities,
  calculateDailySummary,
  checkForAlerts,
};
