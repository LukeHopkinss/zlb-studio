# Work Section Plan

Current state: `src/scenes/Work.jsx` is just a title + `ClienteleMarquee`. Nothing to click, nothing to read. This plan turns it into the actual portfolio.

## Concept: "Desktop" index

zlb studio already speaks a desktop/OS dialect — `DraggableWindow` (draggable, closable, bordered windows) and the halftone-dot 3D bust on the home page both read as "playful tactile computer," not "generic agency template." The Work page should lean into that instead of introducing a new visual language (no card grids, no generic carousel).

**Structure, two layers:**

1. **Index list** — the whole page is a big typographic list of project names, magazine-TOC style. One row per project: name, one-line tag, year/status. No thumbnails cluttering the base view — it stays scannable, which is what "easy to navigate" actually means here.
2. **Case window** — clicking a row opens that project in a `DraggableWindow` (reuse the existing component as-is). Inside: a screenshot/mockup, a 2-3 sentence blurb, tech tags, and a "visit site" link. Closing it returns to the list. This reuses a component that already exists instead of inventing a new modal system.

**The hover detail (desktop only):** hovering a row shows a small preview thumbnail that follows the cursor, rendered in black-and-white/duotone to match the site's monochrome palette, then snapping to full color right as you click into the window. That color-snap is the "interesting" moment — restraint everywhere else, one payoff on interaction. Skip the cursor-follow on touch devices; tapping just opens the window directly.

**Why this over a grid:** a grid needs 4+ good screenshots to not look empty, and Luke has 3 finished sites + 1 in progress. A list of 4 looks intentional; a grid of 4 looks like a placeholder waiting to be filled.

## Content — flagship projects

Reverse-chronological, in-progress work pinned to the top with a status badge:

| Project | Status | One-liner | Tags |
|---|---|---|---|
| 2econd2kin | Building now | *(needs Luke's blurb — nothing public yet, repo is private/empty of description)* | TBD |
| peeyew.net | Live | PYM Magazine — a triannual NYC culture/lifestyle publication (PYMMAG), debut issue "PILOT," plus PYM Radio and a shop | Editorial, Next.js/TS |
| vistakidsdental.com | Live | Pediatric dental practice in Vista, CA — friendly, minimally-invasive care, booking + service info for parents | Local business, TS |
| nyulara.org | Live | NYU Stern's Luxury & Retail Association — events, the HELIOS zine, mentorship, for a student org | Org site, editorial |

Confirm from GitHub (`gh api users/LukeHopkinss/repos`): `peeyew-net` and `vista-kids-dental` are public repos matching these two sites and both list a `homepage`. `2econd2kin` exists (pushed 2026-08-16) but has no description/homepage set yet — worth filling in once the site is further along. No public repo exists for nyulara.org (private, or the code lives elsewhere) — that's fine, the case window just needs the live link and a screenshot, not a repo link.

## Content — a small "Lab" strip below the index

Below the four case studies, a short row of chip/text links (not full windows — just name → GitHub link) for the personal/technical projects that show range beyond client sites:

- **multi-object-tracker** — OpenCV multi-object tracking with an accessible UI (Python)
- **squat-tracker** — OpenCV form-tracking tool built for a Raspberry Pi (Python)
- **apod-app** — NASA Astronomy Picture of the Day viewer
- Optionally **Museum-of-Luke** (old portfolio) if he wants a "previously" nod

This keeps the case-window treatment reserved for real client work, while still surfacing that he ships things beyond web studio jobs — without diluting the main list.

## Data shape

One array, one row/window component, so adding a fifth project later is a data edit, not new UI:

```js
const projects = [
  {
    slug: "2econd2kin",
    name: "2econd2kin",
    status: "in progress", // "live" | "in progress"
    year: 2026,
    blurb: "",
    tags: [],
    href: null,        // live link, null while unlaunched
    repo: null,
    image: "/work/2econd2kin.png",
  },
  // ...peeyew, vistakidsdental, nyulara
];
```

## Interaction spec

- **List row** (`ProjectRow`): large type (Creato, similar scale to the nav links), hover = slight indent + underline, status badge for "in progress" (small dot + label, not a full tag pill — keep it quiet).
- **Hover preview**: absolutely-positioned thumbnail div tracking `mousemove`, `grayscale(1)` filter that lifts to `grayscale(0)` on the active row via a framer-motion transition. Desktop (`sm:` and up) only.
- **Case window**: `<DraggableWindow onClose={...}>` wrapping a case-study body — screenshot, blurb, tags, live-site link (and GitHub link where public). Reuses the drag/close behavior already built for the contact flow, so it's zero new interaction code, just a new child.
- **Mobile**: rows stack full-width, no cursor-follow preview; tapping a row opens the same `DraggableWindow` (drag can be left enabled or disabled below `sm` — disabling avoids fighting with scroll on touch).
- **Routing**: keep it in-page state (`activeProject` in `Work.jsx`), not new routes — matches how DraggableWindow already gets used elsewhere, and keeps deep-linking out of scope unless it's wanted later.

## Build order

1. Collect one real screenshot/mockup per finished site (peeyew, vistakidsdental, nyulara) — this is the actual blocker, not code.
2. Build `projects` data array + `ProjectRow` + case-window content component.
3. Wire `Work.jsx`: index list + `activeProject` state + `DraggableWindow`.
4. Add the cursor-follow hover preview (desktop-only enhancement, do last since it's pure polish).
5. Add the Lab strip.
6. Fill in 2econd2kin once there's something to show — placeholder row with "in progress" badge and no click-through until then.
