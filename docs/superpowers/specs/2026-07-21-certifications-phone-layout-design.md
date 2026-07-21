# Certifications — Phone-Only Layout Polish — Design

## Context

`src/components/section/Certifications.tsx` renders two groups of items:
- **Awards** (`badges`): 3 items, images `w-40 h-40 md:w-56 md:h-56`.
- **Credentials** (`credentials`): 3 items, images `w-32 h-32 md:w-40 md:h-40`.

Each group's wrapper is `flex flex-wrap justify-center gap-8`. On a phone this
produces a poor layout: the large 160px award images end up one-per-row (a tall
column with excessive scrolling), and the 128px credential images wrap as
"2 + 1 orphan" — the third item sits centered on its own row, reading as
unbalanced.

The desktop (`md` and up) layout is considered good and **must not change**.

## Goal

Improve ONLY the phone (below `md`) presentation of the Certifications section:
arrange each group of 3 as a clean 2-column grid with the lone third item
centered, at image sizes that fit two-across without overflow. Desktop layout
stays pixel-for-pixel identical.

## Non-goals

- No changes to content, titles, subtitles, links, colors, or theming.
- No changes to the desktop (`md`+) layout, sizing, or spacing.
- No new headings/separators between the two groups (that would alter desktop).
- No structural refactor of the component (the two near-duplicate
  `BadgeComponent` render blocks stay as they are — out of scope).

## Approach

All changes are Tailwind class-string edits scoped to mobile, each paired with a
`md:` override that restores today's exact desktop behavior. Because the desktop
layout is a flex container at `md+`, grid-only utilities (`grid-cols-2`,
`col-span-2`, `justify-items-center`) are inert there and cannot affect desktop.

### 1. Container: flex-wrap → 2-column grid on mobile

Both group wrappers change from:
```
flex flex-wrap justify-center gap-8            (+ mb-12 on the awards group)
```
to:
```
grid grid-cols-2 justify-items-center gap-x-4 gap-y-8 [&>*:last-child:nth-child(odd)]:col-span-2 md:flex md:flex-wrap md:justify-center md:gap-8            (+ mb-12 on the awards group)
```

- `grid grid-cols-2` — 2 columns on mobile.
- `justify-items-center` — center each item within its cell (inert in flex/desktop).
- `gap-x-4 gap-y-8` — tighter horizontal gap (16px) than the old 32px, comfortable
  row gap (32px); `md:gap-8` restores the desktop 32px both-axis gap.
- `[&>*:last-child:nth-child(odd)]:col-span-2` — when the last child is in an odd
  position (i.e., alone on its row, as the 3rd of 3 is), it spans both columns;
  combined with `justify-items-center` this centers the orphan. Inert at `md+`.

### 2. Shrink mobile image sizes so two fit per row

Change only the mobile size classes; keep the `md:` sizes exactly as-is:
- Awards image: `w-40 h-40` → `w-28 h-28` (mobile 112px); `md:w-56 md:h-56` unchanged.
- Credentials image: `w-32 h-32` → `w-24 h-24` (mobile 96px); `md:w-40 md:h-40` unchanged.

Width budget check (worst case 320px viewport, `px-6` = 48px total padding →
272px usable; `gap-x-4` = 16px → each column = 128px):
- Award image 112px fits inside a 128px column with margin. ✓
- Credential image 96px fits comfortably. ✓
The award-larger-than-credential size hierarchy is preserved on mobile, mirroring
desktop.

The images have no `srcset`, so the `sizes` attribute has no functional effect;
update the mobile value (`160px`/`128px` → `112px`/`96px`) for cleanliness only.

### 3. Subtitle text on mobile (the approved polish)

The subtitle `<p>` changes from `text-sm` to `text-xs md:text-sm` so it stays
compact in the narrower mobile column while remaining `text-sm` on desktop. The
title `<h3>` keeps `text-sm` (it must stay readable; it wraps gracefully in the
2-column width).

## Files touched

- `src/components/section/Certifications.tsx` — class-string edits on: the two
  group wrapper `<div>`s (lines ~88 and ~134), the two `<img>` tags (lines ~96
  and ~142), and the two subtitle `<p>` tags (lines ~106 and ~152).

## Testing / verification

Manual, via the dev server (no test framework in this repo):
- View the Certifications section at 320px, 375px, and 414px widths.
  - Confirm each group shows 2 items per row with no horizontal overflow.
  - Confirm the 3rd item is centered beneath the pair.
- Resize to `md`+ (≥768px) and confirm the layout is identical to before:
  3 items in a centered flex row, original image sizes, original 32px gaps.
- Verify both light and dark themes still render correctly (no color changes,
  but confirm nothing regressed).
