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

Replace the `floatingIcons` set with **16 icons drawn from the user's actual
skills**, downloading the logos that aren't already in the project. The count
stays at 16, so the existing floating positions and the mobile layout math are
kept exactly as they are (no generalization needed).

> Revision: an earlier draft of this spec proposed 17 icons including
> Antigravity, which would have required generalizing the mobile math. The user
> revised the request to 16 icons with Antigravity removed, so the positions and
> mobile math remain unchanged.

## Final icon set (16)

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
| 15 | GitHub | existing `GithubLight` |
| 16 | Power BI | download (see risk below) |

Existing/reused (8): JavaScript, TypeScript, JavaLight, CS, ReactLight,
TailwindCSSLight, Bootstrap, GithubLight.
Downloads (8): Python, PHP, Laravel, MySQL, Git, SQLite, Supabase, Power BI.

## Icon downloads

Primary source: **devicon** colored "original" SVGs via jsDelivr
(`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/<name>/<name>-original.svg`),
MIT-licensed, visually consistent with the existing colored logos. Confirmed
present in devicon: Python, PHP, Laravel, MySQL, Git, SQLite, Supabase.

**Risk — not in devicon:** Power BI. Sourced from gilbarbara/logos
(`microsoft-power-bi.svg`) via jsDelivr — a clean colored vector. Acceptance
bar: renders crisply at ~64px. (Antigravity, also absent from devicon, was
removed from the set per the user's revision, so it is no longer downloaded.)

Each downloaded file:
- Saved to `src/assets/techstack/<Name>.svg` (PascalCase filename matching the
  existing convention, e.g. `Python.svg`, `PowerBI.svg`).
- Validated: file begins with `<svg` or `<?xml`, non-trivial size (> ~200 bytes),
  and spot-checked rendering in the browser.
- Imported in `src/assets/techstack/index.ts` and added to the `techStackIcons`
  object (keeping the file's existing alphabetical-ish grouping).

Downloading is explicitly authorized by the user for this task.

## `floatingIcons` rewrite (`About.tsx`)

Rewrite the `floatingIcons` array to the 16 entries above, keeping the existing
object shape:
```
{ id, image, initialX, initialY, finalX, finalY,
  mobileInitialX, mobileInitialY, mobileFinalX, mobileFinalY }
```
- Reuse the 16 existing coordinate sets 1:1 — only the `image` on each entry
  changes (and `id`s stay 1–16). This keeps every icon's on-screen position
  identical to before; only the logo shown differs.
- Note: the `mobile*` fields are inert in the current code
  (`computeMobileTransform` derives mobile positions from `index`, not these
  fields). They are preserved unchanged to keep the object shape stable, not
  because they are read.

## Mobile layout (`About.tsx`) — unchanged

Because the count stays at 16, `computeMobileTransform` and its 8-per-band
math are left exactly as-is. No generalization, no `MOBILE_COLS` change. The
16 icons occupy the same two bands (8 above, 8 below) they always did.

## `<img>` aspect-ratio fix (`About.tsx`)

The existing floating icons are all square (128×128); one new logo (Power BI) is
portrait (256×342). Add `object-contain` to the floating `<img>` so any
non-square logo preserves its aspect ratio inside the fixed square box instead
of stretching. Harmless to the square icons.

## Non-goals

- No change to the Skills terminal, the DomeGallery, or `skillGroups` content.
- No change to the journal illustration, the photo stack, or the modal.
- No change to the fan-out animation, positions, or the mobile band math — same
  motion and layout, only the logos differ.

## Testing / verification

Manual, via the dev server (no test framework in this repo):
1. `npx tsc -b` and `npm run lint` clean.
2. Desktop: load About, scroll through the section, confirm all 16 icons render
   real logos, fan out without severe overlap, and gather back on scroll.
3. Mobile (≤768px, verified via a narrow iframe as in prior work since the
   window can't shrink below ~500px): confirm the icons form the same two tidy
   bands above & below the journal as before.
4. Spot-check each downloaded SVG renders crisply (not blurry/broken), in both
   light and dark themes — especially Power BI (portrait aspect) with
   `object-contain`.
