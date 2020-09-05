const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://instagram.com/porschebrasiloficial");
  await page.screenshot({ path: "screenshot.png" });

  const imageList = await page.evaluate(() => {
    const nodeList = document.querySelectorAll("article img");
    const imageArray = [...nodeList];
    const list = imageArray.map(({ src }) => ({ src }));

    return list;
  });

  for (let i = 0; i < imageList.length; i++) {
    const image = imageList[i];

    const imageSource = await page.goto(image.src);
    fs.writeFile(`./media/${i}.png`, await imageSource.buffer(), (err) => {
      if (err) throw new Error("treta na image");
      console.log(`Image ${i} - saved`);
    });
  }

  fs.writeFile("instagram.js", JSON.stringify(imageList, null, 2), (err) => {
    if (err) throw new Error("treta");
    console.log("well done!");
  });

  await browser.close();
})();
