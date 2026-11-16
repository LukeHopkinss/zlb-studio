# zlb studio

React/Vite portfolio frontend and Express contact API. Requires Node.js 22 or later.

## Local development

1. Run `npm ci` in `frontend` and `backend`.
2. Copy `backend/.env.example` to `backend/.env` and configure Resend.
3. Run `npm run dev` in `backend` (port 5000).
4. Run `npm run dev` in `frontend` (port 5173). Vite proxies `/api` to Express.

## Contact delivery with Resend

Set server-only `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in your backend hosting environment. The sender must belong to a domain verified in Resend; `hello@zlbstudio.com` in the example is a proposed sender, not a verified account. All inquiries go to **luke.hopkins@outlook.com**, with the visitor’s email as Reply-To. No automatic email is sent to visitor-supplied addresses.

For a single Node deployment, run `npm ci --prefix frontend`, `npm run build --prefix frontend`, and `npm ci --prefix backend`, then start with `npm start --prefix backend`. Express serves `frontend/dist` and the contact API from the same origin, including SPA deep links. Unknown API URLs return JSON errors rather than the SPA.

If hosting the frontend and API separately, route `/api/*` on the frontend origin to Express before the SPA fallback. Vite’s development proxy is not included in the production bundle. Serve the frontend’s `dist` directory and route other application URLs to `index.html` (`public/_redirects` supports hosts that implement Netlify-style redirects).

Set `ALLOWED_ORIGINS` to the actual frontend origins. If Express is behind a reverse proxy, configure `TRUST_PROXY_HOPS` to the known number of trusted proxy hops so rate limits identify clients correctly. The default in-memory rate limiter is appropriate for one API process; use a shared store before scaling to multiple instances.

Verify the sender domain at https://resend.com/domains, deploy the server secrets, and submit an actual inquiry to confirm Outlook delivery. Automated tests mock Resend; they do not verify a real inbox. Never put the API key in `VITE_*` variables or commit `.env` files.

## Validation

- `frontend`: `npm run lint` and `npm run build`.
- `backend`: `npm test` covers validation, the delivery payload, provider failure, origin restrictions, honeypot, and rate limits without sending email.
- `frontend/tools/capture`: run `node verify-site.mjs` with the frontend dev server running for responsive layout, form response, legal route, and image checks. Run `npx tsc --noEmit` for capture type checking. Use `npm ci` and `npx playwright install chromium` for screenshot capture; `npm run stills -- --slug=2econd2kin` refreshes the magazine screenshots. Capture assets are committed under `frontend/public/work`.

## Content and indexing

Published project copy lives in `frontend/public/work/<slug>/meta.json`. The work grid and sitemap share `frontend/src/data/workSlugs.js`. The capture tool reads published copy instead of restoring placeholders. Case studies use verifiable scope counts; conversion, revenue, and traffic improvements are not claimed without client analytics.

`npm run build` regenerates `sitemap.xml` and `robots.txt`. The canonical domain is `frontend/src/siteConfig.js`. The sitemap includes home, about, contact, four case studies, privacy, and terms. Submit `https://zlbstudio.com/sitemap.xml` in your verified Google Search Console property after deployment. Sitemap discovery does not guarantee indexing. This remains a client-rendered app; SSR or prerendering would improve non-JavaScript crawlers and route-specific social previews.

## Repository review

Issues found and addressed in this change:

- Absolute contact heading positioning, invalid heading/form nesting, and forced scroll containers caused overlap and inconsistent page scrolling.
- A fixed full-width header could extend beyond the viewport and intercept page interactions.
- Contact inputs lacked visible labels and a pending state; repeat submissions were possible.
- The mail endpoint accepted unvalidated bodies, allowed every origin, exposed provider errors, and lacked abuse limits.
- Zoho mail settings had no documented production setup; production startup depended on nodemon.
- Project copy contained placeholders; capture defaults could reintroduce them. Sitemap origin and project lists had separate sources of truth.
- Legal pages and a shared footer were missing. Generated frontend output and nested environment secrets needed broader ignore rules.
- Dependency audits reported known vulnerabilities. Compatible updates were applied; the capture image processor was upgraded to resolve its native-library advisories.

Remaining structural considerations: the intro/About experience has a large optional Three.js bundle; this is already lazy-loaded. Capture tooling is a separate package and needs its own dependency installation. The app is still client-rendered. These are documented tradeoffs, not blockers for the requested changes.
