/**
 * Centralized Color Palette for Portfolio
 *
 * This file contains all colors used throughout the application
 * organized by semantic meaning and theme variants.
 */

export const colors = {
  // Base colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Primary Accent Palette (electric blue / cyan)
  accent: {
    25: '#F7FCFE',        // Very light cyan transition color
    50: '#F0F9FF',        // Light cyan background
    100: '#E0F2FE',       // Ice blue
    200: '#BAE6FD',       // Pale sky
    300: '#67E8F9',       // Main bright cyan
    400: '#22D3EE',       // Vivid cyan
    500: '#0EA5E9',       // Electric blue
    600: '#0284C7',       // Strong blue
    700: '#0369A1',       // Navigation text
    800: '#075985',       // Main text blue (WCAG AA)
    900: '#0C4A6E',       // Darkest blue
  },

  // Dark theme colors
  dark: {
    50: '#F8FAFC',        // Almost white
    100: '#F1F5F9',       // Very light gray
    200: '#E2E8F0',       // Light gray
    300: '#CBD5E1',       // Medium light gray
    400: '#94A3B8',       // Medium gray
    500: '#64748B',       // Neutral gray
    600: '#475569',       // Medium dark gray
    700: '#334155',       // Dark gray
    800: '#1E293B',       // Very dark gray
    900: '#0F172A',       // Almost black
    950: '#020617',       // Darkest
  },

  // Semantic colors
  background: {
    light: {
      primary: '#FFFFFF',
      secondary: '#F0F9FF',
      gradient: 'linear-gradient(180deg, rgb(248 252 254) 0%, rgb(240 249 255) 50%, rgb(235 246 254) 100%)',
      gradientEnd: 'rgb(235 246 254)', // End color of the main gradient for seamless transitions
      overlay: 'rgba(255, 255, 255, 0.5)',
      // Section-specific gradients - mostly white with very light blue brush at edges
      sections: {
        about: 'linear-gradient(180deg, rgb(255 255 255) 0%, rgb(250 253 254) 30%, #F7FCFE 100%)',
        skills: 'linear-gradient(180deg, rgb(247 252 254) 0%, rgb(252 254 255) 30%, rgb(252 254 255) 70%, rgb(255 255 255) 100%)',
        projects: 'linear-gradient(180deg, rgb(247 252 254) 0%, rgb(255 255 255) 15%, rgb(255 255 255) 85%, rgb(247 252 254) 100%)',
        experience: 'linear-gradient(180deg, rgb(247 252 254) 0%, rgb(252 254 255) 25%, rgb(252 254 255) 75%, rgb(247 252 254) 100%)',
        certifications: 'linear-gradient(180deg, rgb(255 255 255) 0%, rgb(255 255 255) 60%, rgb(252 254 255) 100%)',
      },
    },
    dark: {
      primary: '#0F172A',
      secondary: '#1E293B',
      gradient: '#0B1120',
      gradientEnd: '#0B1120', // Consistent dark background for seamless transitions
      overlay: 'rgba(0, 0, 0, 0.7)',
      // Dark mode sections maintain consistent dark background
      sections: {
        about: '#0B1120',
        skills: '#0B1120',
        projects: '#0B1120',
        experience: '#0B1120',
        certifications: '#0B1120',
      },
    },
  },

  // Text colors
  text: {
    light: {
      primary: '#1F2937',     // rgb(31, 41, 55)
      secondary: '#4B5563',   // rgb(75, 85, 99)
      tertiary: '#6B7280',    // rgb(107, 114, 128)
      accent: '#075985',      // Blue text
      highlight: '#0369A1',   // Strong blue highlight
    },
    dark: {
      primary: '#FFFFFF',
      secondary: '#BAE6FD',
      tertiary: '#67E8F9',
      accent: '#22D3EE',
      highlight: '#67E8F9',
    },
  },

  // Interactive elements
  interactive: {
    light: {
      primary: 'rgba(14, 165, 233, 0.1)',
      hover: 'rgba(14, 165, 233, 0.2)',
      active: '#0EA5E9',
      focus: 'rgba(14, 165, 233, 0.3)',
    },
    dark: {
      primary: 'rgba(34, 211, 238, 0.1)',
      hover: 'rgba(34, 211, 238, 0.2)',
      active: '#22D3EE',
      focus: 'rgba(34, 211, 238, 0.3)',
    },
  },

  // Navigation specific
  navigation: {
    light: {
      background: 'rgba(240, 249, 255, 0.4)',
      backgroundScrolled: 'rgba(240, 249, 255, 0.6)',
      border: 'rgba(14, 165, 233, 0.15)',
      borderScrolled: 'rgba(14, 165, 233, 0.2)',
      shadow: 'rgba(14, 165, 233, 0.08)',
      shadowScrolled: 'rgba(14, 165, 233, 0.12)',
      mobile: 'rgba(247, 252, 254, 0.95)',
    },
    dark: {
      background: 'rgba(11, 17, 32, 0.4)',
      backgroundScrolled: 'rgba(11, 17, 32, 0.6)',
      border: 'rgba(34, 211, 238, 0.1)',
      borderScrolled: 'rgba(34, 211, 238, 0.15)',
      shadow: 'rgba(0, 0, 0, 0.2)',
      shadowScrolled: 'rgba(0, 0, 0, 0.3)',
      mobile: 'rgba(11, 17, 32, 0.95)',
    },
  },

  // Button variants
  button: {
    primary: {
      light: {
        background: '#0EA5E9',
        text: '#FFFFFF',
        hover: '#0284C7',
        shadow: 'rgba(14, 165, 233, 0.3)',
      },
      dark: {
        background: '#22D3EE',
        text: '#0B1120',
        hover: '#67E8F9',
        shadow: 'rgba(34, 211, 238, 0.4)',
      },
    },
    secondary: {
      light: {
        background: 'rgba(255, 255, 255, 0.8)',
        text: '#1F2937',
        border: '#0EA5E9',
        hover: '#E0F2FE',
      },
      dark: {
        background: 'rgba(31, 41, 55, 0.9)',
        text: '#FFFFFF',
        border: '#374151',
        hover: 'rgba(34, 211, 238, 0.1)',
      },
    },
    outline: {
      light: {
        background: 'transparent',
        text: '#0284C7',
        border: '#0EA5E9',
        hover: '#E0F2FE',
      },
      dark: {
        background: '#1F2937',
        text: '#67E8F9',
        border: '#22D3EE',
        hover: 'rgba(34, 211, 238, 0.1)',
      },
    },
  },

  // Card colors
  card: {
    light: {
      background: '#FFFFFF',
      border: 'rgba(14, 165, 233, 0.3)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    dark: {
      background: '#1F2937',
      border: 'rgba(55, 65, 81, 0.3)',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },
  },

  // Special effects
  effects: {
    glow: 'rgba(34, 211, 238, 0.3)',
    dropShadow: 'rgba(14, 165, 233, 0.3)',
    textShadow: 'rgba(0, 0, 0, 0.1)',
    blur: 'rgba(255, 255, 255, 0.1)',
  },

  // Utility colors
  utility: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    neutral: '#6B7280',
  },

  // Special colors
  special: {
    aurora: {
      dark: '#22D3EE',       // Cyan aurora for dark mode
      light: {
        1: '#BAE6FD',        // Light blue aurora stop 1
        2: '#A5F3FC',        // Light cyan aurora stop 2
        3: '#C7D2FE',        // Light indigo aurora stop 3
      }
    }
  },
} as const;

// Type definitions for better TypeScript support
type ColorTheme = 'light' | 'dark';
type ColorVariant = keyof typeof colors;

export type { ColorTheme, ColorVariant };

// Helper function to get theme-specific colors
export const getThemeColors = (theme: ColorTheme) => ({
  background: colors.background[theme],
  text: colors.text[theme],
  interactive: colors.interactive[theme],
  navigation: colors.navigation[theme],
  button: {
    primary: colors.button.primary[theme],
    secondary: colors.button.secondary[theme],
    outline: colors.button.outline[theme],
  },
  card: colors.card[theme],
});
