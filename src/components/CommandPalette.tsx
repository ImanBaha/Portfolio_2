import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Hash, FileText, Mail, Github, Linkedin } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useThemeColors, withAlpha } from '../hooks/useThemeColors';
import { socialLinks } from '../config/socialLinks';

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  action: () => void;
}

/**
 * Cmd/Ctrl+K command palette for quick keyboard navigation.
 * Add entries to the commands array below (e.g. project detail pages).
 */
const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useDarkMode();
  const themeColors = useThemeColors();
  const navigate = useNavigate();
  const location = useLocation();

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    close();
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [close, location.pathname, navigate]);

  const commands: Command[] = useMemo(() => {
    const sectionCommands: Command[] = [
      { id: 'about', label: 'About', hint: 'Go to section', icon: <Hash size={16} />, action: () => scrollToSection('about') },
      { id: 'projects', label: 'Projects', hint: 'Go to section', icon: <Hash size={16} />, action: () => scrollToSection('projects') },
      { id: 'experience', label: 'Experience', hint: 'Go to section', icon: <Hash size={16} />, action: () => scrollToSection('experience') },
      { id: 'skills', label: 'Skills', hint: 'Go to section', icon: <Hash size={16} />, action: () => scrollToSection('skills') },
      { id: 'certifications', label: 'Certifications', hint: 'Go to section', icon: <Hash size={16} />, action: () => scrollToSection('certifications') },
      { id: 'contact', label: 'Contact', hint: 'Open page', icon: <Mail size={16} />, action: () => { close(); navigate('/contact'); } },
      { id: 'resume', label: 'Resume', hint: 'Open PDF', icon: <FileText size={16} />, action: () => { close(); window.open(`${import.meta.env.BASE_URL}Resume.pdf`, '_blank'); } },
    ];

    const externalCommands: Command[] = [];
    if (socialLinks.github) {
      externalCommands.push({ id: 'github', label: 'GitHub', hint: 'External link', icon: <Github size={16} />, action: () => { close(); window.open(socialLinks.github, '_blank'); } });
    }
    if (socialLinks.linkedin) {
      externalCommands.push({ id: 'linkedin', label: 'LinkedIn', hint: 'External link', icon: <Linkedin size={16} />, action: () => { close(); window.open(socialLinks.linkedin, '_blank'); } });
    }

    return [...sectionCommands, ...externalCommands];
  }, [close, navigate, scrollToSection]);

  // Simple fuzzy match: every query character must appear in order
  const fuzzyMatch = (text: string, search: string): boolean => {
    const target = text.toLowerCase();
    let index = 0;
    for (const char of search.toLowerCase()) {
      index = target.indexOf(char, index);
      if (index === -1) return false;
      index++;
    }
    return true;
  };

  const filteredCommands = useMemo(
    () => (query.trim() ? commands.filter((c) => fuzzyMatch(c.label, query.trim())) : commands),
    [commands, query]
  );

  // Global Cmd/Ctrl+K listener + custom event from the nav hint button
  useEffect(() => {
    const toggle = () => {
      setIsOpen((open) => !open);
      setQuery('');
      setSelectedIndex(0);
    };
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('open-command-palette', toggle);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('open-command-palette', toggle);
    };
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keep selection within the filtered list
  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) {
      setSelectedIndex(Math.max(0, filteredCommands.length - 1));
    }
  }, [filteredCommands.length, selectedIndex]);

  // Keep the selected row visible while arrowing through the list
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${selectedIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filteredCommands[selectedIndex]?.action();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-start justify-center pt-[15vh] px-4 animate-fadeIn"
      style={{ zIndex: 100000, backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-scaleIn"
        style={{
          backgroundColor: isDarkMode ? themeColors.colors.dark[900] : themeColors.colors.white,
          border: `1px solid ${withAlpha(themeColors.colors.accent[400], isDarkMode ? 0.3 : 0.4)}`,
          boxShadow: `0 16px 60px rgba(0, 0, 0, 0.5), 0 0 30px ${withAlpha(themeColors.colors.accent[400], 0.1)}`,
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: `1px solid ${isDarkMode ? themeColors.colors.dark[700] : themeColors.colors.dark[200]}` }}
        >
          <Search size={18} style={{ color: themeColors.colors.accent[400], flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Type a command or search..."
            className="w-full bg-transparent outline-none font-mono text-sm"
            style={{
              color: isDarkMode ? themeColors.colors.white : themeColors.colors.dark[800],
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
            }}
            aria-label="Search commands"
          />
          <kbd
            className="px-1.5 py-0.5 rounded text-xs font-mono"
            style={{
              color: isDarkMode ? themeColors.colors.dark[400] : themeColors.colors.dark[500],
              border: `1px solid ${isDarkMode ? themeColors.colors.dark[700] : themeColors.colors.dark[300]}`,
            }}
          >
            esc
          </kbd>
        </div>

        {/* Results list */}
        <div ref={listRef} className="max-h-72 overflow-y-auto py-2" role="listbox">
          {filteredCommands.length === 0 ? (
            <div
              className="px-4 py-6 text-center text-sm font-mono"
              style={{ color: isDarkMode ? themeColors.colors.dark[400] : themeColors.colors.dark[500] }}
            >
              No results found
            </div>
          ) : (
            filteredCommands.map((command, index) => (
              <button
                key={command.id}
                data-index={index}
                onClick={command.action}
                onMouseEnter={() => setSelectedIndex(index)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                style={{
                  backgroundColor: index === selectedIndex
                    ? withAlpha(themeColors.colors.accent[400], isDarkMode ? 0.15 : 0.1)
                    : 'transparent',
                  color: index === selectedIndex
                    ? (isDarkMode ? themeColors.colors.accent[300] : themeColors.colors.accent[700])
                    : (isDarkMode ? themeColors.colors.dark[200] : themeColors.colors.dark[700]),
                  border: 'none',
                  borderLeft: `2px solid ${index === selectedIndex ? themeColors.colors.accent[400] : 'transparent'}`,
                  cursor: 'pointer',
                  outline: 'none',
                }}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <span style={{ color: themeColors.colors.accent[400], flexShrink: 0, display: 'flex' }}>
                  {command.icon}
                </span>
                <span className="flex-1 text-sm font-medium">{command.label}</span>
                <span
                  className="text-xs font-mono"
                  style={{ color: isDarkMode ? themeColors.colors.dark[500] : themeColors.colors.dark[400] }}
                >
                  {command.hint}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div
          className="flex items-center gap-4 px-4 py-2 text-xs font-mono"
          style={{
            borderTop: `1px solid ${isDarkMode ? themeColors.colors.dark[700] : themeColors.colors.dark[200]}`,
            color: isDarkMode ? themeColors.colors.dark[500] : themeColors.colors.dark[400],
          }}
        >
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
