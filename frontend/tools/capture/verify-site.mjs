import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const [width, height] of [[320,568],[375,667],[390,844],[667,375],[768,1024],[1024,768],[1440,900],[1920,1080]]) {
    await page.setViewportSize({ width, height });
    await page.goto('http://127.0.0.1:5173/contact');
    await page.getByRole('button', { name: 'Send', exact: true }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(900);
    const heading = await page.getByRole('heading', { name: 'Contact Us' }).boundingBox();
    const field = await page.getByLabel('Your name', { exact: true }).boundingBox();
    assert(heading.y + heading.height < field.y, `${width}: heading overlaps form`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}: horizontal overflow`);
    const send = page.getByRole('button', { name: 'Send', exact: true });
    await send.evaluate(el => el.scrollIntoView({ block: 'center' }));
    const box = await send.boundingBox();
    assert(await page.evaluate(({ x,y }) => document.elementFromPoint(x,y)?.closest('button')?.type === 'submit', { x: box.x + box.width/2, y: box.y + box.height/2 }), `${width}: send obscured`);
    await page.getByRole('link', { name: 'Privacy Policy', exact: true }).last().scrollIntoViewIfNeeded();
    await page.screenshot({ path: `/tmp/zlb-contact-${width}.png`, fullPage: true });
    console.log(`Contact layout passed ${width}x${height}`);
  }
  await page.route('**/api/contact', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }));
  await page.goto('http://127.0.0.1:5173/contact');
  await page.getByLabel('Your name', { exact: true }).fill('Browser Test');
  await page.getByLabel('Your email', { exact: true }).fill('test@example.com');
  await page.getByLabel('Your message', { exact: true }).fill('Test message');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.getByRole('status').waitFor();
  await page.unroute('**/api/contact');
  await page.route('**/api/contact', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<html>SPA fallback</html>' }));
  await page.goto('http://127.0.0.1:5173/contact');
  await page.getByLabel('Your name', { exact: true }).fill('Browser Test');
  await page.getByLabel('Your email', { exact: true }).fill('test@example.com');
  await page.getByLabel('Your message', { exact: true }).fill('Test message');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.getByRole('alert').waitFor();
  assert.equal(await page.getByRole('status').count(), 0, 'HTML response must not confirm delivery');
  await page.unroute('**/api/contact');

  for (const route of ['/privacy','/terms','/work/2econd2kin']) {
    await page.goto(`http://127.0.0.1:5173${route}`);
    await page.locator('h1').waitFor();
    assert(await page.locator('footer').count(), `${route}: no footer`);
    assert(!(await page.locator('body').innerText()).includes('TODO'), `${route}: placeholder`);
  }
  await page.goto('http://127.0.0.1:5173/work/2econd2kin');
  await page.waitForTimeout(1000);
  for (const img of await page.locator('img').all()) assert(await img.evaluate(el => el.complete && el.naturalWidth > 0), 'Broken project image');
  assert.deepEqual(errors, []);
  console.log('Form confirmation, legal routes, project assets, and runtime checks passed');
} finally { await browser.close(); }
