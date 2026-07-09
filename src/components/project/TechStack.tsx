import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { withAlpha } from '../../hooks/useThemeColors';

interface TechStackProps {
  technologies: string[];
}

const TechStack: React.FC<TechStackProps> = ({ technologies }) => {
  const { isDarkMode } = useDarkMode();
  const themeColors = useThemeColors();

  return (
    <div className="flex flex-wrap gap-3">
      {technologies.map((tech) => (
        <span 
          key={tech} 
          className="px-4 py-2 rounded-full text-sm font-medium" 
          style={{ 
            backgroundColor: isDarkMode ? withAlpha(themeColors.colors.accent[300], 0.2) : themeColors.colors.accent[50], 
            color: isDarkMode ? themeColors.colors.accent[300] : themeColors.text.highlight
          }}
        >
          {tech}
        </span>
      ))}
    </div>
  );
};

export default TechStack;