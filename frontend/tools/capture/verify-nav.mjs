import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.addInitScript(() => sessionStorage.setItem('zlb:splash-seen', '1'));
  const nav = page.getByRole('navigation', { name: 'Primary', exact: true });
  const pill = nav.locator('.rounded-full');
  const verifySelection = async (label, current) => {
    await page.waitForTimeout(600);
    const selected = nav.getByRole('link', { name: label, exact: true });
    assert.equal(await selected.evaluate(el => getComputedStyle(el).color), 'rgb(0, 0, 0)');
    assert.equal(await nav.locator('[aria-current="page"]').count(), current ? 1 : 0);
    const textBounds = await selected.boundingBox();
    const pillBounds = await pill.boundingBox();
    assert(pillBounds, 'Missing highlight');
    assert(Math.abs(textBounds.x - pillBounds.x) < 2, 'Highlight and label are misaligned');
    assert(Math.abs(textBounds.width - pillBounds.width) < 2, 'Highlight width is incorrect');
    for (const other of ['Work', 'About', 'Contact'].filter(item => item !== label)) {
      assert.equal(await nav.getByRole('link', { name: other, exact: true }).evaluate(el => getComputedStyle(el).color), 'rgb(255, 255, 255)');
    }
  };
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [label, route] of [['Work', '/work/peeyew'], ['About', '/about'], ['Contact', '/contact']]) {
      await page.goto(`http://127.0.0.1:5173${route}`);
      await page.locator('h1').waitFor();
      await verifySelection(label, true);
      await page.getByRole('navigation', { name: 'Legal', exact: true }).getByRole('link', { name: 'Privacy Policy', exact: true }).click();
      await page.waitForURL('**/privacy');
      await verifySelection(label, false);
      await page.getByRole('navigation', { name: 'Legal', exact: true }).getByRole('link', { name: 'Terms of Service', exact: true }).click();
      await page.waitForURL('**/terms');
      await verifySelection(label, false);
      await page.goBack();
      await verifySelection(label, false);
      await page.goBack();
      await verifySelection(label, true);
    }
    await page.goto('http://127.0.0.1:5173/privacy');
    await nav.waitFor();
    assert.equal(await pill.count(), 0, 'Direct legal entry should not show a stale pill');
    for (const link of await nav.getByRole('link').all()) assert.equal(await link.evaluate(el => getComputedStyle(el).color), 'rgb(255, 255, 255)');
    await nav.getByRole('link', { name: 'Contact', exact: true }).click();
    await verifySelection('Contact', true);
    console.log(`Footer navigation, browser history, and direct entry passed at ${width}px`);
  }
} finally { await browser.close(); }
