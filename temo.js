const browser = await puppeteer.launch();
const [page] = await browser.pages();

await page.goto('https://example.org/', { waitUntil: 'networkidle0' });
const data = await page.evaluate(() => document.querySelector('*').outerHTML);

console.log(data);

await browser.close();