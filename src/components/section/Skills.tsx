import { useEffect, useRef, useState } from "react";
import DomeGallery from "../ui/domegallery";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useThemeColors } from "../../hooks/useThemeColors";
import { withAlpha } from "../../hooks/useThemeColors";

interface SkillGroup {
  directory: string; // shown as the "ls" target in the terminal
  skills: string[];
}

// Edit these with your own skills, grouped however you like
const skillGroups: SkillGroup[] = [
  {
    directory: "./languages",
    skills: ["TypeScript", "JavaScript", "Python", "C++"],
  },
  {
    directory: "./frameworks",
    skills: ["React", "Node.js", "Express", "Tailwind CSS"],
  },
  {
    directory: "./tools",
    skills: ["Git", "Docker", "AWS", "PostgreSQL"],
  },
];

// Terminal-style skill listing; groups type in staggered when scrolled into view
const SkillTerminal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useDarkMode();
  const themeColors = useThemeColors();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const promptColor = isDarkMode ? themeColors.colors.accent[300] : themeColors.colors.accent[600];
  const mutedColor = isDarkMode ? themeColors.colors.dark[500] : themeColors.colors.dark[400];

  return (
    <div
      ref={containerRef}
      className="max-w-3xl mx-auto mt-10 rounded-xl overflow-hidden"
      style={{
        backgroundColor: isDarkMode ? withAlpha(themeColors.colors.dark[950], 0.7) : themeColors.colors.dark[900],
        border: `1px solid ${withAlpha(themeColors.colors.accent[400], isDarkMode ? 0.25 : 0.35)}`,
        boxShadow: `0 20px 60px rgba(0, 0, 0, ${isDarkMode ? 0.5 : 0.25}), 0 0 40px ${withAlpha(themeColors.colors.accent[400], 0.06)}`,
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: `1px solid ${withAlpha(themeColors.colors.dark[600], 0.5)}` }}
      >
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FEBC2E' }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28C840' }} />
        <span className="ml-3 text-xs font-mono" style={{ color: mutedColor }}>
          ~/skills — zsh
        </span>
      </div>

      {/* Terminal body */}
      <div className="px-5 py-5 font-mono text-sm space-y-5">
        {skillGroups.map((group, groupIndex) => (
          <div
            key={group.directory}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 0.5s ease ${groupIndex * 0.25}s, transform 0.5s ease ${groupIndex * 0.25}s`,
            }}
          >
            <div className="mb-2.5">
              <span style={{ color: promptColor }}>$ </span>
              <span style={{ color: themeColors.colors.dark[100] }}>ls {group.directory}</span>
            </div>
            <div className="flex flex-wrap gap-2 pl-4">
              {group.skills.map((skill, skillIndex) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded text-xs transition-all duration-200 hover:-translate-y-0.5 cursor-default"
                  style={{
                    color: isDarkMode ? themeColors.colors.accent[300] : themeColors.colors.accent[200],
                    backgroundColor: withAlpha(themeColors.colors.accent[400], 0.08),
                    border: `1px solid ${withAlpha(themeColors.colors.accent[400], 0.3)}`,
                    opacity: isVisible ? 1 : 0,
                    transition: `opacity 0.4s ease ${groupIndex * 0.25 + skillIndex * 0.06 + 0.15}s, transform 0.2s ease`,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Blinking cursor line */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transition: `opacity 0.5s ease ${skillGroups.length * 0.25 + 0.3}s`,
          }}
        >
          <span style={{ color: promptColor }}>$ </span>
          <span className="cursor" style={{ color: promptColor }}>▊</span>
        </div>
      </div>
    </div>
  );
};

const Skills = () => {
  const [scale, setScale] = useState(0.5);
  const sectionRef = useRef<HTMLDivElement>(null);
  const domeContainerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useDarkMode();
  const themeColors = useThemeColors();

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate visibility based on how centered the section is
      let visibilityRatio = 0;

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const sectionHeight = rect.height;
        const sectionCenter = rect.top + sectionHeight / 2;
        const windowCenter = windowHeight / 2;
        const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
        const maxDistance = windowHeight / 2 + sectionHeight / 2;

        // Smooth curve that peaks when section is centered
        visibilityRatio = 1 - (distanceFromCenter / maxDistance);
        visibilityRatio = Math.max(0, Math.min(1, visibilityRatio));

        // Apply easing curve for more natural growth
        visibilityRatio = visibilityRatio * visibilityRatio * (3 - 2 * visibilityRatio);
      }

      // Scale from 0.5 to 1 instead of 0 to 1 for better starting size
      const minScale = 0.5;
      const maxScale = 1;
      const finalScale = minScale + (maxScale - minScale) * visibilityRatio;
      setScale(finalScale);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="min-h-screen py-20 relative" style={{
      background: themeColors.background.sections?.skills || themeColors.background.gradient,
      transition: 'background 0.3s ease-in-out'
    }}>
      {/* Gradient overlay for smooth transition from previous section */}
      <div 
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '300px',
          background: isDarkMode 
            ? `linear-gradient(180deg, ${themeColors.background.gradientEnd} 0%, transparent 100%)`
            : `linear-gradient(180deg, ${themeColors.colors.accent[25]} 0%, transparent 100%)`,
          zIndex: 1
        }}
      />
      <div className="container mx-auto px-6 relative" style={{ zIndex: 2 }}>
        <span className="section-label text-center" style={{ color: isDarkMode ? themeColors.colors.accent[300] : themeColors.colors.accent[600] }}>// what i work with</span>
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: isDarkMode ? themeColors.colors.white : themeColors.colors.accent[500] }}>Skills</h2>
        <div
          ref={domeContainerRef}
          className="relative w-full"
          style={{
            height: '600px',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          <DomeGallery />
          {/* Faded edges overlay with performance-optimized blending */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDarkMode
                ? `radial-gradient(ellipse at center, transparent 40%, ${withAlpha(themeColors.colors.dark[900], 0.1)} 70%, ${withAlpha(themeColors.colors.dark[900], 0.6)} 90%, ${withAlpha(themeColors.colors.dark[900], 0.8)} 100%)`
                : `radial-gradient(ellipse at center, transparent 40%, ${withAlpha(themeColors.colors.accent[50], 0.1)} 70%, ${withAlpha(themeColors.colors.accent[50], 0.6)} 90%, ${withAlpha(themeColors.colors.accent[50], 0.8)} 100%)`,
              maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 85%)',
            }}
          />
        </div>
        <SkillTerminal />
      </div>
    </section>
  );
};

export default Skills;