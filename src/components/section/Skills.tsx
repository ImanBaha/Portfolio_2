import { useEffect, useRef, useState } from "react";
import DomeGallery from "../ui/domegallery";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useThemeColors } from "../../hooks/useThemeColors";
import { withAlpha } from "../../hooks/useThemeColors";

interface Skill {
  name: string;
  proficiency: number; // 0-100
}

interface SkillGroup {
  category: string;
  skills: Skill[];
}

// Edit these with your own skills and proficiency levels
const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    skills: [
      { name: "TypeScript", proficiency: 90 },
      { name: "JavaScript", proficiency: 90 },
      { name: "Python", proficiency: 80 },
      { name: "C++", proficiency: 65 },
    ],
  },
  {
    category: "Frameworks",
    skills: [
      { name: "React", proficiency: 90 },
      { name: "Node.js", proficiency: 85 },
      { name: "Express", proficiency: 80 },
      { name: "Tailwind CSS", proficiency: 85 },
    ],
  },
  {
    category: "Tools & Platforms",
    skills: [
      { name: "Git", proficiency: 90 },
      { name: "Docker", proficiency: 70 },
      { name: "AWS", proficiency: 65 },
      { name: "PostgreSQL", proficiency: 75 },
    ],
  },
];

// Proficiency bars that animate from 0 to their target on first scroll into view
const SkillBars = () => {
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

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {skillGroups.map((group) => (
        <div key={group.category}>
          <h3
            className="font-mono text-sm uppercase tracking-widest mb-4"
            style={{ color: isDarkMode ? themeColors.colors.accent[300] : themeColors.colors.accent[600] }}
          >
            {group.category}
          </h3>
          <div className="space-y-4">
            {group.skills.map((skill, index) => (
              <div key={skill.name}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span
                    className="text-sm font-medium"
                    style={{ color: isDarkMode ? themeColors.colors.dark[200] : themeColors.colors.dark[700] }}
                  >
                    {skill.name}
                  </span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: isDarkMode ? themeColors.colors.dark[400] : themeColors.colors.dark[500] }}
                  >
                    {skill.proficiency}%
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: isDarkMode ? themeColors.colors.dark[800] : themeColors.colors.dark[200] }}
                  role="progressbar"
                  aria-valuenow={skill.proficiency}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${skill.name} proficiency`}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: isVisible ? `${skill.proficiency}%` : '0%',
                      background: `linear-gradient(90deg, ${themeColors.colors.accent[500]}, ${themeColors.colors.accent[300]})`,
                      boxShadow: `0 0 8px ${withAlpha(themeColors.colors.accent[400], 0.5)}`,
                      transition: `width 1s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
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
        <SkillBars />
      </div>
    </section>
  );
};

export default Skills;