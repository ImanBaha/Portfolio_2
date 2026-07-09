# Dark Tech Retheme + Feature Upgrade — Design

**Date:** 2026-07-09
**Status:** Approved by user

## Goal

Retheme the portfolio template from its soft dusty-pink aesthetic to a masculine
"dark tech / developer" look with an electric blue/cyan accent, remove the cutesy
decorative elements, and add two new features: a command palette and animated
skill proficiency bars.

## Decisions (from brainstorming)

- **Direction:** Dark tech / developer.
- **Accent:** Electric blue / cyan.
- **Light mode:** Kept, re-themed (clean white/slate with blue accents).
- **Decorations:** Draggable stars, scroll stickers, and handwriting fonts
  (Punk Babe, DK Crayonista) removed entirely; replaced with subtle tech-style
  accents only.
- **New features:** Command palette (Cmd/Ctrl+K) and animated skill proficiency
  bars.
- **Skills layout:** Proficiency bars added below the existing 3D dome gallery.

## 1. Color system

- Rename the `pink` scale in `src/styles/colors.ts` to `accent` and replace the
  hex values with a cyan/electric-blue scale (roughly `#ECFEFF` light end →
  `#67E8F9` → `#0EA5E9` → `#0369A1` dark end, WCAG AA at the text steps).
- Keep the `dark` slate scale, shifting the darkest backgrounds toward deep
  navy (`#0B1120`-range) for the dark theme.
- Light theme: white/slate backgrounds with blue accents instead of blush pink.
  Section gradients re-derived from the new accent's lightest steps.
- Aurora WebGL color stops become blue/cyan/violet.
- Update every consumer of `colors.pink[...]` (~20 files), all `--color-pink-*`
  CSS variables in `App.css` (renamed to `--color-accent-*`, legacy pink-named
  aliases deleted), and all hardcoded pink hex / `rgba(234,190,195,…)` values.
- No `pink` key remains anywhere; the palette is honest about what it holds.

## 2. Decoration removal + tech accents

- Delete the draggable star field from `Projects.tsx` and the `assets/stars`
  usage; delete scroll-triggered stickers from `About.tsx` and `assets/stickers`
  usage; remove both `@font-face` declarations and the font asset folders'
  usages (`Punk Babe` nav logo, `DK Crayonista` in Projects).
- Nav signature name: clean monospace treatment with a terminal-cursor/bracket
  accent instead of handwritten gradient text.
- Extend the existing blinking-cursor motif; optionally add a faint grid/dot
  background texture. Keep it minimal.
- The About journal image, photo carousel, and ASCII-morph hero stay (re-colored
  only).

## 3. Command palette

- New `src/components/CommandPalette.tsx`, opened with Cmd/Ctrl+K, plus a small
  "⌘K" hint button in the nav.
- Fuzzy-filterable entries: page sections (About, Projects, Experience, Skills,
  Certifications), project detail pages, Contact.
- Keyboard: arrows move selection, Enter navigates (scroll or route), Esc closes.
- Styled to the new theme: dark overlay, monospace-accented list, accent-colored
  active row. Mounted once in `App.tsx` so it works on every page.

## 4. Animated skill proficiency

- Below the dome gallery in `Skills.tsx`: grouped skill rows (e.g. Languages,
  Frameworks, Tools), each with a bar animating 0 → target % on first scroll
  into view (IntersectionObserver).
- Data is a typed array in `Skills.tsx` (`name`, `category`, `proficiency`
  0–100), documented in the README customization guide.

## 5. Verification

- `npm run build` and `npm run lint` must pass.
- Manual pass in the dev server: both themes, all nav sections, command
  palette, one project detail page; confirm no leftover pink.

## Out of scope

- Blog section, GitHub stats (declined during brainstorming).
- Deleting the unused asset files from disk is optional cleanup; removing their
  *usages* is required.
