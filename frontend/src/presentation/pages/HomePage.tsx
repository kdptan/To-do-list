/**
 * Home Page - Presentation Layer
 * 
 * Main page for the To-Do List application with 3-column layout.
 */

import React, { useState, useCallback } from 'react';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '@/domain';
import { useTasks } from '../hooks';
import {
  TaskList,
  TaskForm,
  TaskFilter,
  TaskStats,
  ThemeSelector,
  CategorySidebar,
  MiniCalendar,
} from '../components';
import toast from 'react-hot-toast';

export const HomePage: React.FC = () => {
  const {
    tasks,
    statistics,
    isLoading,
    error,
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    refreshTasks,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setFilters(prev => ({ ...prev, category: categoryId || undefined }));
  }, [setFilters]);

  // Handle date selection from calendar
  const handleDateSelect = useCallback((date: string | null) => {
    setSelectedDate(date);
    // If a date is selected, we could filter tasks by that date
    // For now, we'll just show it visually and let users see which tasks are due
  }, []);

  const handleCreateClick = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: CreateTaskDTO | UpdateTaskDTO) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        toast.success('Task updated successfully!');
      } else {
        await createTask(data as CreateTaskDTO);
        toast.success('Task created successfully!');
      }
      setShowForm(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleTaskStatus(id);
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        toast.success('Task deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  // Filter tasks by selected date if any
  const filteredTasks = selectedDate
    ? tasks.filter(task => task.dueDate?.startsWith(selectedDate))
    : tasks;

  return (
    <div className="min-h-screen bg-theme-background">
      {/* Header */}
      <header className="bg-theme-surface shadow-sm border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-theme-text">📝 To-Do List</h1>
              <p className="text-sm text-theme-text-muted mt-1">
                Manage your tasks efficiently
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSelector />
              <button
                onClick={handleCreateClick}
                className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-lg font-medium bg-theme-primary-hover transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Categories */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-6">
              <CategorySidebar
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
                onCategoryChange={refreshTasks}
              />
            </div>
          </aside>

          {/* Center - Task List */}
          <div className="flex-1 min-w-0">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Statistics */}
            <TaskStats statistics={statistics} />

            {/* Filters */}
            <TaskFilter filters={filters} onFiltersChange={setFilters} />

            {/* Selected Date Indicator */}
            {selectedDate && (
              <div className="mb-4 p-3 bg-theme-surface rounded-lg border border-theme-border flex items-center justify-between">
                <span className="text-sm text-theme-text">
                  📅 Showing tasks due on:{' '}
                  <strong>
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </strong>
                </span>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-sm text-theme-primary hover:underline"
                >
                  Clear filter
                </button>
              </div>
            )}

            {/* Task List */}
            <TaskList
              tasks={filteredTasks}
              isLoading={isLoading}
              onToggle={handleToggle}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onTaskUpdate={refreshTasks}
            />
          </div>

          {/* Right Sidebar - Calendar */}
          <aside className="w-72 flex-shrink-0 hidden xl:block">
            <div className="sticky top-6 space-y-4">
              <MiniCalendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </div>
          </aside>
        </div>
      </main>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};
