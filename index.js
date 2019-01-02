const puppeteer = require('puppeteer');

const TARGET_PAGE = 'https://m.facebook.com/bnk48official.cherprang/posts/';
const EMAIL = "CosmoCruz01@gmail.com";
const PASSWORD = "1234Cosmo";
const ITEM_TARGET_COUNT = 10;

(async () => {

  const browser = await puppeteer.launch({ headless: true });
  //const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://m.facebook.com/login.php');

  await page.type('#m_login_email', EMAIL);
  await page.type('#m_login_password', PASSWORD);
  await page.click("button[name='login']")

  //  wait  5 sec for change page after login
  setTimeout(async () => {
    await page.goto(TARGET_PAGE); //
    await page.setViewport({ width: 1200, height: 800 });

    const likeNumber = await page.$eval('#msite-pages-header-contents > div:nth-child(0n+2) >  div:nth-child(0n+4) > div > div > div > div > div', el => el.textContent);
    console.log("likeNumber", likeNumber);

    // const body = await page.$("#pages_msite_body_contents");
    // const story = await body.$$('article')
    // console.log("article length" , story.length)

    const article = await scrapeInfiniteScrollItems(page,ITEM_TARGET_COUNT)

    console.log("total item" , article.length);
  

    for (let item of article ) {
      //Todo : scrape data
      const content = await item.$(".story_body_container  > div[data-ad-preview='message']");
      const message = await getTextContent(content);
      const link = await getLinkContent(content);

      console.log("post  message", message);
      console.log("link", link)
    }

  }, 5000)

  // await browser.close();
})();


async function getLinkContent(content) {
  //  get  all  link  in post 
  return link = await content.$$eval("a", a => {
    return a.map(item => {
      return item.href;
    })
  });

}


async function getTextContent(content) {
  return message = await content.$$eval("p", p => {
    return p.map(item => item.textContent);
  });
}

async function autoScroll(page) {
  await page.evaluate(async () => {
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


/**  Use for  scorll  load more content  with stop by item limit number.
 * 
 * @param {object} page  //  page dom  object  for puppeteer
 * @param {number} itemLimit //  stop scoroll when  limit Item
 * @param {number} scrollDelay  //  scroll  deleay  in ms 
 */
async function scrapeInfiniteScrollItems(
  page,
  itemLimit ,
  scrollDelay = 1000,
) {
  let items = [];
  const body = await page.$("#pages_msite_body_contents");
  try {
    let previousHeight ;
    while (items.length < itemLimit) {
      items = await body.$$('article') //  get all  atrical  in  body contents
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
  } catch(e) { }
  return items;
}
