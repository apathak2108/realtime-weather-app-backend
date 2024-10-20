const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

const getWeatherData = async (req, res) => {
  const { city, lat, lon } = req.query;

  let weatherAPIUrl;

  if (city) {
    weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
  } else if (lat && lon) {
    weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  } else {
    return res
      .status(400)
      .json({ message: "Please provide a city or lat/lon coordinates" });
  }

  try {
    const response = await axios.get(weatherAPIUrl);

    if (response.status === 200) {
      return res.status(200).json(response.data);
    } else {
      return res
        .status(response.status)
        .json({ message: "Error fetching weather data" });
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  getWeatherData,
};
