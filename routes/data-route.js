const express = require("express");
const db = require("../db.json");
const Scrape = require("../models/scraper.js");

const router = express.Router();

router.get("/", async (req, res, next) => {
  let response = await Scrape.runCron();
  console.log(response);
  // res.status(200).json(response);
});

router.get("/data", async (req, res, next) => {
  res.status(200).json(db);
});

module.exports = router;
