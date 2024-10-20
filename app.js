const express = require("express");
const dotenv = require("dotenv");
const cron = require("node-cron");
const alertRoute = require("./routes/alertRoute");
const weatherRoutes = require("./routes/weatherRoute");
const cors = require("cors");

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

app.use("/api", weatherRoutes);

app.use("/api/alerts", alertRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
