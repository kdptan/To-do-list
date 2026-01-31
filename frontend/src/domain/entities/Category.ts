/**
 * Category entity for organizing tasks.
 */
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface CreateCategoryData {
  name: string;
  icon?: string;
  color?: string;
}

export interface UpdateCategoryData {
  name?: string;
  icon?: string;
  color?: string;
}

// Default category icons (emoji-based for simplicity)
export const CATEGORY_ICONS = [
  '📁', '💼', '🏠', '💪', '📚', '💡', '🎯', '⭐', 
  '🔥', '💻', '🎨', '🎵', '🛒', '✈️', '🏃', '🌱'
];

// Default category colors
export const CATEGORY_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Green
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
];
