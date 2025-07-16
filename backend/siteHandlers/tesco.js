const puppeteer = require('puppeteer');

exports.handle = async ({ task, item }) => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const page = await browser.newPage();

  await page.goto('https://www.tesco.ie/groceries/en-IE', { waitUntil: 'networkidle2' });

  try {
    await page.waitForSelector('button#onetrust-accept-btn-handler', { timeout: 5000 });
    await page.click('button#onetrust-accept-btn-handler');
  } catch (err) {
    console.log('No cookie banner found');
  }

  await page.type('input[name="searchTerm"]', item);
  await page.keyboard.press('Enter');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  await page.waitForSelector('button[data-auto="add-to-basket"]', { timeout: 10000 });
  const buttons = await page.$$('button[data-auto="add-to-basket"]');
  if (buttons.length > 0) {
    await buttons[0].click();
    await page.waitForTimeout(2000);
  }

  return {
    status: 'success',
    message: `Used real Chrome session to add "${item}" to Tesco cart`
  };
};
