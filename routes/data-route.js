const express = require("express");
const db = require("../lib/db");
const Scrape = require("../models/scraper.js");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const data = db.value();
  console.log("data", data);
  res.status(200).json(data);
});

router.get("/data", async (req, res, next) => {
  let response = await Scrape.runCron();
  console.log(response);
  res.status(200).json(response);
});

module.exports = router;
