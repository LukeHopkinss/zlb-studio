import { useEffect } from "react";
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from "../siteConfig";

const upsertMeta = (selector, attr, value, content) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/**
 * Sets per-route title/description/canonical and keeps the og:/twitter: tags
 * in sync.
 *
 * Worth knowing: this runs client-side, so Google (which executes JS) picks
 * it up, but social scrapers — Facebook, LinkedIn, iMessage, Slack — do NOT
 * run JS and will only ever see the static tags in index.html. Per-route link
 * previews need prerendering or SSR; the static tags are the site-wide
 * fallback until then.
 */
export default function useDocumentMeta({ title, description, path, image } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const desc = description || DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${path || window.location.pathname}`;
    // Must be a raster format — most social scrapers reject SVG for og:image.
    const img = image ? `${SITE_URL}${image}` : `${SITE_URL}/og-default.jpg`;

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', "name", "description", desc);
    upsertCanonical(url);

    upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", desc);
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta('meta[property="og:image"]', "property", "og:image", img);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);

    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", desc);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", img);
  }, [title, description, path, image]);
}
