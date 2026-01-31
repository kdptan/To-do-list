/**
 * TaskFilter Component - Presentation Layer
 * 
 * Filter and search controls for tasks.
 */

import React from 'react';
import { TaskFilters } from '@/domain';

interface TaskFilterProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status || undefined,
    });
  };

  const handlePriorityChange = (priority: string) => {
    onFiltersChange({
      ...filters,
      priority: priority || undefined,
    });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({
      ...filters,
      search: search || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="bg-theme-surface rounded-lg shadow-sm border border-theme-border p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-theme-surface border border-theme-border rounded-lg focus:ring-2 focus:outline-none transition-colors text-theme-text placeholder-theme-text-muted"
              style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Status Filter */}
        <select
          value={filters.status || ''}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-4 py-2 bg-theme-surface border border-theme-border rounded-lg focus:ring-2 focus:outline-none transition-colors text-theme-text"
          style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority || ''}
          onChange={(e) => handlePriorityChange(e.target.value)}
          className="px-4 py-2 bg-theme-surface border border-theme-border rounded-lg focus:ring-2 focus:outline-none transition-colors text-theme-text"
          style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-hover rounded-lg transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
