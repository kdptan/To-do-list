/**
 * Theme Types - Domain Layer
 */

export type ThemeName = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset' | 'lavender';

export interface Theme {
  name: ThemeName;
  label: string;
  colors: {
    primary: string;
    primaryHover: string;
    background: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textMuted: string;
    border: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  light: {
    name: 'light',
    label: '☀️ Light',
    colors: {
      primary: '#0ea5e9',
      primaryHover: '#0284c7',
      background: '#f9fafb',
      surface: '#ffffff',
      surfaceHover: '#f3f4f6',
      text: '#111827',
      textMuted: '#6b7280',
      border: '#e5e7eb',
      accent: '#3b82f6',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
  dark: {
    name: 'dark',
    label: '🌙 Dark',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      background: '#0f172a',
      surface: '#1e293b',
      surfaceHover: '#334155',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
      border: '#334155',
      accent: '#60a5fa',
      success: '#4ade80',
      warning: '#fbbf24',
      error: '#f87171',
    },
  },
  ocean: {
    name: 'ocean',
    label: '🌊 Ocean',
    colors: {
      primary: '#0891b2',
      primaryHover: '#0e7490',
      background: '#ecfeff',
      surface: '#ffffff',
      surfaceHover: '#cffafe',
      text: '#164e63',
      textMuted: '#0e7490',
      border: '#99f6e4',
      accent: '#06b6d4',
      success: '#14b8a6',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
  forest: {
    name: 'forest',
    label: '🌲 Forest',
    colors: {
      primary: '#16a34a',
      primaryHover: '#15803d',
      background: '#f0fdf4',
      surface: '#ffffff',
      surfaceHover: '#dcfce7',
      text: '#14532d',
      textMuted: '#166534',
      border: '#bbf7d0',
      accent: '#10b981',
      success: '#22c55e',
      warning: '#eab308',
      error: '#dc2626',
    },
  },
  sunset: {
    name: 'sunset',
    label: '🌅 Sunset',
    colors: {
      primary: '#ea580c',
      primaryHover: '#c2410c',
      background: '#fff7ed',
      surface: '#ffffff',
      surfaceHover: '#ffedd5',
      text: '#7c2d12',
      textMuted: '#9a3412',
      border: '#fed7aa',
      accent: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#dc2626',
    },
  },
  lavender: {
    name: 'lavender',
    label: '💜 Lavender',
    colors: {
      primary: '#9333ea',
      primaryHover: '#7e22ce',
      background: '#faf5ff',
      surface: '#ffffff',
      surfaceHover: '#f3e8ff',
      text: '#581c87',
      textMuted: '#7c3aed',
      border: '#e9d5ff',
      accent: '#8b5cf6',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
};

export const themeNames: ThemeName[] = ['light', 'dark', 'ocean', 'forest', 'sunset', 'lavender'];
