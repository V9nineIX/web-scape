const puppeteer = require('puppeteer');

const TARGET_PAGE = 'https://m.facebook.com/bnk48official.cherprang/';
const EMAIL = "CosmoCruz01@gmail.com";
const PASSWORD = "1234Cosmo";

(async() => {

  const browser = await puppeteer.launch({headless: false});
  //const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://m.facebook.com/login.php');

  await page.type('#m_login_email', EMAIL);
  await page.type('#m_login_password', PASSWORD);
  await page.click("button[name='login']")

  //  wait  5 sec for change page after login
  setTimeout(async() => {
    await page.goto(TARGET_PAGE); //
    await page.setViewport({width: 1200, height: 800});
    // auto scroll every  1 sec  for loadmore content
    await autoScroll(page);

    //Todo : scrape data



    

  }, 5000)

  // await browser.close();
})();

async function autoScroll(page) {
  await page.evaluate(async() => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 1000);
    });
  });
}