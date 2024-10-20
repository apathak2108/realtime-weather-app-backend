const express = require("express");
const dotenv = require("dotenv");
const cron = require("node-cron");
const alertRoute = require("./routes/alertRoute");
const cors = require("cors");
const {
  fetchWeatherForAllCities,
  calculateDailySummary,
} = require("./services/weatherService");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 5000;

connectDB();

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Weather Backend Server is running!");
});

cron.schedule("*/30 * * * *", async () => {
  try {
    console.log("Fetching weather data...");
    await fetchWeatherForAllCities();
    console.log("Weather data fetched successfully.");
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
});

cron.schedule("19 7 * * *", async () => {
  try {
    console.log("Calculating daily weather summary...");
    await calculateDailySummary();
    console.log("Daily weather summary calculated successfully.");
  } catch (error) {
    console.error("Error calculating daily summary:", error);
  }
});

app.use("/api/alerts", alertRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
