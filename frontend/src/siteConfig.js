// Single source of truth for the canonical origin. Used by the document-meta
// hook (canonical + og:url) and by tools/generate-seo.mjs when it writes
// sitemap.xml / robots.txt at build time. Change it here only.
export const SITE_URL = "https://zlbstudio.com";

export const SITE_NAME = "zlb studio";

export const DEFAULT_DESCRIPTION =
  "zlb studio designs and builds websites for startups and brands, combining clean design with solid engineering — from first concept to launch.";
