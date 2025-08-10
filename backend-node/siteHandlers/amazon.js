const puppeteer = require('puppeteer');

const credentials = {
  email: process.env.AMAZON_EMAIL,
  password: process.env.AMAZON_PASSWORD
};

exports.handle = async ({ task, item }) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Login flow
  await page.goto('https://www.amazon.com/ap/signin');
  await page.type('#ap_email', credentials.email);
  await page.click('#continue');
  await page.waitForSelector('#ap_password');
  await page.type('#ap_password', credentials.password);
  await page.click('#signInSubmit');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // Search for item
  await page.goto('https://www.amazon.com/');
  await page.type('#twotabsearchtextbox', item);
  await page.keyboard.press('Enter');
  await page.waitForSelector('div[data-component-type="s-search-result"]', { timeout: 10000 });

  // Open first product and add to cart
  const firstProduct = await page.$('div[data-component-type="s-search-result"]');
  if (firstProduct) {
    await firstProduct.click();
    await page.waitForNavigation();
    await page.waitForSelector('#add-to-cart-button', { timeout: 10000 });
    await page.click('#add-to-cart-button');
  }

  await browser.close();
  return { status: 'success', message: `Authenticated and added ${item} to Amazon cart.` };
};
