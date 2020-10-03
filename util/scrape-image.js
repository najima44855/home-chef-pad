const puppeteer = require('puppeteer');

async function scrapeImage(query) {
    let url = "https://www.google.com/search?tbm=isch&q=" + query.replace(/ /, '+');

    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();

    await page.goto(url);

    let links = await page.$$('a.islib', as => as.map(a => a));
    await links[0].click();
    let first = await page.evaluate(a => a.href, links[0]);

    await page.goto(first);
    const imgs = await page.$$eval('img[src]', imgs => imgs.map(img => img.getAttribute('src')));

    console.log(imgs[0]);

    await browser.close();
}

scrapeImage('pizza');