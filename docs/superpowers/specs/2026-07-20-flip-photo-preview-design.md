# Flip Photo Preview — Design

## Context

`About.tsx` has a clickable "photo stack" affordance (3 tilted cards) next to the
journal illustration. Clicking it opens the existing full-screen carousel modal
(`profileImages`: `profile1`, `profile2`, `profile3`), which already works well —
arrows, dots, counter, caption.

The stack thumbnail itself, however, is currently fake: the two background cards
are flat gray divs (`#E5E7EB`), and the front card is a cyan gradient with a
`Camera` icon — none of them show a real photo. The goal of this feature is to
make the thumbnail show real, live photo previews, with the front card
auto-cycling through the three photos via a flip animation, while leaving the
click-to-open-modal behavior untouched.

## Goals

- Front (top, z-3) card auto-cycles through `profile1 → profile2 → profile3 → …`
  forever, using a literal flip animation, without user interaction.
- Background (z-1, z-2) cards show real, static (non-animating), dimmed photos
  instead of flat gray placeholders, so the whole stack reads as "a stack of
  real photos."
- Clicking anywhere on the stack still opens the existing full-screen modal,
  unchanged.
- Respect `prefers-reduced-motion`; don't animate uselessly off-screen or
  while backgrounded/hovered.

## Non-goals

- No changes to the full-screen modal (carousel, arrows, dots, captions).
- No changes to which 3 photos are used, their order in the modal, or the
  modal's own transition.
- No hover-to-flip or click-to-advance interaction on the thumbnail itself —
  the only interaction on the stack remains "click opens modal."

## Component: `FlipPhotoPreview`

New file: `src/components/FlipPhotoPreview.tsx`.

Presentational-only component. Owns the auto-cycle timer and the flip
animation; knows nothing about the modal, the journal, or button semantics.

**Props:**
```ts
interface FlipPhotoPreviewProps {
  images: { src: string; alt?: string }[];
  intervalMs?: number; // default 2500 — how long each photo holds
  flipMs?: number;     // default 600 — duration of the flip transition
  paused?: boolean;    // external pause (hover/focus/reduced-motion/hidden tab)
  className?: string;
}
```

**Behavior:**
- Internal state: `currentIndex`, `isFlipping` (boolean, drives the CSS class
  toggling the `rotateY` keyframe animation).
- A `setInterval` (created in a `useEffect`, cleaned up on unmount/prop change)
  fires every `intervalMs + flipMs`: sets `isFlipping = true`, and via a
  `setTimeout` at `flipMs / 2` swaps `currentIndex` to the next photo (wrapping
  around), then via another `setTimeout` at `flipMs` sets `isFlipping = false`.
- The `setTimeout` at the midpoint is where the visible swap happens — the
  card is edge-on (`rotateY(90deg)`) and effectively invisible at that instant,
  so the swap reads as a clean flip rather than a jump-cut.
- If `paused` is true, or `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
  is true, the interval is never started (or is cleared if already running);
  the component just renders the current photo statically.
- Renders a single `<img>` with `alt=""` (decorative — the parent button
  already carries the accessible label) and `object-fit: cover` to fill the
  card without distortion.

**CSS (added to `src/App.css`):**
```css
@keyframes flipPreviewDip {
  0%   { transform: rotateY(0deg); }
  50%  { transform: rotateY(90deg); }
  100% { transform: rotateY(0deg); }
}

.flip-preview-img {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

.flip-preview-img.is-flipping {
  animation: flipPreviewDip var(--flip-duration, 600ms) ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .flip-preview-img.is-flipping {
    animation: none;
  }
}
```
The parent card wrapper needs `perspective: 600px` (inline style, since it's
scoped to this one spot) for the `rotateY` to read as a 3D flip rather than a
flat squash.

## Changes to `About.tsx`

1. **Front card (z-3):** replace the gradient `div` + `Camera` icon with:
   ```tsx
   <FlipPhotoPreview
     images={profileImages.map(p => ({ src: p.src }))}
     paused={isStackPaused}
   />
   ```
   Remove the `Camera` import (no longer used anywhere in this file — verify
   with a grep before removing).

2. **Background cards (z-1, z-2):** replace the flat
   `backgroundColor: '#E5E7EB'` divs with static `<img>` tags — one showing
   `profile3`, the other `profile2` (fixed assignment, not synced to the
   front card's current index, to avoid cross-component sync complexity for
   a detail that's barely noticeable at this size). Each gets
   `style={{ objectFit: 'cover', filter: 'brightness(0.65)' }}` and
   `alt=""`.

3. **Pause wiring:** add a small `isStackPaused` state (`useState(false)`) in
   `About`. Wire the existing stack `<button>`'s `onMouseEnter` / `onMouseLeave`
   / `onFocus` / `onBlur` to set it, mirroring the existing
   `.journal-photo-stack:hover, :focus-visible { animation-play-state: paused }`
   CSS pause pattern already used for the bob animation — this just extends
   the same "hovering pauses the idle motion" idea to the new flip. Also pause
   when `document.hidden` via a `visibilitychange` listener in the same
   effect that would otherwise run the interval — simplest place for this is
   inside `FlipPhotoPreview` itself (it already owns the interval), so
   `paused` from props gets OR'd with an internal `documentHidden` state.

4. Badge ("3") and "view photos →" label: unchanged.

## Data flow

`profileImages` (already defined in `About.tsx`) is the single source of
truth, unchanged in shape. `FlipPhotoPreview` receives a derived `images`
array from it. No new global state, no new context, no props drilled beyond
this one parent → child edge.

## Error handling

None needed beyond what exists — `profileImages` is a fixed, local, always-
three-element array; there's no dynamic/network loading path here (images are
statically imported and already bundled). No new failure modes are
introduced.

## Testing / verification

Manual, via the dev server (no existing test suite covers this section):
- Visually confirm the front card flips through all 3 photos on a loop.
- Confirm hovering/focusing the stack pauses the flip; moving away resumes it.
- Confirm switching to another browser tab and back doesn't leave multiple
  overlapping intervals running (no visual "double speed" after returning).
- Confirm clicking the stack (mid-flip or at rest) still opens the existing
  full-screen modal with correct photo order.
- Emulate `prefers-reduced-motion: reduce` in devtools — confirm the stack
  shows a static photo with no flip animation.
- Check both light and dark themes still look correct with real photos in
  the background cards (dimming should read fine against both).
