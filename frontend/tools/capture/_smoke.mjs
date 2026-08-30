import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:4173";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const failed = [];
page.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
page.on("pageerror", (e) => console.log(`  [pageerror] ${String(e).slice(0, 200)}`));

for (const slug of ["nyulara", "peeyew", "vistakidsdental"]) {
  await page.goto(`${BASE}/work/${slug}`, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
  await page.waitForTimeout(1500);
  const r = await page.evaluate(`(() => {
    const imgs = [...document.querySelectorAll("img")];
    return {
      imgs: imgs.length,
      broken: imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute("src")),
      og: document.querySelector('meta[property="og:image"]')?.content,
      h1: document.querySelector("h1")?.textContent
    };
  })()`);
  const ogRes = await page.request.get(r.og);
  console.log(`${slug}: h1=${JSON.stringify(r.h1)} imgs=${r.imgs} broken=${JSON.stringify(r.broken)} og=${r.og.split("/").slice(-2).join("/")} -> ${ogRes.status()}`);
}

console.log("4xx/5xx responses:", failed.length ? failed.join(" | ") : "none");
await browser.close();
