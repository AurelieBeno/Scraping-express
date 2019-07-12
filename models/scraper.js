const db = require("../lib/db");
const puppeteer = require("puppeteer");

let scrappedData = new Array();

async function scrape() {
  // vide au debut pour les prochains tours
  scrappedData = [];
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  // await page.setViewport({ width: 1920, height: 2160 });

  await page.goto("https://www.freecodecamp.org/news/", {
    waitUntil: "networkidle2"
  });
  await page.click("#readMoreBtn");
  await page.waitFor(1000);

  const dataToScrape = await page.$$("article.post-card");

  for (let data of dataToScrape) {
    let name = await data.$eval("h2.post-card-title", s =>
      s.textContent.trim()
    );
    let link = await data.$eval(
      "a.post-card-image-link",
      s => s.href
    );
    let image = await data.$eval(
      "img.post-card-image",
      s => s.src
    );
    let title = await data.$eval("a.meta-item", s =>
      s.textContent.trim()
    );

    scrappedData.push({ name, title, image, link });
  }

  browser.close();
  console.log(
    "********SCRAPED DATA*****",
    scrappedData.length
  );

  return scrappedData;
}

async function runCron() {
  const beforeSaving = [];
  await scrape();

  const newState = { scrappedData };
  db.setState(newState);

  await db
    .get("post")
    .push({
      dateOfScrapping: Date.now(),
      data: beforeSaving
    })
    .write();
  console.log("Done");
}

module.exports = { scrape, runCron };
