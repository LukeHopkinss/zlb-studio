import { chromium } from "playwright";
import { sites, type SiteConfig } from "./sites.config.ts";

const WIDGET_SELECTOR =
  '[class*="cookie"], [id*="cookie"], [class*="consent"], [class*="chat"], [class*="widget"]';

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

async function discoverSite(site: SiteConfig) {
  console.log(`\n=== ${site.slug} (${site.url}) ===`);

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(site.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(site.extraWaitMs ?? 1500);

    // Use the post-redirect origin (e.g. peeyew.net -> www.peeyew.net) so the
    // same-origin filter below doesn't silently drop every link.
    const origin = new URL(page.url()).origin;
    if (origin !== new URL(site.url).origin) {
      console.log(`Note: redirected to ${origin}`);
    }

    const paths = await page.evaluate((origin) => {
      const anchors = Array.from(document.querySelectorAll("a[href]"));
      const same = anchors
        .map((a) => (a as HTMLAnchorElement).href)
        .filter((href) => href.startsWith(origin))
        .map((href) => href.slice(origin.length) || "/");
      return Array.from(new Set(same));
    }, origin);

    console.log("Same-origin paths:");
    for (const p of paths) console.log(`  ${p}`);

    const widgets = await page.evaluate((selector) => {
      const els = Array.from(document.querySelectorAll(selector));
      return els.map((el) => {
        const id = el.id ? `#${el.id}` : "";
        const cls = el.className && typeof el.className === "string"
          ? `.${el.className.trim().split(/\s+/).join(".")}`
          : "";
        return `${el.tagName.toLowerCase()}${id}${cls}`;
      });
    }, WIDGET_SELECTOR);

    console.log("Candidate cookie/chat/widget selectors:");
    for (const w of widgets) console.log(`  ${w}`);

    for (const viewport of VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(300);
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      console.log(`Document height at ${viewport.name} (${viewport.width}px): ${height}px`);
    }

    await context.close();
  } finally {
    await browser.close();
  }
}

async function main() {
  const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const targets = slugArg ? sites.filter((s) => s.slug === slugArg) : sites;

  if (slugArg && targets.length === 0) {
    console.error(`No site configured with slug "${slugArg}"`);
    process.exit(1);
  }

  for (const site of targets) {
    await discoverSite(site);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
