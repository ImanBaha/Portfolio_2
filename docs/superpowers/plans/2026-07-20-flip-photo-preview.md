# Flip Photo Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the About section's photo-stack thumbnail show real photos — the front card auto-cycles through 3 profile photos via a flip animation, the two background cards show real (static, dimmed) photos — while the existing click-to-open-modal behavior stays exactly as it is today.

**Architecture:** A new presentational component (`FlipPhotoPreview`) owns an auto-advancing timer and a CSS `rotateY` "dip" animation (0° → 90° → 0°), swapping the image `src` at the 90° midpoint where the card is edge-on and invisible — this reads as a clean flip with no mirroring artifacts, and needs no dual-face DOM. `About.tsx` drops this component into the existing front (z-3) stack card, replaces the two flat-gray background cards with static dimmed `<img>`s, and wires hover/focus state down as a `paused` prop.

**Tech Stack:** React 19 + TypeScript, Vite, Tailwind utility classes + plain CSS in `src/App.css`. No test framework is installed in this repo (`package.json` scripts are only `dev`, `build` (`tsc -b && vite build`), `lint`, `preview`) — verification in this plan uses `npx tsc -b` (type-check), `npm run lint`, and manual checks via `npm run dev`, matching the spec's own "Testing / verification: Manual, via the dev server" section.

## Global Constraints

- No new dependencies — use only React/CSS already in the project.
- Respect `prefers-reduced-motion: reduce` — auto-flip must not run when the user has this set.
- The existing click → `setShowProfileModal(true)` behavior must be unchanged; the flip preview is purely visual/non-interactive.
- Decorative images (front flip card, both background cards) get `alt=""` — the parent `<button aria-label="Open photo gallery (3 photos)">` remains the single accessible description of the control.
- Match existing code conventions in `About.tsx`/`App.css` (Tailwind utility classes + inline style objects for one-off values, plain CSS keyframes in `App.css` for animations, as already used by `.journal-photo-stack`/`journalBob`/`journalPulseRing`).

---

### Task 1: `FlipPhotoPreview` component

**Files:**
- Create: `src/components/FlipPhotoPreview.tsx`

**Interfaces:**
- Produces: `export default FlipPhotoPreview` — a React component with props
  `{ images: { src: string; alt?: string }[]; intervalMs?: number; flipMs?: number; paused?: boolean; className?: string }`.
  Renders a single `<img>` as its root element (no wrapper div), so callers fully control sizing/rounding via `className`.
  Later tasks rely on: the prop names above exactly, and that the rendered root element is an `<img>` (so `className="w-full h-full rounded-[2px] object-cover"` passed by a caller lands directly on the image).

- [ ] **Step 1: Write the component**

```tsx
import { useEffect, useState } from 'react';

interface FlipPhotoPreviewImage {
  src: string;
  alt?: string;
}

interface FlipPhotoPreviewProps {
  images: FlipPhotoPreviewImage[];
  intervalMs?: number;
  flipMs?: number;
  paused?: boolean;
  className?: string;
}

const FlipPhotoPreview = ({
  images,
  intervalMs = 2500,
  flipMs = 600,
  paused = false,
  className = '',
}: FlipPhotoPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(
    typeof document !== 'undefined' ? document.hidden : false
  );

  // Pause the cycle while the tab is backgrounded so it isn't burning CPU off-screen.
  useEffect(() => {
    const handleVisibilityChange = () => setIsDocumentHidden(document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (images.length <= 1 || paused || isDocumentHidden) {
      return undefined;
    }
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    let swapTimer: ReturnType<typeof setTimeout>;
    let endTimer: ReturnType<typeof setTimeout>;

    const cycle = setInterval(() => {
      setIsFlipping(true);

      // Fires at the animation midpoint (card edge-on, invisible) — the swap is imperceptible.
      swapTimer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, flipMs / 2);

      endTimer = setTimeout(() => {
        setIsFlipping(false);
      }, flipMs);
    }, intervalMs + flipMs);

    return () => {
      clearInterval(cycle);
      clearTimeout(swapTimer);
      clearTimeout(endTimer);
      setIsFlipping(false);
    };
  }, [images.length, intervalMs, flipMs, paused, isDocumentHidden]);

  const current = images[currentIndex];
  if (!current) {
    return null;
  }

  return (
    <img
      src={current.src}
      alt={current.alt ?? ''}
      className={`flip-preview-img ${isFlipping ? 'is-flipping' : ''} ${className}`}
      style={{ '--flip-duration': `${flipMs}ms` } as React.CSSProperties}
      loading="eager"
      decoding="async"
    />
  );
};

export default FlipPhotoPreview;
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc -b`
Expected: no errors (exit code 0, no output).

Run: `npm run lint`
Expected: no new errors/warnings reported for `src/components/FlipPhotoPreview.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/FlipPhotoPreview.tsx
git commit -m "feat: add FlipPhotoPreview component for auto-cycling photo flip"
```

---

### Task 2: Flip animation CSS

**Files:**
- Modify: `src/App.css:906-909` (end of file)

**Interfaces:**
- Consumes: none.
- Produces: CSS classes `.flip-preview-img` and `.flip-preview-img.is-flipping`, and the `flipPreviewDip` keyframe — these are the exact class names `FlipPhotoPreview` (Task 1) applies to its `<img>`.

- [ ] **Step 1: Append the flip keyframes and classes**

The current end of `src/App.css` reads:

```css
.journal-photo-stack {
  animation: journalBob 3s ease-in-out infinite;
}

.journal-photo-stack:hover,
.journal-photo-stack:focus-visible {
  animation-play-state: paused;
}
```

Add this immediately after it (new end of file):

```css
@keyframes flipPreviewDip {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(90deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

.flip-preview-img {
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

- [ ] **Step 2: Verify no build regressions**

Run: `npx tsc -b`
Expected: no errors (CSS changes don't affect TypeScript, but this confirms the working tree is otherwise still clean).

Visually: run `npm run dev`, open the site — the About section's photo stack should look unchanged so far (this task only adds unused-so-far CSS; Task 3 is what wires it up).

- [ ] **Step 3: Commit**

```bash
git add src/App.css
git commit -m "style: add flip-preview keyframes for photo stack animation"
```

---

### Task 3: Wire it into the About section photo stack

**Files:**
- Modify: `src/components/section/About.tsx`

**Interfaces:**
- Consumes: `FlipPhotoPreview` from Task 1 (`import FlipPhotoPreview from '../FlipPhotoPreview'`), `.flip-preview-img`/`.is-flipping` CSS from Task 2 (applied internally by `FlipPhotoPreview`, nothing to reference directly here).
- Produces: nothing new for later tasks (this is the last task).

- [ ] **Step 1: Remove the now-unused `Camera` import**

In `src/components/section/About.tsx`, line 3 currently reads:

```tsx
import { ChevronLeft, ChevronRight, Camera, ImageOff } from 'lucide-react';
```

Change to:

```tsx
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
```

- [ ] **Step 2: Import `FlipPhotoPreview`**

Add this import near the top of `src/components/section/About.tsx`, alongside the existing local component imports (after the `TypewriterCarousel` import, line 5):

```tsx
import FlipPhotoPreview from '../FlipPhotoPreview';
```

- [ ] **Step 3: Add hover/focus pause state**

In the `About` component body, alongside the other `useState` calls (near line 109, after `currentImageIndex`), add:

```tsx
const [isStackPaused, setIsStackPaused] = useState(false);
```

- [ ] **Step 4: Wire pause handlers onto the stack button and replace the three placeholder cards**

The current photo-stack button (around line 439-492) reads:

```tsx
                <button
                  type="button"
                  onClick={() => setShowProfileModal(true)}
                  aria-label="Open photo gallery (3 photos)"
                  className="journal-photo-stack group absolute bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
                  style={{ right: '4%', bottom: '5%', width: 'clamp(56px, 12%, 120px)' }}
                >
                  <div className="relative w-full" style={{ aspectRatio: '4 / 5' }}>
                    <div
                      className="absolute inset-0 rounded-sm bg-white transition-transform duration-300 rotate-[-10deg] group-hover:rotate-0"
                      style={{ zIndex: 1, padding: '8%', boxShadow: '0 6px 16px rgba(0,0,0,0.22)' }}
                    >
                      <div className="w-full h-full rounded-[2px]" style={{ backgroundColor: '#E5E7EB' }} />
                    </div>
                    <div
                      className="absolute inset-0 rounded-sm bg-white transition-transform duration-300 rotate-[6deg] group-hover:rotate-0"
                      style={{ zIndex: 2, padding: '8%', boxShadow: '0 6px 16px rgba(0,0,0,0.22)' }}
                    >
                      <div className="w-full h-full rounded-[2px]" style={{ backgroundColor: '#E5E7EB' }} />
                    </div>
                    <div
                      className="absolute inset-0 rounded-sm bg-white transition-transform duration-300 rotate-[-2deg] group-hover:rotate-0"
                      style={{ zIndex: 3, padding: '8%', boxShadow: '0 8px 20px rgba(0,0,0,0.28)' }}
                    >
                      <div
                        className="w-full h-full rounded-[2px] flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #67E8F9 0%, #0EA5E9 100%)' }}
                      >
                        <Camera className="w-1/3 h-1/3 text-white/90" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Count badge with a gentle pulse so it reads as "interactive" even without hovering */}
                    <span
                      className="journal-photo-badge absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white text-[11px] font-bold"
                      style={{ width: '20px', height: '20px', backgroundColor: '#0EA5E9', zIndex: 4 }}
                    >
                      3
                    </span>
                  </div>
```

Replace it with:

```tsx
                <button
                  type="button"
                  onClick={() => setShowProfileModal(true)}
                  onMouseEnter={() => setIsStackPaused(true)}
                  onMouseLeave={() => setIsStackPaused(false)}
                  onFocus={() => setIsStackPaused(true)}
                  onBlur={() => setIsStackPaused(false)}
                  aria-label="Open photo gallery (3 photos)"
                  className="journal-photo-stack group absolute bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
                  style={{ right: '4%', bottom: '5%', width: 'clamp(56px, 12%, 120px)' }}
                >
                  <div className="relative w-full" style={{ aspectRatio: '4 / 5' }}>
                    <div
                      className="absolute inset-0 rounded-sm bg-white transition-transform duration-300 rotate-[-10deg] group-hover:rotate-0"
                      style={{ zIndex: 1, padding: '8%', boxShadow: '0 6px 16px rgba(0,0,0,0.22)' }}
                    >
                      <img
                        src={profile3}
                        alt=""
                        className="w-full h-full rounded-[2px] object-cover"
                        style={{ filter: 'brightness(0.65)' }}
                      />
                    </div>
                    <div
                      className="absolute inset-0 rounded-sm bg-white transition-transform duration-300 rotate-[6deg] group-hover:rotate-0"
                      style={{ zIndex: 2, padding: '8%', boxShadow: '0 6px 16px rgba(0,0,0,0.22)' }}
                    >
                      <img
                        src={profile2}
                        alt=""
                        className="w-full h-full rounded-[2px] object-cover"
                        style={{ filter: 'brightness(0.65)' }}
                      />
                    </div>
                    <div
                      className="absolute inset-0 rounded-sm bg-white transition-transform duration-300 rotate-[-2deg] group-hover:rotate-0"
                      style={{ zIndex: 3, padding: '8%', boxShadow: '0 8px 20px rgba(0,0,0,0.28)', perspective: '600px' }}
                    >
                      <FlipPhotoPreview
                        images={profileImages.map((p) => ({ src: p.src }))}
                        paused={isStackPaused}
                        className="w-full h-full rounded-[2px] object-cover"
                      />
                    </div>

                    {/* Count badge with a gentle pulse so it reads as "interactive" even without hovering */}
                    <span
                      className="journal-photo-badge absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white text-[11px] font-bold"
                      style={{ width: '20px', height: '20px', backgroundColor: '#0EA5E9', zIndex: 4 }}
                    >
                      3
                    </span>
                  </div>
```

(The closing `</button>` and the "view photos →" label after it are untouched — this edit only spans from the `<button` opening tag through the closing `</div>` of the badge, i.e. everything shown above.)

- [ ] **Step 5: Type-check and lint**

Run: `npx tsc -b`
Expected: no errors. In particular, confirm no "unused import" error for `Camera` (removed in Step 1) and no type errors on the new `FlipPhotoPreview` usage.

Run: `npm run lint`
Expected: no new errors/warnings for `src/components/section/About.tsx`.

- [ ] **Step 6: Manual verification via dev server**

Run: `npm run dev`, open the printed local URL, navigate to the About section.

Check each of the following (from the spec's testing section):
- The front (top) card of the photo stack cycles through all 3 profile photos on a loop, with a visible flip (not an instant jump-cut).
- The two background cards behind it show real, dimmed photos (not flat gray).
- Hovering over the stack pauses the flip; moving the mouse away resumes it.
- Tab-switch away from the browser and back — the flip does not appear to have sped up or be running two overlapping cycles.
- Click the stack (both mid-flip and while at rest) — the existing full-screen carousel modal still opens correctly, with all 3 photos in the correct order, arrows/dots/caption/close all working as before.
- In DevTools, enable the "prefers-reduced-motion: reduce" emulation (Rendering tab) and reload — the stack's front card should show a static photo with no flip animation.
- Toggle dark/light mode — both the flip card and the two dimmed background cards should look reasonable in both themes.

- [ ] **Step 7: Commit**

```bash
git add src/components/section/About.tsx
git commit -m "feat: show real flipping photo previews in About photo stack"
```
