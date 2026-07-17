import { useCallback, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Camera, ImageOff } from 'lucide-react';
import AsciiMorphText from '../AsciiMorphText';
import TypewriterCarousel from '../TypewriterCarousel';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useThemeColors, withAlpha } from '../../hooks/useThemeColors';
import { aboutMeJournalWebp800, aboutMeJournalWebp400, profile1, profile2, profile3, techStackIcons } from '../../assets';

// Tech icons that spread out around the journal as you scroll. Module-level so the
// array (and the pure transform math below) isn't recreated every render.
const floatingIcons = [
  { id: 1, image: techStackIcons.ReactLight, initialX: -180, initialY: -80, finalX: -550, finalY: -100, mobileInitialX: -120, mobileInitialY: -60, mobileFinalX: -250, mobileFinalY: -80 },
  { id: 2, image: techStackIcons.TypeScript, initialX: 180, initialY: -60, finalX: 600, finalY: -250, mobileInitialX: 120, mobileInitialY: -40, mobileFinalX: 200, mobileFinalY: -120 },
  { id: 3, image: techStackIcons.NodeJSLight, initialX: -160, initialY: 240, finalX: -200, finalY: 380, mobileInitialX: -100, mobileInitialY: 160, mobileFinalX: -120, mobileFinalY: 220 },
  { id: 4, image: techStackIcons.Docker, initialX: 190, initialY: 260, finalX: 500, finalY: 150, mobileInitialX: 110, mobileInitialY: 180, mobileFinalX: 180, mobileFinalY: 120 },
  { id: 5, image: techStackIcons.JavaScript, initialX: -200, initialY: 120, finalX: -200, finalY: -380, mobileInitialX: -130, mobileInitialY: 80, mobileFinalX: -130, mobileFinalY: -180 },
  { id: 6, image: techStackIcons.AWSLight, initialX: 170, initialY: 100, finalX: 150, finalY: -360, mobileInitialX: 110, mobileInitialY: 70, mobileFinalX: 100, mobileFinalY: -160 },
  { id: 7, image: techStackIcons.GithubLight, initialX: -130, initialY: -130, finalX: -450, finalY: -380, mobileInitialX: -90, mobileInitialY: -90, mobileFinalX: -200, mobileFinalY: -200 },
  { id: 8, image: techStackIcons.MongoDB, initialX: 150, initialY: 200, finalX: 200, finalY: 350, mobileInitialX: 100, mobileInitialY: 140, mobileFinalX: 130, mobileFinalY: 200 },
  { id: 9, image: techStackIcons.TailwindCSSLight, initialX: -140, initialY: 300, finalX: -500, finalY: 200, mobileInitialX: -90, mobileInitialY: 200, mobileFinalX: -180, mobileFinalY: 160 },
  { id: 10, image: techStackIcons.ViteLight, initialX: 200, initialY: 120, finalX: 500, finalY: -380, mobileInitialX: 130, mobileInitialY: 80, mobileFinalX: 200, mobileFinalY: -180 },
  { id: 11, image: techStackIcons.ExpressJSLight, initialX: -220, initialY: -40, finalX: 600, finalY: 10, mobileInitialX: -140, mobileInitialY: -30, mobileFinalX: 220, mobileFinalY: 10 },
  { id: 12, image: techStackIcons.GraphQLLight, initialX: 110, initialY: -180, finalX: 500, finalY: 300, mobileInitialX: 80, mobileInitialY: -120, mobileFinalX: 180, mobileFinalY: 180 },
  { id: 13, image: techStackIcons.RedisLight, initialX: -120, initialY: 360, finalX: 500, finalY: -100, mobileInitialX: -80, mobileInitialY: 240, mobileFinalX: 180, mobileFinalY: -80 },
  { id: 14, image: techStackIcons.CPP, initialX: 210, initialY: 40, finalX: -640, finalY: -220, mobileInitialX: 140, mobileInitialY: 30, mobileFinalX: -220, mobileFinalY: -140 },
  { id: 15, image: techStackIcons.HTML, initialX: -100, initialY: 160, finalX: -400, finalY: 320, mobileInitialX: -70, mobileInitialY: 110, mobileFinalX: -150, mobileFinalY: 200 },
  { id: 16, image: techStackIcons.CSS, initialX: 130, initialY: -100, finalX: -600, finalY: 100, mobileInitialX: 90, mobileInitialY: -70, mobileFinalX: -200, mobileFinalY: 80 },
];

const getViewportFlags = () => ({
  isMobile: typeof window !== 'undefined' && window.innerWidth < 768,
  isVerySmall: typeof window !== 'undefined' && window.innerWidth < 375,
});

// Mobile layout: on a narrow screen there's no room to fan icons out to the sides
// (they end up behind the journal in its transparent corners, which looks broken), so
// instead we arrange them in a tidy band ABOVE and a band BELOW the journal. As the
// section scrolls away they slide straight back toward the journal, tuck behind it, and
// fade out — a clean vertical "gather" rather than a chaotic multi-directional scatter.
const MOBILE_COLS = [-138, -47, 47, 138];
const MOBILE_ROW_BASE = 165; // distance from journal centre to the inner band
const MOBILE_ROW_GAP = 56; // extra distance for the outer band

const computeMobileTransform = (index: number, progress: number, isVerySmall: boolean) => {
  const band = index < 8 ? -1 : 1; // -1 = above the journal, +1 = below it
  const local = index % 8;
  const row = Math.floor(local / 4); // 0 = inner (closer to journal), 1 = outer
  const col = local % 4;

  const xScale = isVerySmall ? 0.72 : 1;
  const yScale = isVerySmall ? 0.82 : 1;

  // Where the icon rests while the journal is in view
  const visibleX = MOBILE_COLS[col] * xScale;
  const visibleY = band * (MOBILE_ROW_BASE + row * MOBILE_ROW_GAP) * yScale;

  // Where it hides: gathered toward centre, tucked behind the journal
  const hiddenX = visibleX * 0.4;
  const hiddenY = band * 26 * yScale;

  // smoothstep for a soft settle instead of a linear slide
  const eased = progress * progress * (3 - 2 * progress);

  const x = hiddenX + (visibleX - hiddenX) * eased;
  const y = hiddenY + (visibleY - hiddenY) * eased;
  const scale = (isVerySmall ? 0.42 : 0.5) + (isVerySmall ? 0.3 : 0.38) * eased;
  const opacity = Math.min(1, Math.max(0, (eased - 0.04) * 1.3)); // fully hidden once tucked
  const rotation = (1 - eased) * band * 8;

  return {
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotation}deg)`,
    opacity,
  };
};

// Pure interpolation for one icon's position/scale/rotation at a given scroll progress.
// Kept outside the component and free of CSS transitions so it can be called directly
// from inside a rAF loop every frame without fighting a transition or triggering a re-render.
const computeIconTransform = (
  icon: (typeof floatingIcons)[number],
  index: number,
  progress: number,
  isMobile: boolean,
  isVerySmall: boolean
) => {
  if (isMobile) {
    return computeMobileTransform(index, progress, isVerySmall);
  }

  // Desktop: icons fan out to the sides of the wide journal as it comes into view.
  const constrainedFinalY = icon.finalY * 0.8;
  const x = icon.initialX + (icon.finalX - icon.initialX) * progress;
  const y = icon.initialY + (constrainedFinalY - icon.initialY) * progress;
  const scale = 0.8 + 0.4 * progress;
  const opacity = 0.9 + 0.1 * progress;
  const rotation = progress * 20;

  return {
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotation}deg)`,
    opacity,
  };
};

const About = () => {
  const [asciiText, setAsciiText] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewport, setViewport] = useState(getViewportFlags);
  const sectionRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Array<HTMLImageElement | null>>([]);
  const scrollProgressRef = useRef(0);
  const viewportRef = useRef(viewport);
  const { isDarkMode } = useDarkMode();
  const themeColors = useThemeColors();

  const roles = [
    'Software Engineer',
    'Full-Stack Developer',
    'Systems Engineer',
    'Frontend Developer',
  ];

  const profileImages = [
    { src: profile1, caption: "photo 1" },
    { src: profile2, caption: "photo 2" },
    { src: profile3, caption: "photo 3" }
  ];

  const fullAsciiArt = `┌───────────────────────────────┐
│ ● ● ●            ~/portfolio  │
├───────────────────────────────┤
│ $ whoami                      │
│ > software engineer           │
│                               │
│ $ cat status.txt              │
│ > building cool things...     │
│                               │
│ $ npm run life                │
│ ✓ compiled successfully       │
│ $ ▊                           │
└───────────────────────────────┘`;

  // Typewriter effect for ASCII art
  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 3; // Speed in milliseconds

    const typeWriter = () => {
      if (currentIndex < fullAsciiArt.length) {
        setAsciiText(fullAsciiArt.substring(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeWriter, typingSpeed);
      }
    };

    // Start typing after a small delay
    const startDelay = setTimeout(() => {
      typeWriter();
    }, 500);

    return () => clearTimeout(startDelay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Applies each floating icon's transform/opacity directly to the DOM (no setState,
  // no re-render, no CSS transition) so it tracks the scroll position 1:1 every frame —
  // a transition here would always be chasing a moving target and read as laggy/jittery,
  // which is exactly what made this feel "not smooth" on mobile.
  const applyIconTransforms = useCallback((progress: number) => {
    const { isMobile, isVerySmall } = viewportRef.current;
    floatingIcons.forEach((icon, i) => {
      const el = iconRefs.current[i];
      if (!el) return;
      const { transform, opacity } = computeIconTransform(icon, i, progress, isMobile, isVerySmall);
      el.style.transform = transform;
      el.style.opacity = String(opacity);
    });
  }, []);

  // Scroll progress drives the floating tech icons around the journal
  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate how much of the section is in view
      const visibleTop = Math.max(0, -rect.top);
      const visibleBottom = Math.min(sectionHeight, windowHeight - rect.top);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      const progress = Math.min(1, Math.max(0, visibleHeight / windowHeight));
      scrollProgressRef.current = progress;
      applyIconTransforms(progress);
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress(); // Initial position, before the first scroll event

    return () => window.removeEventListener('scroll', handleScroll);
  }, [applyIconTransforms]);

  // Keep the icons' spread/size tuned for the current viewport (phone vs desktop)
  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const next = getViewportFlags();
        viewportRef.current = next;
        setViewport(next);
        applyIconTransforms(scrollProgressRef.current);
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [applyIconTransforms]);

  // Focus management for modal
  useEffect(() => {
    if (showProfileModal) {
      // Focus the modal when it opens
      const timer = setTimeout(() => {
        const modal = document.querySelector('[role="region"][aria-label="Profile photo carousel"]') as HTMLElement;
        if (modal) {
          modal.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showProfileModal]);

  // Carousel navigation functions
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? profileImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === profileImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === 'Escape') {
      setIsClosing(true);
      setTimeout(() => {
        setShowProfileModal(false);
        setIsClosing(false);
      }, 300);
    }
  };

  return (
    <section id="about" ref={sectionRef} className="min-h-screen" style={{
      background: themeColors.background.sections?.about || themeColors.background.gradient,
      transition: 'background 0.3s ease-in-out',
      width: '100%',
      maxWidth: '100vw',
      contain: 'layout style'
    }}>
      {/* Hero Section */}
      <div className="hero-ambient py-10 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start max-w-6xl mx-auto gap-8">
            <div className="text-left w-full md:w-auto">
              <div className="ascii-container justify-start text-3xl md:text-4xl lg:text-5xl">
                <AsciiMorphText text="Hi, I'm Iman Baha" />
              </div>
              <div className="hero-subtitle justify-start text-base md:text-lg lg:text-xl mt-2">
                <div className="flex flex-wrap items-center justify-start">
                  <span className={isDarkMode ? 'hero-subtitle-dark' : 'hero-subtitle-light'}>I am a&nbsp;</span>
                  <TypewriterCarousel roles={roles} className={isDarkMode ? 'hero-subtitle-dark' : 'hero-subtitle-light'} />
                </div>
              </div>
              <div className="hero-buttons flex justify-start gap-3 mt-4">
                <a
                  href={`${import.meta.env.BASE_URL}Resume.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-action-btn text-sm md:text-base px-4 py-2 md:px-5 md:py-2.5 inline-block text-center"
                >
                  Resume →
                </a>
                <Link
                  to="/contact"
                  className="hero-action-btn text-sm md:text-base px-4 py-2 md:px-5 md:py-2.5"
                >
                  Contact →
                </Link>
              </div>
            </div>
            <div className="hidden md:block" style={{ fontSize: '0.8rem', lineHeight: '1', fontFamily: 'monospace', minHeight: '150px', color: isDarkMode ? themeColors.primary : themeColors.colors.accent[500] }}>
              <pre>{asciiText}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* About Section with Journal */}
      <div className="py-8 md:py-12" style={{
        background: isDarkMode
          ? 'transparent'
          : `linear-gradient(180deg, transparent 0%, ${withAlpha(themeColors.colors.accent[50], 0.5)} 50%, ${themeColors.colors.accent[25]} 100%)`
      }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center relative min-h-[400px] md:min-h-[600px]">
            {/* Floating tech icons that spread out on scroll */}
            <div className="absolute inset-0 flex items-center justify-center">
              {floatingIcons.map((icon, index) => (
                <img
                  key={icon.id}
                  ref={(el) => { iconRefs.current[index] = el; }}
                  src={icon.image}
                  alt=""
                  className="absolute z-10 pointer-events-none select-none"
                  style={{
                    // Starts hidden; the first rAF frame positions it correctly. Avoids a
                    // one-frame flash of all icons stacked, un-transformed, at dead centre.
                    opacity: 0,
                    willChange: 'transform, opacity',
                    borderRadius: '14px',
                    filter: `drop-shadow(0 4px 12px ${themeColors.effects.dropShadow})`,
                  }}
                  loading={icon.id <= 4 ? "eager" : "lazy"}
                  decoding="async"
                  width={viewport.isVerySmall ? 42 : viewport.isMobile ? 50 : 64}
                  height={viewport.isVerySmall ? 42 : viewport.isMobile ? 50 : 64}
                />
              ))}
            </div>

            {/* About Me Journal: a handwritten intro + interests, with a clearly-clickable photo stack */}
            <div className="w-full md:max-w-2xl lg:max-w-4xl relative z-20 px-1 md:px-0">
              <div className="relative">
                <picture>
                  <source
                    srcSet={`${aboutMeJournalWebp400} 400w, ${aboutMeJournalWebp800} 800w`}
                    sizes="(max-width: 375px) 320px, (max-width: 480px) 400px, (max-width: 768px) 450px, 800px"
                    type="image/webp"
                  />
                  {/* fallback for browsers that dont support webp */}
                  <img
                    src={aboutMeJournalWebp400}
                    alt="Illustration of an open spiral-bound notebook"
                    className="w-full h-auto object-contain select-none"
                    width="400"
                    height="300"
                    fetchPriority="high"
                    loading="eager"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </picture>

                {/* Left page: handwritten intro */}
                <div
                  className="absolute flex flex-col justify-center pointer-events-none"
                  style={{ left: '7%', top: '13%', width: '38%', height: '72%' }}
                >
                  <p
                    className="font-semibold leading-snug text-base sm:text-2xl md:text-3xl"
                    style={{ fontFamily: "'Caveat', cursive", color: '#1e293b' }}
                  >
                    Hey, I'm Iman 👋
                  </p>
                  <p
                    className="mt-1.5 sm:mt-3 leading-snug text-[11px] sm:text-base md:text-lg"
                    style={{ fontFamily: "'Caveat', cursive", color: '#334155' }}
                  >
                    Software engineer who's happiest turning messy ideas into
                    clean, working systems. Most days I'm deep in a terminal —
                    building, breaking, and fixing things right back up.
                  </p>
                  <p
                    className="mt-1.5 sm:mt-4 text-[9px] sm:text-sm md:text-base italic"
                    style={{ fontFamily: "'Caveat', cursive", color: '#64748b' }}
                  >
                    based in Malaysia · always shipping
                  </p>
                </div>

                {/* Right page: interests, nudging toward the photo stack */}
                <div
                  className="absolute flex flex-col justify-center pointer-events-none"
                  style={{ left: '56%', top: '13%', width: '38%', height: '72%' }}
                >
                  <p
                    className="font-semibold leading-snug text-base sm:text-2xl md:text-3xl"
                    style={{ fontFamily: "'Caveat', cursive", color: '#1e293b' }}
                  >
                    Currently into:
                  </p>
                  <ul
                    className="mt-1.5 sm:mt-3 leading-snug text-[11px] sm:text-base md:text-lg space-y-0 sm:space-y-1"
                    style={{ fontFamily: "'Caveat', cursive", color: '#334155', listStyle: 'none' }}
                  >
                    <li>— full-stack side projects</li>
                    <li>— clean system design</li>
                    <li>— new frameworks &amp; tools</li>
                    <li>— coffee-fueled late nights ☕</li>
                  </ul>
                  <p
                    className="mt-2 sm:mt-5 text-[9px] sm:text-sm md:text-base italic"
                    style={{ fontFamily: "'Caveat', cursive", color: '#64748b' }}
                  >
                    a few snapshots along the way ↘
                  </p>
                </div>

                {/* Photo stack — the obvious "click me" affordance the plain image used to lack */}
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

                  {/* Persistent label — works on touch devices too, not just on hover */}
                  <span
                    className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium shadow"
                    style={{
                      bottom: '-1.4rem',
                      backgroundColor: isDarkMode ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.92)',
                      color: isDarkMode ? '#67E8F9' : '#0284C7',
                      border: `1px solid ${isDarkMode ? 'rgba(34,211,238,0.35)' : 'rgba(14,165,233,0.35)'}`,
                    }}
                  >
                    view photos →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
          style={{ backgroundColor: themeColors.background.overlay }}
          onClick={() => {
            setIsClosing(true);
            setTimeout(() => {
              setShowProfileModal(false);
              setIsClosing(false);
            }, 300);
          }}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <div className={`relative w-full max-w-sm md:max-w-md ${isClosing ? 'animate-scaleOut' : 'animate-scaleIn'}`} onClick={(e) => e.stopPropagation()}>
            {/* Carousel Container */}
            <div
              className="relative w-full bg-black rounded-lg shadow-2xl overflow-hidden focus:outline-none"
              style={{
                aspectRatio: '4/5',
                minHeight: '300px',
                maxHeight: '80vh'
              }}
              role="region"
              aria-label="Profile photo carousel"
              aria-live="polite"
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              {/* Image Display */}
              <div className="relative w-full h-full flex items-center justify-center">
                {profileImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute w-full h-full transition-opacity duration-500 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {image.src ? (
                      <img
                        src={image.src}
                        alt={`Profile photo ${index + 1}`}
                        className="w-full h-full object-contain"
                        loading="eager"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-3"
                        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
                      >
                        <ImageOff className="h-10 w-10" style={{ color: themeColors.colors.accent[300] }} aria-hidden="true" />
                        <p className="text-sm" style={{ color: themeColors.colors.accent[200] }}>
                          Photo coming soon
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                style={{
                  backgroundColor: isDarkMode ? withAlpha(themeColors.colors.dark[700], 0.9) : withAlpha(themeColors.colors.white, 0.8),
                  color: isDarkMode ? themeColors.colors.white : themeColors.colors.dark[700],
                  border: isDarkMode ? '2px solid #374151' : 'none',
                  boxShadow: isDarkMode ? `0 4px 12px ${withAlpha(themeColors.colors.black, 0.6)}` : undefined
                } as React.CSSProperties}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                style={{
                  backgroundColor: isDarkMode ? withAlpha(themeColors.colors.dark[700], 0.9) : withAlpha(themeColors.colors.white, 0.8),
                  color: isDarkMode ? themeColors.colors.white : themeColors.colors.dark[700],
                  border: isDarkMode ? '2px solid #374151' : 'none',
                  boxShadow: isDarkMode ? `0 4px 12px ${withAlpha(themeColors.colors.black, 0.6)}` : undefined
                } as React.CSSProperties}
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {profileImages.length}
              </div>

              {/* Caption */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg text-base font-medium max-w-[220px] text-center">
                {profileImages[currentImageIndex].caption}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-0 mt-4">
              {profileImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 flex items-center justify-center"
                  style={{
                    minWidth: '44px',
                    minHeight: '44px',
                    padding: '0',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  } as React.CSSProperties}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <span
                    className="rounded-full transition-all"
                    style={{
                      width: index === currentImageIndex ? '32px' : '12px',
                      height: '12px',
                      backgroundColor: index === currentImageIndex ? themeColors.colors.accent[300] : (isDarkMode ? withAlpha(themeColors.colors.accent[300], 0.3) : themeColors.colors.dark[300])
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white rounded-full w-11 h-11 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90"
              style={{ 
                backgroundColor: themeColors.colors.accent[500],
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeColors.colors.accent[600]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = themeColors.colors.accent[500]}
              aria-label="Close modal"
              onClick={(e) => {
                e.stopPropagation();
                setIsClosing(true);
                setTimeout(() => {
                  setShowProfileModal(false);
                  setIsClosing(false);
                }, 300);
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default About;