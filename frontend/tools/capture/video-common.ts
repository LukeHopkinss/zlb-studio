import { spawn } from "node:child_process";
import { stat, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { PUBLIC_WORK_ROOT } from "./paths.ts";

export const BUDGETS = {
  mp4: 2 * 1024 * 1024,
  webm: 1.5 * 1024 * 1024,
  poster: 60 * 1024,
};

export function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}\n${stderr.slice(-2000)}`));
    });
  });
}

export async function checkBudget(filePath: string, maxBytes: number, label: string) {
  const { size } = await stat(filePath);
  const kb = (n: number) => `${(n / 1024).toFixed(0)}KB`;
  if (size > maxBytes) {
    throw new Error(
      `${label} is ${kb(size)}, over budget of ${kb(maxBytes)} (${filePath}). Shorten the clip before raising CRF.`
    );
  }
  console.log(`    ${label}: ${kb(size)} (budget ${kb(maxBytes)})`);
}

export async function makePoster(mp4Path: string, outJpg: string, outAvif: string) {
  await runFfmpeg(["-y", "-i", mp4Path, "-vframes", "1", "-q:v", "2", outJpg]);
  await sharp(outJpg).avif({ quality: 62, effort: 6 }).toFile(outAvif);
}

export async function mergeHeroIntoMeta(
  slug: string,
  hero: { mp4: string; webm: string; poster: string; durationMs: number }
) {
  const metaPath = path.join(PUBLIC_WORK_ROOT, slug, "meta.json");
  const existing = JSON.parse(await readFile(metaPath, "utf-8"));
  existing.assets = { ...existing.assets, hero };
  await writeFile(metaPath, JSON.stringify(existing, null, 2) + "\n");
  console.log(`    updated ${metaPath}`);
}
