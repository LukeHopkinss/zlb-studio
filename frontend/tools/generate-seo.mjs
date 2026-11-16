// Emits public/sitemap.xml and public/robots.txt.
//
// Case-study routes share the work grid’s project registry. Adding a
// project to that registry includes it here without a separate SEO list. Runs from `npm run build` via prebuild.
import { readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(HERE, "../public");
const WORK = path.join(PUBLIC, "work");

// Shared with browser metadata and the work grid.
const { SITE_URL } = await import("../src/siteConfig.js");
const { workSlugs } = await import("../src/data/workSlugs.js");

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "yearly" },
  { path: "/contact", priority: "0.7", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
];

async function workRoutes() {
  const slugs = workSlugs;

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
        lastmod: (meta.updatedAt || meta.capturedAt || mtime.toISOString().slice(0, 10)).slice(0, 10),
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
