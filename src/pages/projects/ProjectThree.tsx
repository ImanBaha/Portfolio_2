import { Link } from 'react-router-dom';
import {
  Github,
  Calendar,
  User,
  Sparkles,
  Layers,
  Lightbulb,
  ArrowRight,
  ArrowUpRight,
  MonitorSmartphone,
} from 'lucide-react';
import ProjectLayout from '../../components/project/ProjectLayout';
import TechStack from '../../components/project/TechStack';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useThemeColors, withAlpha } from '../../hooks/useThemeColors';
import socialLinks from '../../config/socialLinks';

const features = [
  {
    icon: Sparkles,
    title: 'Feature One',
    description: "Explain what it does and why it's cool.",
  },
  {
    icon: Layers,
    title: 'Feature Two',
    description: "Explain what it does and why it's cool.",
  },
  {
    icon: MonitorSmartphone,
    title: 'Feature Three',
    description: "Explain what it does and why it's cool.",
  },
];

const ProjectThree = () => {
  const { isDarkMode } = useDarkMode();
  const themeColors = useThemeColors();
  const githubUrl = socialLinks.repositories.projectThree;

  const accentSoft = isDarkMode ? themeColors.colors.accent[300] : themeColors.colors.accent[600];
  const accentStrong = isDarkMode ? themeColors.colors.accent[400] : themeColors.colors.accent[500];
  const glow = isDarkMode ? 'rgba(34, 211, 238, 0.35)' : 'rgba(14, 165, 233, 0.25)';

  return (
    <ProjectLayout>
      <div className="mt-4 md:mt-8 animate-fade-in">

        {/* Hero */}
        <header
          className="hero-ambient relative overflow-hidden rounded-3xl border px-6 sm:px-10 py-12 md:py-16 mb-14"
          style={{
            borderColor: themeColors.card.border,
            background: isDarkMode
              ? 'linear-gradient(180deg, rgba(34,211,238,0.06) 0%, rgba(15,23,42,0) 60%)'
              : 'linear-gradient(180deg, rgba(14,165,233,0.06) 0%, rgba(255,255,255,0) 60%)',
          }}
        >
          <span className="section-label" style={{ color: accentSoft }}>
            // featured project
          </span>

          <h1
            className="text-4xl md:text-6xl font-bold mb-5 tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${accentSoft} 0%, ${accentStrong} 100%)`,
            }}
          >
            Project Three
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mb-6" style={{ color: themeColors.text.secondary }}>
            A brief description of your third project. Highlight the key features and what makes it unique.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 text-sm" style={{ color: themeColors.text.secondary }}>
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" style={{ color: accentStrong }} aria-hidden="true" />
              Your Role
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" style={{ color: accentStrong }} aria-hidden="true" />
              2026
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: themeColors.colors.utility.success, boxShadow: `0 0 8px ${themeColors.colors.utility.success}` }}
              />
              Status Placeholder
            </span>
          </div>

          <TechStack technologies={['React', 'TypeScript', 'Node.js', 'MongoDB']} />

          <div className="flex flex-wrap gap-4 mt-8">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${accentSoft} 0%, ${accentStrong} 100%)`,
                  color: isDarkMode ? themeColors.colors.dark[950] : themeColors.colors.white,
                  boxShadow: `0 8px 24px ${glow}`,
                }}
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                View Code
              </a>
            )}
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border transition-colors duration-200"
              style={{ borderColor: accentStrong, color: accentSoft }}
            >
              Discuss this project
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </header>

        {/* Showcase */}
        <div
          className="rounded-2xl overflow-hidden mb-16 border shadow-lg"
          style={{ borderColor: themeColors.card.border }}
        >
          {/* Browser chrome bar */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b"
            style={{
              backgroundColor: isDarkMode ? themeColors.colors.dark[900] : themeColors.colors.accent[25],
              borderColor: themeColors.card.border,
            }}
          >
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#EF4444' }} />
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#10B981' }} />
            <span
              className="ml-3 text-xs font-mono px-3 py-1 rounded-full truncate"
              style={{
                color: themeColors.text.tertiary,
                backgroundColor: isDarkMode ? withAlpha(themeColors.colors.accent[300], 0.08) : themeColors.colors.white,
              }}
            >
              project-one.yourdomain.dev
            </span>
          </div>

          <div
            className="w-full aspect-video flex items-center justify-center"
            style={{ backgroundColor: themeColors.card.background }}
          >
            <p className="italic text-sm" style={{ color: themeColors.text.tertiary }}>
              Add a screenshot or video of your project here
            </p>
          </div>
        </div>

        {/* Overview */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDarkMode ? themeColors.colors.white : accentStrong }}>
            Overview
          </h2>
          <p className="text-base leading-relaxed max-w-3xl" style={{ color: themeColors.text.primary }}>
            Explain the problem this project solves and the core purpose of building it. This is a great place to
            talk about your motivation and the overall goals of the application.
          </p>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8" style={{ color: isDarkMode ? themeColors.colors.white : accentStrong }}>
            Key Features
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: themeColors.card.background,
                  borderColor: themeColors.card.border,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accentStrong;
                  e.currentTarget.style.boxShadow = `0 12px 30px ${glow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = themeColors.card.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  className="inline-flex items-center justify-center h-11 w-11 rounded-xl mb-4"
                  style={{
                    backgroundColor: isDarkMode ? withAlpha(themeColors.colors.accent[300], 0.15) : themeColors.colors.accent[50],
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: accentStrong }} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: themeColors.text.primary }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: themeColors.text.secondary }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Challenges & Learnings */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6" style={{ color: isDarkMode ? themeColors.colors.white : accentStrong }}>
            Challenges &amp; Learnings
          </h2>
          <div
            className="relative rounded-2xl border p-8 pl-10"
            style={{
              backgroundColor: isDarkMode ? withAlpha(themeColors.colors.accent[300], 0.05) : themeColors.colors.accent[25],
              borderColor: themeColors.card.border,
            }}
          >
            <Lightbulb
              className="absolute -top-4 left-6 h-8 w-8 rounded-full p-1.5"
              style={{
                color: isDarkMode ? themeColors.colors.dark[950] : themeColors.colors.white,
                backgroundColor: accentStrong,
                boxShadow: `0 4px 14px ${glow}`,
              }}
              aria-hidden="true"
            />
            <p className="text-base leading-relaxed" style={{ color: themeColors.text.primary }}>
              Talk about any technical hurdles you faced while building this project and how you overcame them.
              What did you learn from this experience?
            </p>
          </div>
        </section>

        {/* Closing CTA + project nav */}
        <div
          className="rounded-2xl border p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            borderColor: themeColors.card.border,
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(15,23,42,0) 100%)'
              : 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(255,255,255,0) 100%)',
          }}
        >
          <div>
            <p className="font-semibold mb-1" style={{ color: themeColors.text.primary }}>
              Curious to see more?
            </p>
            <p className="text-sm" style={{ color: themeColors.text.secondary }}>
              Check out the next project or get in touch to talk shop.
            </p>
          </div>
          <Link
            to="/projects/project-four"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-transform duration-200 hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${accentSoft} 0%, ${accentStrong} 100%)`,
              color: isDarkMode ? themeColors.colors.dark[950] : themeColors.colors.white,
              boxShadow: `0 8px 24px ${glow}`,
            }}
          >
            Next Project
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </ProjectLayout>
  );
};

export default ProjectThree;
