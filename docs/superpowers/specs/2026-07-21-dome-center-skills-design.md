# DomeGallery — Skills at Center — Design

## Context

`src/components/ui/domegallery.tsx` renders a draggable 3D dome of tech-icon
tiles. `buildItems(pool, seg)` lays out `seg × 5` tiles column-by-column and
fills every tile by cycling the image pool (`images[i % len]`). Nothing controls
which icon lands at the dome's front-facing center.

The front-facing tile at rest is the one whose base rotation is ~0. Per
`computeItemBaseRotation` (`rotateY = unit*(x+0.5)`, `rotateX = unit*(y-0.5)`)
and the initial rotation `{x:0, y:0}`, that is the tile at **`x ≈ -0.5, y ≈ 0.5`**.

The user wants their 16 skill icons clustered at the dome's front-center, with
the other tech icons filling the rest of the sphere; skills appear only at the
center (no repeats).

## Goal

Change tile placement so the 16 skill logos occupy the tiles nearest the dome's
front-center, and all remaining tiles are filled by the other tech icons.
Position only — no size, styling, grayscale, or animation changes.

## The 16 skill icons

Same set as the About floating icons: JavaScript, TypeScript, React Native
(React logo), Tailwind CSS, Laravel, PHP, Python, MySQL, Java, C#, Bootstrap,
Git, GitHub, Supabase, SQLite, Power BI. All are present in `techStackIcons`.

## Changes (all in `domegallery.tsx`)

### 1. Destructure the 8 newer icons

The top-of-file destructure of `techStackIcons` predates the added logos. Add
`Git, Laravel, MySQL, PHP, PowerBI, Python, SQLite, Supabase` to it so they can
be referenced.

### 2. `SKILL_IMAGES` constant

Add a module-level `SKILL_IMAGES: ImageItem[]` with the 16 skills (each
`{ src, alt }`), ordered so index 0 sits dead-center and the rest spiral
outward. Order is cosmetic and adjustable.

### 3. `centerImages` prop

Add `centerImages?: ImageItem[]` to `DomeGalleryProps`, defaulting to
`SKILL_IMAGES`. `Skills.tsx` continues to use the default (no change there).

### 4. Rewrite `buildItems(pool, centerPool, seg)`

- Keep coord generation unchanged.
- Normalize `centerPool` → `centerImages` (drop empty `src`); build
  `centerSrcSet` of their `src`s.
- `fillerImages` = `pool` normalized, **minus any src in `centerSrcSet`** so
  skills never repeat in the filler. (This automatically strips the 8 skills
  that `DEFAULT_IMAGES` already contains, leaving ~26 other-tech fillers.)
- Compute `dist2` of each tile from the front-center `(x=-0.5, y=0.5)`; sort
  tile indices ascending by distance → `orderByCenter`.
- Assign `centerImages[rank]` to `orderByCenter[rank]` for
  `rank < min(centerImages.length, totalSlots)` (record these in a
  `centerSlot` map). Nearest tile → first skill.
- Fill every non-center tile by cycling `fillerImages` (a cursor that only
  advances on filler tiles).
- Keep the adjacent-duplicate guard, but **skip any comparison or swap that
  involves a center tile** (`centerSlot.has(i)`, `has(i-1)`, `has(j)`), so the
  skill cluster is never disturbed.
- Return `coords` with the assigned `src`/`alt`.

### 5. Call site

`items` useMemo: `buildItems(images, centerImages, segments)`; add
`centerImages` to the dependency array.

## Edge cases

- Empty pools: if both `pool` and `centerPool` are empty, return blank tiles
  (as today). If filler ends up empty (pool was all skills), fall back to
  cycling the center images so no tile is blank.
- `centerImages.length` > tiles: only the first `totalSlots` skills are placed
  (won't happen — 16 ≪ 130+ tiles).

## Non-goals

- No change to `Skills.tsx`, tile size, styling, grayscale, drag, or the
  click-to-enlarge behavior.
- No change to `DEFAULT_IMAGES` contents (the filter handles overlap).

## Testing / verification

Manual, via the dev server:
1. `npx tsc -b` and `npm run lint` clean.
2. Load the Skills section; confirm the icons facing front at the dome's center
   are the 16 skills (clustered), not random tech.
3. Drag the dome; confirm the rest of the sphere is populated with the other
   tech icons, nothing blank/broken, and no skill icon repeats out in the
   filler region.
4. Check desktop (`segments 35`) and mobile (`segments 26`) both center the
   skills. If the visual front-center is offset from `(x=-0.5, y=0.5)`, tune the
   `CENTER_X/CENTER_Y` constants and re-verify.
