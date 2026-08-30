// Emits public/sitemap.xml and public/robots.txt.
//
// Case-study routes are derived from the work asset directories rather than
// hardcoded, so adding a project stays a capture-script + meta.json job with
// no separate SEO edit to forget. Runs from `npm run build` via prebuild.
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(HERE, "../public");
const WORK = path.join(PUBLIC, "work");

// Kept in sync with src/siteConfig.js by hand — this script can't import JSX
// app code, and duplicating one constant is cheaper than a build indirection.
const SITE_URL = "https://zlbstudio.com";

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "yearly" },
  { path: "/contact", priority: "0.7", changefreq: "yearly" },
];

async function workRoutes() {
  let slugs = [];
  try {
    const entries = await readdir(WORK, { withFileTypes: true });
    slugs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }

  const routes = [];
  for (const slug of slugs) {
    const metaPath = path.join(WORK, slug, "meta.json");
    try {
      const meta = JSON.parse(await readFile(metaPath, "utf-8"));
      const { mtime } = await stat(metaPath);
      routes.push({
        path: `/work/${slug}`,
        priority: "0.8",
        changefreq: "yearly",
        lastmod: (meta.capturedAt || mtime.toISOString().slice(0, 10)).slice(0, 10),
      });
    } catch {
      console.warn(`  skipping /work/${slug} — no readable meta.json`);
    }
  }
  return routes;
}

const urlEntry = ({ path: p, priority, changefreq, lastmod }) =>
  [
    "  <url>",
    `    <loc>${SITE_URL}${p}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");

const routes = [...STATIC_ROUTES, ...(await workRoutes())];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(urlEntry).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

await writeFile(path.join(PUBLIC, "sitemap.xml"), sitemap);
await writeFile(path.join(PUBLIC, "robots.txt"), robots);

console.log(`generate-seo: wrote sitemap.xml (${routes.length} urls) + robots.txt`);
for (const r of routes) console.log(`  ${SITE_URL}${r.path}`);
