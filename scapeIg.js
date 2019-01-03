const puppeteer = require('puppeteer');

const TARGET_PAGE = 'https://www.instagram.com/cherprang.bnk48official/';

// const EMAIL = "CosmoCruz01@gmail.com";
// const PASSWORD = "1234Cosmo";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
//   const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(TARGET_PAGE);
  
  const data = {
    userName: '',
    name: '',
    post: '',
    followers: '',
    following: '',
    description: '',
    hashtag: ''
  }

  const htmlHeader = await page.$('header');

  data.userName = await getUsername(htmlHeader);
  data.name = await getName(htmlHeader);
  data.post = await getCountPost(htmlHeader);
  data.followers = await getCountFollowers(htmlHeader);
  data.following = await getCountFollowing(htmlHeader);
  data.description = await getDescription(htmlHeader)
  data.hashtag = await getHashtag(htmlHeader)

  console.log('dataProfile',data)
})();

async function getUsername(content) {
    return name = await content.$eval(
        'header > section > div > h1',
      h => h.textContent
    );
}

async function getName(content) {
    return name = await content.$eval(
        'header > section > div:nth-child(0n+3) > h1',
      h => h.textContent
    );
}

async function getCountPost(content) {
    return count = await content.$eval(
        'header > section > ul > li:nth-child(0n+1) > a > span',
      s => s.textContent
    );
}

async function getCountFollowers(content) {
    return count = await content.$eval(
        'header > section > ul > li:nth-child(0n+2) > a > span',
      s => s.title
    );
}

async function getCountFollowing(content) {
    return count = await content.$eval(
        'header > section > ul > li:nth-child(0n+3) > a > span',
      s => s.textContent
    );
}

async function getDescription(content) {
    return description = await content.$eval(
        'header > section > div:nth-child(0n+3) > span',
      s => s.textContent
    );
}

async function getHashtag(content) {

    return hashtag = await content.$$eval(
        'header > section > div:nth-child(0n+3) > span > a',
      s => {
          return s.map(item => item.textContent);
        }
    );

}
