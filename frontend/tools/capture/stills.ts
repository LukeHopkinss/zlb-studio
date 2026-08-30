import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { sites, type SiteConfig } from "./sites.config.ts";
import { content } from "./content.ts";
import { PUBLIC_WORK_ROOT, ARCHIVE_ROOT, TODAY, LAUNCH_ARGS } from "./paths.ts";

type Viewport = {
  tag: "desktop" | "mobile";
  width: number;
  height: number;
  deviceScaleFactor: number;
};

const VIEWPORTS: Viewport[] = [
  { tag: "desktop", width: 1440, height: 900, deviceScaleFactor: 2 },
  { tag: "mobile", width: 390, height: 844, deviceScaleFactor: 3 },
];

async function prepPage(page: import("playwright").Page, site: SiteConfig) {
  await page.addStyleTag({
    content: `
      ${site.hideSelectors.join(",") || ".__none__"} { display: none !important; }
      *::-webkit-scrollbar { display: none !important; }
    `,
  });
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation-play-state: paused !important;
      transition: none !important;
    }`,
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(site.extraWaitMs ?? 1500);
}

async function toAvifAndJpg(pngPath: string, outBase: string) {
  await sharp(pngPath).avif({ quality: 62, effort: 6 }).toFile(`${outBase}.avif`);
  await sharp(pngPath).jpeg({ quality: 82 }).toFile(`${outBase}.jpg`);
}

async function captureSite(site: SiteConfig) {
  console.log(`\n=== ${site.slug} ===`);

  const outDir = path.join(PUBLIC_WORK_ROOT, site.slug);
  const archiveDir = path.join(ARCHIVE_ROOT, site.slug, TODAY);
  await mkdir(outDir, { recursive: true });
  await mkdir(archiveDir, { recursive: true });

  const browser = await chromium.launch({ args: LAUNCH_ARGS });
  const stillNames: string[] = [];

  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.deviceScaleFactor,
      });
      const page = await context.newPage();

      for (let i = 0; i < site.routes.length; i++) {
        const route = site.routes[i];
        const name = `${viewport.tag}-${String(i + 1).padStart(2, "0")}`;
        const url = new URL(route, site.url).toString();

        console.log(`  ${name}: ${url}`);
        try {
          try {
            await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
          } catch (err) {
            console.warn(`    networkidle timed out, falling back to load: ${(err as Error).message}`);
            await page.goto(url, { waitUntil: "load", timeout: 30000 });
          }
          await prepPage(page, site);

          const section = site.sections[0];
          const scrollTo = site.routeScrollOverrides?.[route] ?? section?.scrollTo;
          if (scrollTo !== undefined) {
            await page.evaluate((y) => window.scrollTo(0, y), scrollTo);
            await page.waitForTimeout(400);
          }

          const pngPath = path.join(archiveDir, `${name}.png`);
          if (section?.selector) {
            await page.locator(section.selector).first().screenshot({ path: pngPath });
          } else {
            await page.screenshot({ path: pngPath });
          }

          await toAvifAndJpg(pngPath, path.join(outDir, name));
          stillNames.push(`${name}.avif`);
        } catch (err) {
          console.error(`    skipped ${name}: ${(err as Error).message}`);
        }
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  return stillNames;
}

async function writeMeta(site: SiteConfig, stillNames: string[]) {
  const metaPath = path.join(PUBLIC_WORK_ROOT, site.slug, "meta.json");
  const existing = await readFile(metaPath, "utf-8")
    .then((raw) => JSON.parse(raw))
    .catch(() => null);

  const defaults = content[site.slug] ?? {
    name: site.slug,
    outcome: "TODO",
    caseStudy: { problem: "TODO", whatWeBuilt: "TODO", results: "TODO" },
  };

  const meta = {
    slug: site.slug,
    name: existing?.name ?? defaults.name,
    url: site.url,
    outcome: existing?.outcome ?? defaults.outcome,
    capturedAt: TODAY,
    caseStudy: existing?.caseStudy ?? defaults.caseStudy,
    assets: {
      ...(existing?.assets ?? {}),
      stills: stillNames,
    },
  };

  await writeFile(metaPath, JSON.stringify(meta, null, 2) + "\n");
  console.log(`  wrote ${metaPath}`);
}

async function main() {
  const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const targets = slugArg ? sites.filter((s) => s.slug === slugArg) : sites;

  if (slugArg && targets.length === 0) {
    console.error(`No site configured with slug "${slugArg}"`);
    process.exit(1);
  }

  for (const site of targets) {
    try {
      const stillNames = await captureSite(site);
      await writeMeta(site, stillNames);
    } catch (err) {
      console.error(`Failed to capture ${site.slug}:`, err);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
