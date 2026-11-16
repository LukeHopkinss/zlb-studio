// Published metadata is the source of truth; recapturing must not restore placeholders.
import { readFileSync } from "node:fs";
import { workSlugs } from "../../src/data/workSlugs.js";
export const content = Object.fromEntries(workSlugs.map((slug: string) => [slug,
  JSON.parse(readFileSync(new URL(`../../public/work/${slug}/meta.json`, import.meta.url), "utf8"))
]));
