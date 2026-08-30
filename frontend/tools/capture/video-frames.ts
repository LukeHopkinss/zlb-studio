import { chromium } from "playwright";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { sites, type SiteConfig } from "./sites.config.ts";
import { PUBLIC_WORK_ROOT, ARCHIVE_ROOT, TODAY, LAUNCH_ARGS } from "./paths.ts";
import { runFfmpeg, checkBudget, makePoster, mergeHeroIntoMeta, BUDGETS } from "./video-common.ts";

// Sites whose hero loop is a scroll journey rather than a self-animating
// hero — this method can't capture CSS keyframe/canvas/video motion in
// step with the frames, so it's wrong for anything like peeyew.
const FRAME_SEQUENCE_SLUGS = ["nyulara", "vistakidsdental"];

const FPS = 30;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

async function captureFrames(site: SiteConfig) {
  const frameDir = path.join(ARCHIVE_ROOT, site.slug, TODAY, "hero-frames");
  await mkdir(frameDir, { recursive: true });

  const browser = await chromium.launch({ args: LAUNCH_ARGS });
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    const url = new URL(site.heroRoute ?? site.routes[0] ?? "/", site.url).toString();
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    } catch {
      await page.goto(url, { waitUntil: "load", timeout: 30000 });
    }

    await page.addStyleTag({
      content: `
        ${site.hideSelectors.join(",") || ".__none__"} { display: none !important; }
        *::-webkit-scrollbar { display: none !important; }
        html { scroll-behavior: auto !important; }
      `,
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(site.extraWaitMs ?? 1500);

    const { fromY, toY, durationMs } = site.heroScroll;
    const frames = Math.round((durationMs / 1000) * FPS);

    for (let i = 0; i < frames; i++) {
      const t = easeInOut(i / (frames - 1));
      const y = fromY + (toY - fromY) * t;
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(60);
      await page.screenshot({ path: path.join(frameDir, `${String(i).padStart(4, "0")}.png`) });
    }

    await context.close();
  } finally {
    await browser.close();
  }

  return frameDir;
}

async function assembleAndFinalize(site: SiteConfig, frameDir: string) {
  const outDir = path.join(PUBLIC_WORK_ROOT, site.slug);
  await mkdir(outDir, { recursive: true });

  const finalMp4 = path.join(outDir, "hero.mp4");
  await runFfmpeg([
    "-y",
    "-framerate", String(FPS),
    "-i", path.join(frameDir, "%04d.png"),
    "-vf", "scale=1440:-2:flags=lanczos,format=yuv420p",
    "-c:v", "libx264",
    "-crf", "20",
    "-preset", "slow",
    "-movflags", "+faststart",
    "-an", finalMp4,
  ]);

  const webm = path.join(outDir, "hero.webm");
  await runFfmpeg([
    "-y",
    "-i", finalMp4,
    "-vf", "scale=1440:-2:flags=lanczos,fps=30",
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
    durationMs: site.heroScroll.durationMs,
  });
}

async function main() {
  const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const targets = slugArg
    ? sites.filter((s) => s.slug === slugArg)
    : sites.filter((s) => FRAME_SEQUENCE_SLUGS.includes(s.slug));

  if (slugArg && !FRAME_SEQUENCE_SLUGS.includes(slugArg)) {
    console.error(`"${slugArg}" isn't a frame-sequence site (use video-realtime.ts instead)`);
    process.exit(1);
  }

  const keepFrames = process.argv.includes("--keep-frames");

  for (const site of targets) {
    console.log(`\n=== ${site.slug} (frame sequence) ===`);
    try {
      const frameDir = await captureFrames(site);
      await assembleAndFinalize(site, frameDir);
      // The PNG frame sequence exists only to feed ffmpeg — it's ~150-200MB
      // per site and is fully regenerable by re-running this script. Once the
      // mp4/webm are written and budget-checked, drop it. Pass --keep-frames
      // to inspect individual frames when debugging a bad loop.
      if (!keepFrames) {
        await rm(frameDir, { recursive: true, force: true });
        console.log(`    cleaned up frame sequence: ${frameDir}`);
      }
    } catch (err) {
      console.error(`Failed to build hero video for ${site.slug}:`, err);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
