// Node.js script to scrape prices and update Supabase
const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Example: selector for Amazon price
const SELECTORS = {
  'amazon.in': '#priceblock_ourprice, #priceblock_dealprice',
  'flipkart.com': '._30jeq3._16Jk6d',
};

async function scrapePrice(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  let price = null;
  for (const domain in SELECTORS) {
    if (url.includes(domain)) {
      try {
        price = await page.$eval(SELECTORS[domain], el => el.textContent.trim());
        break;
      } catch {}
    }
  }
  await browser.close();
  return price;
}

async function updatePrices() {
  const { data: products } = await supabase.from('products').select('id, url');
  for (const product of products) {
    const priceStr = await scrapePrice(product.url);
    if (priceStr) {
      // Remove currency symbols, commas, etc.
      const price = parseFloat(priceStr.replace(/[^\d.]/g, ''));
      await supabase.from('price_history').insert([
        { product_id: product.id, price }
      ]);
      console.log(`Updated price for ${product.url}: ₹${price}`);
    } else {
      console.log(`Could not scrape price for ${product.url}`);
    }
  }
}

updatePrices();
