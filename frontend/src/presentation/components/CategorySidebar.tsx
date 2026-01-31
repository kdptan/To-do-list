/**
 * CategorySidebar Component
 * Displays a list of categories for filtering tasks.
 */
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Category, CreateCategoryData, CATEGORY_ICONS, CATEGORY_COLORS } from '../../domain/entities/Category';
import { categoryApi } from '../../infrastructure/api/categoryApi';

interface CategorySidebarProps {
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  onCategoryChange?: () => void;
}

export function CategorySidebar({ 
  selectedCategory, 
  onSelectCategory,
  onCategoryChange 
}: CategorySidebarProps) {
  const { currentTheme } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState<CreateCategoryData>({
    name: '',
    icon: CATEGORY_ICONS[0],
    color: CATEGORY_COLORS[0],
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    try {
      await categoryApi.create(newCategory);
      setNewCategory({ name: '', icon: CATEGORY_ICONS[0], color: CATEGORY_COLORS[0] });
      setShowForm(false);
      loadCategories();
      onCategoryChange?.();
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleDeleteCategory = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this category? Tasks will be uncategorized.')) return;

    try {
      await categoryApi.delete(id);
      if (selectedCategory === id) {
        onSelectCategory(null);
      }
      loadCategories();
      onCategoryChange?.();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <div 
      className="h-full flex flex-col rounded-lg p-4"
      style={{ 
        backgroundColor: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border,
        borderWidth: '1px'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 
          className="text-lg font-semibold"
          style={{ color: currentTheme.colors.text }}
        >
          Categories
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-1 rounded-md hover:opacity-80 transition-opacity"
          style={{ 
            backgroundColor: currentTheme.colors.primary,
            color: '#fff'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* New Category Form */}
      {showForm && (
        <form onSubmit={handleCreateCategory} className="mb-4 space-y-3">
          <input
            type="text"
            placeholder="Category name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="w-full px-3 py-2 rounded-md text-sm"
            style={{ 
              backgroundColor: currentTheme.colors.background,
              color: currentTheme.colors.text,
              borderColor: currentTheme.colors.border,
              borderWidth: '1px'
            }}
            autoFocus
          />
          
          {/* Icon Selection */}
          <div>
            <label className="text-xs block mb-1" style={{ color: currentTheme.colors.textMuted }}>
              Icon
            </label>
            <div className="flex flex-wrap gap-1">
              {CATEGORY_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setNewCategory({ ...newCategory, icon })}
                  className="p-1.5 rounded-md text-lg transition-all"
                  style={{ 
                    backgroundColor: newCategory.icon === icon 
                      ? currentTheme.colors.primary 
                      : currentTheme.colors.background,
                    border: newCategory.icon === icon 
                      ? `2px solid ${currentTheme.colors.primary}` 
                      : '2px solid transparent'
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="text-xs block mb-1" style={{ color: currentTheme.colors.textMuted }}>
              Color
            </label>
            <div className="flex flex-wrap gap-1">
              {CATEGORY_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewCategory({ ...newCategory, color })}
                  className="w-6 h-6 rounded-full transition-all"
                  style={{ 
                    backgroundColor: color,
                    border: newCategory.color === color 
                      ? '3px solid white' 
                      : '3px solid transparent',
                    boxShadow: newCategory.color === color 
                      ? `0 0 0 2px ${color}` 
                      : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-1.5 rounded-md text-sm font-medium"
              style={{ 
                backgroundColor: currentTheme.colors.primary,
                color: '#fff'
              }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 rounded-md text-sm"
              style={{ 
                backgroundColor: currentTheme.colors.background,
                color: currentTheme.colors.text
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Category List */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {/* All Tasks Option */}
        <button
          onClick={() => onSelectCategory(null)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left"
          style={{ 
            backgroundColor: selectedCategory === null 
              ? currentTheme.colors.primary + '20' 
              : 'transparent',
            color: currentTheme.colors.text
          }}
        >
          <span className="text-lg">📋</span>
          <span className="flex-1 text-sm font-medium">All Tasks</span>
        </button>

        {isLoading ? (
          <div 
            className="text-center py-4 text-sm"
            style={{ color: currentTheme.colors.textMuted }}
          >
            Loading...
          </div>
        ) : categories.length === 0 ? (
          <div 
            className="text-center py-4 text-sm"
            style={{ color: currentTheme.colors.textMuted }}
          >
            No categories yet
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="group flex items-center"
            >
              <button
                onClick={() => onSelectCategory(category.id)}
                className="flex-1 flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left"
                style={{ 
                  backgroundColor: selectedCategory === category.id 
                    ? category.color + '20' 
                    : 'transparent',
                  color: currentTheme.colors.text,
                  borderLeft: selectedCategory === category.id 
                    ? `3px solid ${category.color}` 
                    : '3px solid transparent'
                }}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="flex-1 text-sm font-medium truncate">{category.name}</span>
                <span 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
              </button>
              <button
                onClick={(e) => handleDeleteCategory(category.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
                style={{ color: currentTheme.colors.textMuted }}
                title="Delete category"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
