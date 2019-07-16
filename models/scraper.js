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
  await scrape();

  // const beforeSaving = [];

  let dataValue = db.get("scrappedData").value();
  // .map(post => post.name);

  // datas = dataValue.concat(scrappedData);
  // console.log(datas.length);
  // let foo = new Map();
  // for (const c of datas) {
  //   foo.set(c.name, c);
  // }
  // Array avec titre unique ancient et nouveau
  // let final = [...foo.values()];
  console.log("dataValue", dataValue.length);

  function comparer(otherArray) {
    return function(current) {
      return (
        otherArray.filter(function(other) {
          return other.name == current.name;
        }).length == 0
      );
    };
  }
  const dataToAdd = scrappedData.filter(
    comparer(dataValue)
  );

  console.log("RESULT ", dataToAdd.length);
  // dataValue.length === final.length
  //   ? "Pas de nouveau post "
  //   : final;
  // ************TO DO ********* *
  // Verifier dataValue.length et final.length
  //   si length est égal alors pas de nouveau post
  // Si different push dans arr result
  // const newState = { scrappedData };
  // db.setState(newState);

  // console.log("TEST COMBINED", final.length);
  // console.log("RESULT", result);
  await db
    .get("scrappedData")
    .push(dataToAdd)
    .write();
  console.log("Done");
  // await db
  //   .get("scrappedData")
  //   .push({ result })
  //   .write();
  // console.log("Done");
}

module.exports = { scrape, runCron };
