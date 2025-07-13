// Node.js script to scrape price from a product URL using Puppeteer
const puppeteer = require('puppeteer');

async function scrapePrice(url, selector) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const price = await page.$eval(selector, el => el.textContent.trim());
  await browser.close();
  return price;
}

// Example usage:
// node scrape-price.js 'https://www.amazon.in/dp/B0CHX1Z1J1' '#priceblock_ourprice'
if (require.main === module) {
  const [,, url, selector] = process.argv;
  scrapePrice(url, selector)
    .then(price => {
      console.log('Scraped price:', price);
    })
    .catch(err => {
      console.error('Error scraping price:', err);
    });
}

module.exports = scrapePrice;
