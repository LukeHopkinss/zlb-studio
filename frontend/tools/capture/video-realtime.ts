import { chromium } from "playwright";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { sites, type SiteConfig } from "./sites.config.ts";
import { PUBLIC_WORK_ROOT, ARCHIVE_ROOT, TODAY, LAUNCH_ARGS } from "./paths.ts";
import { runFfmpeg, checkBudget, makePoster, mergeHeroIntoMeta, BUDGETS } from "./video-common.ts";

// Sites with self-animating heroes (CSS/canvas/video) that a frame-sequence
// scroll capture can't render in step with — record real time instead.
const REALTIME_SLUGS = ["peeyew", "2econd2kin"];

async function recordSite(site: SiteConfig) {
  const rawDir = path.join(ARCHIVE_ROOT, site.slug, TODAY, "hero-raw");
  await mkdir(rawDir, { recursive: true });

  const browser = await chromium.launch({ args: LAUNCH_ARGS });
  let rawWebm: string;
  let trimSeconds: number;

  try {
    // recordVideo starts capturing from context/page creation, so goto()'s
    // own navigation+load time (which can run well past 1s) gets baked into
    // the front of the raw recording as blank frames. Track real elapsed
    // time so the transcode trims exactly that much, instead of a guessed
    // fixed offset that under-trims on slower-loading sites.
    const t0 = Date.now();
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1, // recorder ignores 2x
      recordVideo: { dir: rawDir, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();

    const url = new URL(site.heroRoute ?? site.routes[0] ?? "/", site.url).toString();
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    } catch {
      await page.goto(url, { waitUntil: "load", timeout: 30000 });
    }

    if (site.dismissIntro) {
      const skip = page.getByRole("button", { name: /skip/i });
      if (await skip.isVisible()) await skip.click();
      await page.waitForTimeout(700);
    }
    await page.addStyleTag({
      content: `${site.hideSelectors.join(",") || ".__none__"} { display: none !important; }
        *::-webkit-scrollbar { display: none !important; }
        /* The rAF loop below sets scroll position every frame; if the site
           declares scroll-behavior:smooth each of those becomes its own
           animation and they fight each other into a stutter. */
        html { scroll-behavior: auto !important; }`,
    });
    await page.evaluate(() => document.fonts.ready);

    // Deliberately no long settle wait here (unlike stills) — the point of
    // this method is to capture the live entrance animation, not skip past it.
    await page.waitForTimeout(300);
    trimSeconds = (Date.now() - t0) / 1000;

    const { fromY, toY, durationMs } = site.heroScroll;
    if (toY !== fromY) {
      // Drive the scroll from a requestAnimationFrame loop *inside* the page
      // rather than stepping page.mouse.wheel from Node. Wheel-stepping moves
      // in a handful of discrete jumps and each step pays a CDP round trip, so
      // the recording comes out stuttery and unevenly timed. A rAF loop updates
      // once per rendered frame, which is exactly what the recorder captures.
      // Passed as a source string on purpose: tsx/esbuild run with
      // --keep-names, which rewrites named inner functions to call a `__name`
      // helper that doesn't exist inside the page, so a normal function
      // argument here dies with "__name is not defined". A string is opaque
      // to the bundler and reaches the browser untransformed.
      await page.evaluate(`new Promise((resolve) => {
        var fromY = ${fromY}, toY = ${toY}, durationMs = ${durationMs};
        var start = performance.now();
        var tick = function (now) {
          var t = Math.min((now - start) / durationMs, 1);
          var eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          window.scrollTo(0, fromY + (toY - fromY) * eased);
          if (t < 1) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      })`);
    } else {
      await page.waitForTimeout(durationMs);
    }

    const video = page.video();
    await context.close();
    rawWebm = (await video?.path()) ?? "";
  } finally {
    await browser.close();
  }

  if (!rawWebm) {
    const files = await readdir(rawDir);
    const webm = files.find((f) => f.endsWith(".webm"));
    if (!webm) throw new Error(`No recorded video found in ${rawDir}`);
    rawWebm = path.join(rawDir, webm);
  }

  return { rawWebm, durationMs: site.heroScroll.durationMs, trimSeconds };
}

async function transcode(site: SiteConfig, rawWebm: string, durationMs: number, trimSeconds: number) {
  const outDir = path.join(PUBLIC_WORK_ROOT, site.slug);
  await mkdir(outDir, { recursive: true });

  const ss = trimSeconds.toFixed(2);
  const seconds = (durationMs / 1000).toFixed(2);
  const finalMp4 = path.join(outDir, "hero.mp4");
  await runFfmpeg([
    "-y",
    "-i", rawWebm,
    "-ss", ss,
    "-t", seconds,
    // No fps filter here, unlike the frame-sequence path. Playwright's
    // recorder writes 25fps; forcing 30 duplicates every 5th frame, which
    // reads as judder (same mechanism as 3:2 pulldown). Keep the native rate.
    "-vf", "scale=1440:-2:flags=lanczos,format=yuv420p",
    "-c:v", "libx264",
    "-crf", "21",
    "-preset", "slow",
    "-movflags", "+faststart",
    "-an", finalMp4,
  ]);

  const webm = path.join(outDir, "hero.webm");
  await runFfmpeg([
    "-y",
    "-i", rawWebm,
    "-ss", ss,
    "-t", seconds,
    "-vf", "scale=1440:-2:flags=lanczos",
    "-c:v", "libvpx-vp9",
    "-crf", "33",
    "-b:v", "0",
    "-row-mt", "1",
    "-an", webm,
  ]);

  const posterJpg = path.join(outDir, "hero-poster.jpg");
  const posterAvif = path.join(outDir, "hero-poster.avif");
  await makePoster(finalMp4, posterJpg, posterAvif);

  console.log("  budgets:");
  await checkBudget(finalMp4, BUDGETS.mp4, "hero.mp4");
  await checkBudget(webm, BUDGETS.webm, "hero.webm");
  await checkBudget(posterAvif, BUDGETS.poster, "hero-poster.avif");

  await mergeHeroIntoMeta(site.slug, {
    mp4: "hero.mp4",
    webm: "hero.webm",
    poster: "hero-poster.avif",
    durationMs: Math.round(parseFloat(seconds) * 1000),
  });
}

async function main() {
  const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const targets = slugArg
    ? sites.filter((s) => s.slug === slugArg)
    : sites.filter((s) => REALTIME_SLUGS.includes(s.slug));

  if (slugArg && !REALTIME_SLUGS.includes(slugArg)) {
    console.error(`"${slugArg}" isn't configured as a real-time site (use video-frames.ts instead)`);
    process.exit(1);
  }

  for (const site of targets) {
    console.log(`\n=== ${site.slug} (real time) ===`);
    try {
      const { rawWebm, durationMs, trimSeconds } = await recordSite(site);
      await transcode(site, rawWebm, durationMs, trimSeconds);
    } catch (err) {
      console.error(`Failed to build hero video for ${site.slug}:`, err);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
