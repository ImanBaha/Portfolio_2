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
