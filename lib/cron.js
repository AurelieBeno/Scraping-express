const cron = require("node-cron");
const runCron = require("../models/scraper").runCron;

cron.schedule("0,30 * * * *", () => {
  console.log("CRON IS RUNNING !!");
  runCron();
});
