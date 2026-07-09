import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { ExternalLink, Code, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { socialLinks } from '../../config/socialLinks';
import { comingSoon } from '../../assets';

const Projects = () => {
  const { isDarkMode } = useDarkMode();
  const themeColors = useThemeColors();

  // carousel state
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const projectsPerPage = 4;

  // project data - these are the main cards
  const projects = [
    {
      title: "Project One",
      description: "A brief description of your first project. Highlight the key features and what makes it unique.",
      technologies: ["React", "TypeScript", "Node.js", "MongoDB"],
      icon: comingSoon,
      detailsUrl: "/projects/project-one",
      githubUrl: socialLinks.repositories.projectOne
    },
    {
      title: "Project Two",
      description: "A brief description of your second project. Highlight the key features and what makes it unique.",
      technologies: ["Python", "Flask", "PostgreSQL", "Docker"],
      icon: comingSoon,
      detailsUrl: "/projects/project-two",
      githubUrl: socialLinks.repositories.projectTwo
    },
    {
      title: "Project Three",
      description: "A brief description of your third project. Highlight the key features and what makes it unique.",
      technologies: ["JavaScript", "Express", "AWS", "Tailwind CSS"],
      icon: comingSoon,
      detailsUrl: "/projects/project-three",
      githubUrl: socialLinks.repositories.projectThree
    },
    {
      title: "Project Four",
      description: "A brief description of your fourth project. Highlight the key features and what makes it unique.",
      technologies: ["C++", "CMake", "OpenGL"],
      icon: comingSoon,
      detailsUrl: "/projects/project-four",
      githubUrl: socialLinks.repositories.projectFour
    }
  ];

  // Calculate carousel pagination
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = currentPage * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  // Create placeholder cards for "Coming Soon" projects
  const placeholderCount = projectsPerPage - currentProjects.length;
  const placeholders = Array.from({ length: placeholderCount }, (_, i) => ({
    id: `placeholder-${i}`,
    isPlaceholder: true
  }));

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setDirection('left');
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection('right');
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <section
      id="projects"
      className="py-20 relative transition-colors duration-300"
      style={{
        background: themeColors.background.sections?.projects || themeColors.background.gradient,
        transition: 'background 0.3s ease-in-out'
      }}
    >
      {/* Gradient overlay for smooth transition from previous section */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '150px',
          background: isDarkMode
            ? `linear-gradient(180deg, ${themeColors.background.gradientEnd} 0%, transparent 100%)`
            : `linear-gradient(180deg, ${themeColors.colors.accent[25]} 0%, transparent 100%)`,
          zIndex: 2
        }}
      />

      {/* main content container with the project cards */}
      <TooltipProvider delayDuration={200}>
        <div className="container mx-auto px-6 relative z-10">
          <span className="section-label text-center" style={{ color: isDarkMode ? themeColors.colors.accent[300] : themeColors.colors.accent[600] }}>// things i've built</span>
          <div className="flex items-center justify-center gap-1 mb-4">
            <h2 className="text-4xl font-bold" style={{ color: isDarkMode ? themeColors.colors.white : themeColors.colors.accent[500] }}>Projects</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="inline-flex items-center justify-center bg-transparent border-none outline-none focus:outline-none"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                  aria-label="Information about project icons"
                >
                  <Info
                    className="h-5 w-5 cursor-pointer transition-colors"
                    style={{ color: themeColors.primary }}
                    onMouseEnter={(e) => e.currentTarget.style.color = themeColors.secondary}
                    onMouseLeave={(e) => e.currentTarget.style.color = themeColors.primary}
                    fill="none"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-white text-gray-800 border-sky-200">
                <p>all favicons created by me!</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-center mb-12 text-lg text-gray-600 dark:text-gray-300">
            Here are some of the projects I've worked on recently
          </p>

          {/* grid layout for project cards */}
          <div
            key={currentPage}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8"
            style={{
              animation: `slideIn${direction === 'right' ? 'Right' : 'Left'} 0.4s ease-out`
            }}
          >
            {currentProjects.map((project, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative" style={{
                backgroundColor: themeColors.card.background,
                border: `1px solid ${themeColors.card.border}`
              }} aria-label={`${project.title} project`}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {project.icon && (
                      <img
                        src={project.icon}
                        alt={`${project.title} icon`}
                        className="w-12 h-12 rounded-lg object-cover"
                        loading="lazy"
                        width="48"
                        height="48"
                      />
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-xl dark:text-gray-100 transition-colors group-hover:!text-sky-500 dark:group-hover:!text-cyan-400">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
                        {project.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="flex flex-wrap gap-2 mb-4" style={{ flex: '1 0 auto' }}>
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs"
                        style={{
                          backgroundColor: themeColors.interactive.primary,
                          color: themeColors.text.accent,
                          borderColor: themeColors.primary,
                          border: '1px solid'
                        }}>
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3" style={{ marginTop: 'auto', paddingTop: '8px' }}>
                    <Link to={project.detailsUrl} className="project-btn flex items-center gap-1" style={{ textDecoration: 'none', color: 'white' }} aria-label={`View ${project.title} project details`}>
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      Details
                    </Link>
                    <a href={project.githubUrl} className="project-btn-outline flex items-center gap-1" style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} source code on GitHub`}>
                      <Code className="h-4 w-4" aria-hidden="true" />
                      Code
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Placeholder "Coming Soon" cards */}
            {placeholders.map((placeholder) => (
              <Card key={placeholder.id} className="group relative" style={{
                backgroundColor: themeColors.card.background,
                border: `1px dashed ${themeColors.card.border}`,
                opacity: 0.5
              }} aria-label="Coming soon project">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <img
                      src={comingSoon}
                      alt="Coming soon"
                      className="w-12 h-12 rounded-lg object-cover opacity-60"
                      loading="lazy"
                      width="48"
                      height="48"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-xl" style={{ color: isDarkMode ? themeColors.colors.white : themeColors.colors.dark[600] }}>
                        Coming Soon
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
                        More exciting projects on the way! Check back soon to see what I'm working on next.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="flex flex-wrap gap-2 mb-4" style={{ flex: '1 0 auto' }}>
                    <Badge variant="secondary" className="text-xs" style={{
                      backgroundColor: themeColors.interactive.primary,
                      color: themeColors.text.accent,
                      borderColor: themeColors.primary,
                      border: '1px solid',
                      opacity: 0.5
                    }}>
                      TBA
                    </Badge>
                  </div>
                  <div className="flex gap-3 opacity-30" style={{ marginTop: 'auto', paddingTop: '8px' }}>
                    <div className="project-btn flex items-center gap-1" style={{ pointerEvents: 'none' }}>
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      Details
                    </div>
                    <div className="project-btn-outline flex items-center gap-1" style={{ pointerEvents: 'none' }}>
                      <Code className="h-4 w-4" aria-hidden="true" />
                      Code
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Carousel navigation - subtle dots at bottom */}
          <div className="flex items-center justify-center gap-3 mt-4 relative z-10" style={{ minHeight: '32px' }}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="transition-all duration-200 hover:scale-110"
              style={{
                color: isDarkMode ? themeColors.colors.accent[300] : themeColors.colors.accent[400],
                opacity: currentPage === 0 ? 0.2 : 0.6,
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                background: 'none',
                border: 'none',
                padding: '4px',
                minWidth: '28px',
                minHeight: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Previous projects"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Page dots */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i !== currentPage) {
                      setDirection(i > currentPage ? 'right' : 'left');
                      setCurrentPage(i);
                    }
                  }}
                  className="transition-all duration-200"
                  style={{
                    width: currentPage === i ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: isDarkMode ? themeColors.colors.accent[300] : themeColors.colors.accent[400],
                    opacity: currentPage === i ? 1 : 0.3,
                    cursor: 'pointer',
                    border: 'none',
                    padding: 0
                  }}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="transition-all duration-200 hover:scale-110"
              style={{
                color: isDarkMode ? themeColors.colors.accent[300] : themeColors.colors.accent[400],
                opacity: currentPage === totalPages - 1 ? 0.2 : 0.6,
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                background: 'none',
                border: 'none',
                padding: '4px',
                minWidth: '28px',
                minHeight: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Next projects"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </TooltipProvider>

      {/* Gradient overlay for smooth transition to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '150px',
          background: isDarkMode
            ? `linear-gradient(180deg, transparent 0%, ${themeColors.background.gradientEnd} 100%)`
            : `linear-gradient(180deg, transparent 0%, ${themeColors.colors.accent[25]} 100%)`,
          zIndex: 1
        }}
      />
    </section>
  );
};

export default Projects;
