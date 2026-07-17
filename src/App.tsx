import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext'
import { useThemeColors } from './hooks/useThemeColors'
import { colors } from './styles/colors'
import Navigation from './components/section/Navigation'
import CommandPalette from './components/CommandPalette'
import About from './components/section/About'
import './App.css'

// Lazy load project pages - add your project page imports here
// Example: const MyProject = lazy(() => import('./pages/projects/MyProject'))
const Contact = lazy(() => import('./pages/Contact'))
const ProjectOne = lazy(() => import('./pages/projects/ProjectOne'))
const ProjectTwo = lazy(() => import('./pages/projects/ProjectTwo'))
const ProjectThree = lazy(() => import('./pages/projects/ProjectThree'))
const ProjectFour = lazy(() => import('./pages/projects/ProjectFour'))

// Lazy load below-the-fold components for better initial load
const Projects = lazy(() => import('./components/section/Projects'))
const Experience = lazy(() => import('./components/section/Experience'))
const Skills = lazy(() => import('./components/section/Skills'))
const Certifications = lazy(() => import('./components/section/Certifications'))
const Footer = lazy(() => import('./components/Footer'))

function HomePage() {
  const { isDarkMode } = useDarkMode();
  const themeColors = useThemeColors();

  return (
    <>
      <About />
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
        <Projects />
      </Suspense>
      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
        <Experience />
      </Suspense>
      {/* Divider with gradient transitions */}
      <div className="w-full py-8 relative" style={{
        background: isDarkMode ? themeColors.background.gradientEnd : colors.white,
        transition: 'background 0.3s ease-in-out'
      }}>
        {/* Top gradient overlay to blend with Experience section */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '60px',
            background: isDarkMode
              ? `linear-gradient(180deg, ${themeColors.background.gradientEnd} 0%, transparent 100%)`
              : `linear-gradient(180deg, ${colors.white} 0%, transparent 100%)`,
            zIndex: 1
          }}
        />
        {/* Bottom gradient overlay to blend with Skills section */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '200px',
            background: isDarkMode 
              ? `linear-gradient(180deg, transparent 0%, ${themeColors.background.gradientEnd} 100%)`
              : `linear-gradient(180deg, transparent 0%, ${themeColors.colors.accent[25]} 100%)`,
            zIndex: 1
          }}
        />
        {/* Code-styled divider: gradient lines with a centered glyph */}
        <div
          className="relative flex items-center justify-center gap-5 max-w-4xl mx-auto px-8 py-6"
          style={{ zIndex: 2 }}
          role="separator"
          aria-hidden="true"
        >
          <div
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${isDarkMode ? 'rgba(34, 211, 238, 0.5)' : 'rgba(14, 165, 233, 0.45)'})`
            }}
          />
          <span
            className="font-mono text-sm select-none"
            style={{
              color: isDarkMode ? themeColors.colors.accent[300] : themeColors.colors.accent[500],
              textShadow: isDarkMode ? '0 0 12px rgba(34, 211, 238, 0.5)' : 'none',
              letterSpacing: '0.1em'
            }}
          >
            {'</>'}
          </span>
          <div
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(90deg, ${isDarkMode ? 'rgba(34, 211, 238, 0.5)' : 'rgba(14, 165, 233, 0.45)'}, transparent)`
            }}
          />
        </div>
      </div>
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
        <Skills />
      </Suspense>
      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
        <Certifications />
      </Suspense>
    </>
  )
}

function AppContent() {
  const { isDarkMode } = useDarkMode();

  return (
    <>
      <Navigation />
      <CommandPalette />
      <div className="app transition-colors duration-300" style={{ backgroundColor: isDarkMode ? '#101727' : undefined }}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <main id="main-content" className="main-content">
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<Contact />} />
              {/* Add your project routes here */}
              <Route path="/projects/project-one" element={<ProjectOne />} />
              <Route path="/projects/project-two" element={<ProjectTwo />} />
              <Route path="/projects/project-three" element={<ProjectThree />} />
              <Route path="/projects/project-four" element={<ProjectFour />} />
              {/* Example: <Route path="/projects/my-project" element={<MyProject />} /> */}
            </Routes>
          </Suspense>
        </main>
        <Suspense fallback={<div className="h-32 flex items-center justify-center">Loading...</div>}>
          <Footer />
        </Suspense>
      </div>
    </>
  )
}

function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  )
}

export default App