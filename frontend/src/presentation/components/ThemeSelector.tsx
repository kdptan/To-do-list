/**
 * ThemeSelector Component - Presentation Layer
 * 
 * Dropdown to select different color themes.
 */

import React, { useState, useRef, useEffect } from 'react';
import { themes, themeNames, ThemeName } from '@/domain/entities/Theme';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeSelector: React.FC = () => {
  const { currentThemeName, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeSelect = (themeName: ThemeName) => {
    setTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-theme-surface border border-theme-border hover:bg-theme-surface-hover transition-colors"
        aria-label="Select theme"
      >
        <span className="text-lg">{themes[currentThemeName].label.split(' ')[0]}</span>
        <svg
          className={`w-4 h-4 text-theme-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-theme-surface rounded-lg shadow-lg border border-theme-border overflow-hidden z-50 animate-fade-in">
          <div className="py-1">
            {themeNames.map((themeName) => {
              const theme = themes[themeName];
              const isSelected = themeName === currentThemeName;
              
              return (
                <button
                  key={themeName}
                  onClick={() => handleThemeSelect(themeName)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    isSelected
                      ? 'bg-theme-primary text-white'
                      : 'text-theme-text hover:bg-theme-surface-hover'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <span className="font-medium">{theme.label}</span>
                  {isSelected && (
                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
