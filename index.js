const puppeteer = require('puppeteer');

const TARGET_PAGE = 'https://m.facebook.com/bnk48official.cherprang/posts/';
const EMAIL = "CosmoCruz01@gmail.com";
const PASSWORD = "1234Cosmo";

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
    // auto scroll every  1 sec  for loadmore content

    const likeNumber = await page.$eval('#msite-pages-header-contents > div:nth-child(0n+2) >  div:nth-child(0n+4) > div > div > div > div > div', el => el.textContent);
    const htmlContents = await page.$eval('#msite-pages-header-contents', el => el.outerHTML);
    // console.log("likeNumber", likeNumber);
    // console.log('htmlContents',htmlContents);

    const body = await page.$("#pages_msite_body_contents");
    const body2 = await page.$eval("#pages_msite_body_contents", x => x.outerHTML);
    // console.log('body',body2);
    //  const div = await body.$('.story_body_container');
    //  const msg =  await div.$("div[data-ad-preview='message']");    
    const story = await body.$$('article')
    
    for (let item of story) { 
      const like = await getPostLike(item);
      const comment = await getPostComment(item);
      const share = await getPostShare(item);

      console.log('Like',like);
      console.log('comment',comment);
      console.log('share',share);

      // const content = await item.$(".story_body_container  > div[data-ad-preview='message']");
      // const message = await getTextContent(content);
      // const link = await getLinkContent(content);

      // console.log("post  message", message);
      // console.log("link", link)
    }


    // console.log(linkArray);
    // console.log("p" ,  p);
    //  // const  l1  =  await link[0].$eval();
    //  console.log("link" , link );

    // console.log(link);

    // for (let element of link) {

    //      /// items.push(element.href);
    // }
    // const msg =  await div.$eval("div[data-ad-preview='message'] > span:nth-child(0n+1)" , m => m.textContent); 

    // const  div = await body.$$eval('.story_body_container'  ,  nodes => nodes.map(  async( n )=> {
    //      return n.$$eval("article" , a => a.outerHTML)
    // })) 

    // const  div = await body.$eval('.story_body_container');
    //const  cont = await body.$$eval('.story_body_container');

    //console.log("content" ,  content);

    //  console.log("len" ,link);
    //console.log("div", cont);

    //  div.map( async( d ) => {
    //       d.$$eval("")  
    //  })

    // const  div  = await body.$eval("" , el => el.outerHTML);

    //console.log("body" , body);
    // console.log("body" ,  body);


    // await autoScroll(page);

    //Todo : scrape data

  }, 5000)

  // await browser.close();
})();

async function getPostLike(content) {
  return like = await content.$eval(
    'footer > div > div:nth-child(0n+1) > a > div:nth-child(0n+1) > div > div',
    d => d.textContent
  );
}

async function getPostComment(content) {
  return comment = await content.$eval(
    'footer > div > div:nth-child(0n+1) > a > div > div:nth-child(0n+2) > span:nth-child(0n+1)',
    s => s.textContent
  );
}
 async function getPostShare(content) {
   return share = await content.$eval(
     'footer > div > div:nth-child(0n+1) > a > div > div:nth-child(0n+2) > span:nth-child(0n+2)',
     s => s.textContent
    );
 }

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