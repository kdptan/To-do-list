/**
 * Theme Context - Presentation Layer
 * 
 * Provides theme state and toggle functionality across the app.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { ThemeName, Theme, themes, themeNames } from '@/domain/entities/Theme';

interface ThemeContextType {
  currentThemeName: ThemeName;
  currentTheme: Theme;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'todolist_theme';

function applyTheme(themeName: ThemeName) {
  const theme = themes[themeName];
  const root = document.documentElement;
  
  // Apply CSS variables
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-primary-hover', theme.colors.primaryHover);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-surface-hover', theme.colors.surfaceHover);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-text-muted', theme.colors.textMuted);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-success', theme.colors.success);
  root.style.setProperty('--color-warning', theme.colors.warning);
  root.style.setProperty('--color-error', theme.colors.error);
  
  // Add theme class to body for additional styling
  document.body.className = `theme-${themeName}`;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentThemeName, setCurrentThemeName] = useState<ThemeName>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return (stored as ThemeName) || 'light';
  });

  const currentTheme = useMemo(() => themes[currentThemeName], [currentThemeName]);

  useEffect(() => {
    applyTheme(currentThemeName);
    localStorage.setItem(THEME_STORAGE_KEY, currentThemeName);
  }, [currentThemeName]);

  const setTheme = (theme: ThemeName) => {
    setCurrentThemeName(theme);
  };

  const toggleTheme = () => {
    const currentIndex = themeNames.indexOf(currentThemeName);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    setCurrentThemeName(themeNames[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ currentThemeName, currentTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
