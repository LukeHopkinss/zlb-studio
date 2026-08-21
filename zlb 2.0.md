# zlb 2.0 — audit notes

Full pass through the repo (frontend + backend). Organized by severity/category. Items you already know about (not responsive, dropping the roadmap, changing the contact email, showcasing real work) are noted where they intersect with something else, but not re-explained.

---

## 1. Broken right now (not stylistic — actually non-functional)

- **The contact form backend cannot start.** `backend/routes/contactRoutes.js` imports `{ handleContact }` from `contactController.js`, but the controller only exports `submitContactForm`. `handleContact` is `undefined`, so `router.post('/', undefined)` throws as soon as the route file loads.
- **Even past that, the controller's requires are wrong paths.** `contactController.js` does `require('../supabaseClient')` and `require('../mailer')`, but those files live in `backend/utils/`, not one level up from `controllers/`. Node throws `MODULE_NOT_FOUND` immediately (verified by running it directly — it crashes on `require`).
- **Env var name mismatch.** `backend/.env` defines `EMAIL_PASSWORD`, but `backend/utils/mailer.js` reads `process.env.EMAIL_PASS`. Even with the two bugs above fixed, nodemailer auth would get `undefined` as the password.
- **No deployment wiring between frontend and backend at all.** There's no `netlify.toml`, `vercel.json`, proxy config in `vite.config.js`, or any rewrite rule — just `frontend/public/_redirects` doing a plain SPA catch-all (`/* /index.html 200`). `ContactForm.jsx` does `fetch('/api/contact')` as a relative path, which only works if something proxies `/api/*` to the Express server. As it stands, that request has nowhere to go in either dev (`vite dev` doesn't proxy it) or prod (Netlify would just 200 it back to `index.html`).
- **The form reports success even when it fails.** `ContactForm.jsx`'s `handleSubmit` never checks `response.ok` or catches errors — it calls `setSubmitted(true)` unconditionally after `await fetch(...)`. Combined with the point above, right now the form always tells the user "your message has been sent" even though nothing is being received. Worth fixing at the same time you rewire the contact destination.
- **`backend/models/contactModel.js` is dead code.** The `Contact` class is never imported or used anywhere — the controller inserts a plain object into Supabase directly.

Given you're already changing where Contact routes to, this is probably the moment to either fix this pipeline for real or replace it outright (e.g. a form service, or a plain `mailto:`/Formspree-style handoff) rather than patch the existing wiring.

---

## 2. Known issue — root cause notes

**Not responsive:** confirmed structurally, not just "needs polish." Tailwind responsive prefixes (`sm:` / `md:` / `lg:` / `xl:`) appear in exactly two files (`MainPage.jsx`, `Roadmap.jsx`) in the entire frontend — every other screen is built at one fixed size:
- Huge fixed type scales with no mobile step-down: `text-7xl`, `text-6xl`, `text-8xl` (the "z" logo header), `text-5xl` used directly with no smaller-breakpoint variant.
- `MainPage.jsx` stacks large hard-coded negative margins tuned for one viewport height (`-mt-[10rem]`, `-mt-[20rem]`, `-translate-y-[20rem]`) — on shorter or narrower screens these will visibly overlap sections instead of just reflowing.
- `Header.jsx` and `Navbar.jsx` are both `fixed` (top-left "z" logo, bottom nav pill) with fixed padding (`top-15 left-15`, `py-15`) — no mobile-specific repositioning, so on small screens they eat a large % of vertical space and can crowd page content.
- `Roadmap.jsx` sizes its circular hover targets in `vw` (`10vw` → `30vw` on hover), which scales with width but not with aspect ratio — on a narrow/tall phone screen the "hover" circle math (tuned for landscape-ish ratios) will behave very differently, and hover-to-expand doesn't have a touch equivalent at all (see below).
- The 3D splash screen (`SplashScene.jsx`/`Logo.jsx`) drives its color/rotation-freeze state off `onPointerOver`/`onPointerOut`, which don't fire the same way (if at all) on touch devices — mobile users get the spinning logo but never the "settled" hover state, and there's no fallback affordance telling them to tap.

**The nav "mag hover" getting stuck / links only working when you click the text:** root cause found. In `Navbar.jsx`, each nav item is a `motion.div` (padded box, has the `onClick` that moves the highlight pill) wrapping a `Link` with `className="block w-full h-full"`. The parent `motion.div` has no explicit height — its height is just whatever the padding + text produce. A child at `height: 100%` inside a parent with auto/content-based height doesn't actually fill it (that's standard CSS behavior, not a React bug), so the `Link` only fully covers the text itself, not the full padded click area. Result: clicking anywhere in the padded box always fires the local `onClick` (which moves the highlight pill — the "mag" effect), but only a click that lands on the actual text hits the `Link` and navigates. That's exactly the split behavior you described. Fix is either give the wrapping `motion.div` an explicit height (e.g. `h-full` up the chain or a fixed height) or move the pill-update logic onto the `Link` itself instead of its parent.

**Roadmap removal:** `Roadmap.jsx` is only referenced from `MainPage.jsx` — once removed, `MainPage.jsx`'s services heading (`"our services"`, absolutely positioned at `left-[60%]`) and the large negative margins around it will need re-tuning, since they were laid out assuming the roadmap's height/position.

**Showcasing real work:** right now there isn't a "work" page wired into the app at all, and the existing nav is actively mislabeled for this — see below.

---

## 3. Content / IA inconsistencies

- **Nav says "Work," but it routes to `/`** (`Navbar.jsx`), which renders `MainPage.jsx` — the studio intro/services/roadmap page, not any kind of work showcase.
- **There's a separate, unrouted `Work.jsx` scene** (`frontend/src/scenes/Work.jsx`) that renders a "Our Work" heading + the client-logo marquee, but it's never imported into `App.jsx` and has no route. It's effectively dead/orphaned — looks like an earlier attempt at the work page you're now planning to build out.
- **Team bios are copy-pasted incorrectly.** In `About.jsx`'s draggable profile cards, `Topacio.jsx` and `Villarreal.jsx` both use the bio text "**Hopkins** leads creative strategy with a deep background..." — same paragraph, wrong name, copied from `Hopkins.jsx`. `Reyzin.jsx` correctly says "Nick leads...", so it looks like only two of the four were updated.
- All four team members are also listed with the identical title "Creative Director" — worth double-checking that's actually accurate for everyone and not a copy-paste artifact too.
- `Contact.jsx` wraps the `<ContactForm />` component in an `<h1>` tag (`<h1 className="relative mt-[10rem]"><ContactForm key={key} /></h1>`) — invalid/meaningless HTML semantics (a form nested in a heading), likely leftover from swapping in the form where a heading used to be.

---

## 4. Code quality / repo hygiene

- **Two Windows shortcut files are committed to git**: `frontend/src - Shortcut.lnk` and `frontend/src - Shortcut (2).lnk`. These are almost certainly accidental (created by drag-and-drop on Windows) and should be deleted and added to `.gitignore`.
- **ESLint is misconfigured and currently fails.** `eslint.config.js` only wires up `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` — it's missing `eslint-plugin-react` (or `react/jsx-uses-vars`), so ESLint doesn't know JSX usage like `<motion.div>` counts as using the `motion` import. Running `npx eslint .` currently reports 9 false-positive "defined but never used" errors across `App.jsx`, `ContactForm.jsx`, `DraggableWindow.jsx`, `Navbar.jsx`, `NavbarHighlight.jsx`, `Roadmap.jsx`, `About.jsx`, `MainPage.jsx` — every file that uses `framer-motion`. Lint is effectively non-functional until this is fixed, which means real unused-import problems (see next point) aren't getting caught.
- **`Navbar.jsx` imports `act` from `react`** (`import { useRef, useState, useEffect, act} from 'react'`) — `act` is a testing utility, unused here, and an odd/accidental import.
- **~650KB of unused font files.** `frontend/public/creato_display/` ships 14 weight/style variants of Creato Display (Thin through Black, plus italics), but `index.css` only declares `@font-face` for two of them (Medium as `creato`, Bold as `creatoBold`). The other 12 files are dead weight being served/bundled for nothing.
- **Favicon is the black-on-transparent logo variant** (`z-logo-black.svg`) on a site that's black-background/white-text throughout, and a white variant (`z-logo.svg`) already exists in the same folder but isn't used anywhere. Worth swapping if the black one isn't rendering visibly in tabs.
- **No SEO/meta content.** `index.html` has a title and favicon but no `<meta name="description">`, no Open Graph/Twitter card tags — worth adding for a studio site whose whole purpose is to be shared/linked.
- **Generic/non-descriptive alt text** on the client logo marquee: `alt={\`Client logo ${i}\`}` (`ClienteleMarquee.jsx`) — doesn't name the actual client, so it's not useful for accessibility or SEO. Consider deriving alt text from the client name instead of the array index.
- Minor: `package.json` `version` is still `0.0.0` and `frontend/README.md` is the untouched default Vite template README — neither blocks anything, just stale scaffolding.

---

## 5. Smaller/cosmetic

- `Logo.jsx` initializes `useState()` with no default (`hovered` starts `undefined` instead of `false`) — harmless since it's falsy, but inconsistent with every other boolean state in the codebase which defaults explicitly.
- `DraggableWindow.jsx` renders at `top-[65vh] left-[10vw] w-[80vw]`, which on short viewports can end up partially under the fixed bottom navbar (`Navbar.jsx`, `py-15`, `z-50` vs the window's own `z-50`) — likely to become more visible once responsive work starts, since the two `z-50`s will contest on small screens.
- `About.jsx` closes all open profile windows on scroll but not on route change — not currently reachable as a bug since scroll-to-top already fires on route change (`ScrollToTop.jsx`), but worth knowing they're two separate listeners doing related things.

---

## Suggested order of attack

Given what you've said you're already planning:
1. Fix or replace the contact pipeline entirely (routes/paths/env var are all broken today; easiest to just decide the new destination and rebuild the submit path rather than patch three separate bugs), and fix the form's false "success" state at the same time.
2. Pull `Roadmap.jsx` out of `MainPage.jsx` and re-tune the negative-margin layout around the services section that's left behind.
3. Wire up a real `/work` route (there's already an unused `Work.jsx` skeleton to start from) and fix the "Work" nav item to actually point at it instead of `/`.
4. Responsive pass — this will also incidentally fix/simplify the `DraggableWindow`/navbar overlap and the roadmap's hover-circle math.
5. Fix the nav pill/link hit-area bug in `Navbar.jsx` (`h-full` on a content-sized parent).
6. Cleanup pass: delete the `.lnk` files, fix the ESLint config, remove the unused font files and `act` import, fix the two copy-pasted bios.
