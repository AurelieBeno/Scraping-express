const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");

const cors = require("cors");
const db = require("./lib/db");
const cron = require("./lib/cron");
const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    // receive cookies
    credentials: true,
    // only there domains/origins can access
    origin: ["http://localhost:3000"]
  })
);

const scrapping = require("./routes/data-route");
app.use("/api", scrapping);

module.exports = app;
