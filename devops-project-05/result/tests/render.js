// Renderiza una página con Chromium headless e imprime el HTML resultante.
// Reemplaza a PhantomJS, sin mantenimiento desde 2018.
const { chromium } = require('playwright');

const url = process.argv[2];

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    console.log(await page.content());
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
