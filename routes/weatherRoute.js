const express = require("express");
const { getWeatherData } = require("../controllers/weatherController");
const router = express.Router();

router.get("/weather", getWeatherData);

module.exports = router;
