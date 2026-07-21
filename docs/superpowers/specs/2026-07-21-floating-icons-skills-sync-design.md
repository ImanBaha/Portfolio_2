# Sync About `floatingIcons` to Skills — Design

## Context

`src/components/section/About.tsx` renders a decorative set of `floatingIcons`
— tech logos that float around the "About Me" journal illustration and fan out
on scroll (desktop) / gather into bands above & below the journal (mobile).
They are purely decorative (`alt=""`).

Today the set is 16 icons, several of which are NOT skills the user actually
lists (Node.js, Docker, AWS, MongoDB, Vite, Express, GraphQL, Redis). The user
wants the floating icons to reflect the real skills in `skillGroups` in
`src/components/section/Skills.tsx`.

All available tech-stack SVGs live in `src/assets/techstack/` and are exported
as `techStackIcons` from `src/assets/techstack/index.ts`. `About.tsx` imports
`techStackIcons` and references specific members in `floatingIcons`.

## Goal

Replace the `floatingIcons` set with **17 icons drawn from the user's actual
skills**, downloading the logos that aren't already in the project, and
generalizing the mobile layout math so 17 icons lay out cleanly.

## Final icon set (17)

Decision record: curated set; abstract concepts excluded; C++/HTML/CSS dropped
from the float (still shown in the Skills terminal).

| # | Skill | Icon source |
|---|-------|-------------|
| 1 | JavaScript | existing `JavaScript` |
| 2 | TypeScript | existing `TypeScript` |
| 3 | Python | download |
| 4 | PHP | download |
| 5 | Java | existing `JavaLight` |
| 6 | C# | existing `CS` |
| 7 | React Native (Expo) | existing `ReactLight` |
| 8 | Tailwind CSS | existing `TailwindCSSLight` |
| 9 | Bootstrap | existing `Bootstrap` |
| 10 | Laravel (Livewire) | download |
| 11 | MySQL | download |
| 12 | Git | download |
| 13 | SQLite | download |
| 14 | Supabase | download |
| 15 | Antigravity | download (see risk below) |
| 16 | GitHub | existing `GithubLight` |
| 17 | Power BI | download (see risk below) |

Existing/reused (8): JavaScript, TypeScript, JavaLight, CS, ReactLight,
TailwindCSSLight, Bootstrap, GithubLight.
Downloads (9): Python, PHP, Laravel, MySQL, Git, SQLite, Supabase, Antigravity,
Power BI.

## Icon downloads

Primary source: **devicon** colored "original" SVGs via jsDelivr
(`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/<name>/<name>-original.svg`),
MIT-licensed, visually consistent with the existing colored logos. Confirmed
present in devicon: Python, PHP, Laravel, MySQL, Git, SQLite, Supabase.

**Risk — not in devicon:** Antigravity (Google's IDE, very new) and Power BI.
Fallback source order: svgl (`svgl.app`), then the vendor's official brand SVG.
Acceptance bar: a clean vector SVG that renders crisply at ~64px. If a clean
vector for Antigravity or Power BI genuinely cannot be found, that single icon
is dropped from the set (report it; do not ship a blurry raster). The set then
has 16; the mobile math (generalized below) handles any count.

Each downloaded file:
- Saved to `src/assets/techstack/<Name>.svg` (PascalCase filename matching the
  existing convention, e.g. `Python.svg`, `PowerBI.svg`, `Antigravity.svg`).
- Validated: file begins with `<svg` or `<?xml`, non-trivial size (> ~200 bytes),
  and spot-checked rendering in the browser.
- Imported in `src/assets/techstack/index.ts` and added to the `techStackIcons`
  object (keeping the file's existing alphabetical-ish grouping).

Downloading is explicitly authorized by the user for this task.

## `floatingIcons` rewrite (`About.tsx`)

Rewrite the `floatingIcons` array to the 17 entries above. Each entry keeps the
existing shape:
```
{ id, image, initialX, initialY, finalX, finalY,
  mobileInitialX, mobileInitialY, mobileFinalX, mobileFinalY }
```
- Reuse the 16 existing coordinate sets for entries 1–16 (they are already tuned
  for desktop fan-out and mobile bands).
- Author one additional coordinate set for the 17th entry: desktop
  `initial/final` values that fan out to an unused region (no heavy overlap with
  neighbors), and mobile values consistent with the others (the mobile values
  are overridden by the generalized math below, so they only need to be sane
  defaults).
- `id`s remain unique sequential numbers 1–17.

## Mobile layout generalization (`About.tsx`)

Today `computeMobileTransform` hardcodes 8 icons per band (`index < 8`,
`index % 8`), assuming exactly 16 icons in 2 bands. With 17 this makes the 17th
icon collide with the 9th.

Change `computeMobileTransform` (and the `applyIconTransforms` caller that maps
over `floatingIcons`) to derive the band split from the **actual icon count**:
- `total = floatingIcons.length`
- `half = Math.ceil(total / 2)` → first `half` icons go in the band **above** the
  journal, the rest **below**.
- Within a band of `count` icons: lay out in **2 rows**, `perRow = Math.ceil(count / 2)`.
  - `row = local < perRow ? 0 : 1`
  - `col = local < perRow ? local : local - perRow`
- Column x-positions computed symmetrically around center from `perRow` and a
  fixed spacing (replacing the fixed 4-entry `MOBILE_COLS`), so a row of 5 (from
  the 9-icon band) is centered just like a row of 4. Row y-positions keep the
  existing `MOBILE_ROW_BASE` / `MOBILE_ROW_GAP` band distances and the existing
  `band` sign (−1 above, +1 below).
- The hidden/gather target, easing, scale, opacity, and rotation logic are
  unchanged — only the grid slotting (which index goes where) is generalized.

Desktop (`computeIconTransform` non-mobile branch) is unchanged — it reads each
icon's own `initialX/finalX/...`, which now includes the 17th's authored values.

No change to the scroll/rAF machinery, the `iconRefs` handling, or the JSX
`.map` over `floatingIcons` beyond it naturally iterating 17 entries.

## Non-goals

- No change to the Skills terminal, the DomeGallery, or `skillGroups` content.
- No change to the journal illustration, the photo stack, or the modal.
- No visual redesign of the fan-out animation itself — same motion, new logos
  and a count-agnostic mobile grid.

## Testing / verification

Manual, via the dev server (no test framework in this repo):
1. `npx tsc -b` and `npm run lint` clean.
2. Desktop: load About, scroll through the section, confirm all 17 icons render
   real logos, fan out without severe overlap, and gather back on scroll.
3. Mobile (≤768px, verified via a narrow iframe as in prior work since the
   window can't shrink below ~500px): confirm the icons form tidy bands above &
   below the journal with no two icons stacked on the same spot, and no icon is
   clipped off the sides.
4. Spot-check each downloaded SVG renders crisply (not blurry/broken), in both
   light and dark themes.
5. Confirm Antigravity and Power BI resolved to clean vectors; if either did
   not, confirm it was dropped and the set/report reflects that.
