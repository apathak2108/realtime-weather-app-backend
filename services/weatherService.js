const axios = require("axios");
const dotenv = require("dotenv");
const Weather = require("../models/weather");
const Threshold = require("../models/threshold");
const connectDB = require("../config/db");
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
  await connectDB();
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );

    const tempMin = response.data.main.temp_min - 273.15;
    const tempMax = response.data.main.temp_max - 273.15;

    const weatherData = {
      date: response.data.dt,
      city: response.data.name,
      country: response.data.sys.country,
      weatherId: response.data.weather[0].id,
      temperature: response.data.main.temp - 273.15,
      condition: response.data.weather[0].description,
      weather: response.data.weather[0].main,
      feelsLike: response.data.main.feels_like - 273.15,
      tempMin,
      tempMax,
      averageTemp: (tempMin + tempMax) / 2,
      humidity: response.data.main.humidity,
      sunrise: response.data.sys.sunrise,
      sunset: response.data.sys.sunset,
      wind: response.data.wind.speed,
    };

    const weatherRecord = new Weather(weatherData);
    await weatherRecord.save();

    await checkForAlerts(city, weatherData.temperature);
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error.message || error);
  }
};

const fetchWeatherForAllCities = async () => {
  await connectDB();
  await Promise.all(cities.map((city) => fetchWeatherForCity(city)));
};

const calculateDailySummary = async () => {
  await connectDB();

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  for (const city of cities) {
    const weatherRecords = await Weather.find({
      city,
      date: { $gte: startOfDay.getTime() / 1000, $lt: endOfDay.getTime() / 1000 },
    });

    if (weatherRecords.length > 0) {
      const totalTemperature = weatherRecords.reduce(
        (sum, record) => sum + record.temperature,
        0
      );
      const maxTemperature = Math.max(
        ...weatherRecords.map((record) => record.temperature)
      );
      const minTemperature = Math.min(
        ...weatherRecords.map((record) => record.temperature)
      );
      const conditionCounts = weatherRecords.reduce((acc, record) => {
        acc[record.condition] = (acc[record.condition] || 0) + 1;
        return acc;
      }, {});

      const dominantCondition = Object.keys(conditionCounts).reduce((a, b) =>
        conditionCounts[a] > conditionCounts[b] ? a : b
      );

      const dailySummaryData = {
        date: startOfDay,
        city: city,
        averageTemperature: totalTemperature / weatherRecords.length,
        maxTemperature,
        minTemperature,
        dominantCondition,
      };

      try {
        await DailyWeatherSummary.updateOne(
          { date: startOfDay, city: city },
          { $set: dailySummaryData },
          { upsert: true }
        );
        console.log(`Daily summary for ${city} on ${startOfDay} saved/updated successfully.`);
      } catch (error) {
        console.error(`Error saving daily summary for ${city}:`, error.message || error);
      }
    }
  }
};

const checkForAlerts = async (city, temperature) => {
  const threshold = await Threshold.findOne({ city });
  if (threshold && temperature > threshold.temperatureThreshold) {
    console.log(`Alert triggered for ${city}: Temperature ${temperature} exceeds threshold ${threshold.temperatureThreshold}`);
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    await Weather.updateOne(
      { city, date: { $gte: startOfDay.getTime() / 1000, $lt: endOfDay.getTime() / 1000 } },
      { $set: { alertTriggered: true } }
    );
  }
};

module.exports = {
  fetchWeatherForAllCities,
  calculateDailySummary,
};
