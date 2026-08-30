export type Section = { name: string; selector?: string; scrollTo?: number };

export type SiteConfig = {
  slug: string;
  url: string;
  routes: string[]; // paths to capture stills from
  heroRoute?: string; // page the hero video is captured from; defaults to routes[0]
  routeScrollOverrides?: Record<string, number>; // per-route scrollTo, overrides sections[0].scrollTo
  sections: Section[]; // named still targets
  heroScroll: {
    // scripted scroll journey for the loop
    fromY: number;
    toY: number;
    durationMs: number;
  };
  hideSelectors: string[]; // cookie banners, chat widgets, sticky CTAs
  waitForSelector?: string; // element that signals the page is really ready
  extraWaitMs?: number; // let hero animations settle
};

// Filled in from `npm run discover` output (2026-08-26). No cookie/chat/widget
// selectors were detected on any of the three sites via the generic
// [class*="cookie"|"consent"|"chat"|"widget"] probe, so hideSelectors are
// empty for now — re-check by eye during stills/video capture in case a
// banner is markup that probe doesn't catch (e.g. shadow DOM).
export const sites: SiteConfig[] = [
  {
    // Redirects peeyew.net -> www.peeyew.net; use the canonical host directly.
    slug: "peeyew",
    url: "https://www.peeyew.net",
    // Stills come from shop/mag/landing per Luke's direction (2026-08-27);
    // the hero video stays on the home page ("/") since that's where the
    // animated chrome-logo intro lives — kept explicit via heroRoute since
    // home is no longer in routes.
    routes: ["/shop", "/peeyewmag", "/landing"],
    heroRoute: "/",
    sections: [{ name: "hero", scrollTo: 0 }],
    // /peeyewmag's top viewport is pixel-identical to home's shared hero —
    // the actual PYM Mag content (description + issue teaser + photo grid)
    // only appears once you scroll past it, confirmed by eye at y=900.
    routeScrollOverrides: { "/peeyewmag": 900 },
    // Desktop scrollHeight measured at 2143px (viewport 900px) -> ~1243px of
    // scroll range on the home page. Mobile scrollHeight measured at exactly
    // 844px (equal to the viewport) — confirmed by eye this is real, compact
    // content, not a gated splash.
    heroScroll: { fromY: 0, toY: 1243, durationMs: 7000 },
    hideSelectors: [],
    extraWaitMs: 2500,
  },
  {
    // Redirects nyulara.org -> www.nyulara.org.
    slug: "nyulara",
    url: "https://www.nyulara.org",
    // Home + Programming per Luke's direction (2026-08-27). The "Programming"
    // nav link's actual href is /aboutshowcase, confirmed by reading the
    // live nav markup — it doesn't literally say "programming" in the URL.
    routes: ["/", "/aboutshowcase"],
    sections: [{ name: "hero", scrollTo: 0 }],
    // Desktop scrollHeight measured at 6037px (viewport 900px) -> 5137px of
    // full-page scroll range, far more than the spec's original 2000px
    // guess. Capping the hero loop's scroll distance well short of the
    // bottom (footer isn't part of the "story") — treat this toY as a
    // first-pass estimate to tune visually once frames are captured.
    heroScroll: { fromY: 0, toY: 2600, durationMs: 7000 },
    hideSelectors: [],
    extraWaitMs: 1500,
  },
  {
    // Redirects vistakidsdental.com -> www.vistakidsdental.com.
    slug: "vistakidsdental",
    url: "https://www.vistakidsdental.com",
    // Home + Post-Op + Request Appointment per Luke's direction (2026-08-27).
    routes: ["/", "/post-op", "/appointments"],
    sections: [{ name: "hero", scrollTo: 0 }],
    // Desktop scrollHeight measured at 2282px (viewport 900px) -> ~1382px.
    heroScroll: { fromY: 0, toY: 1382, durationMs: 7000 },
    hideSelectors: [],
    extraWaitMs: 1500,
  },
];
