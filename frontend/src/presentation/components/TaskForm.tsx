/**
 * TaskForm Component - Presentation Layer
 * 
 * Form for creating and editing tasks.
 */

import React, { useState, useEffect } from 'react';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskPriority } from '@/domain';
import { Category } from '../../domain/entities/Category';
import { categoryApi } from '../../infrastructure/api/categoryApi';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: CreateTaskDTO | UpdateTaskDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
      setCategoryId(task.category || null);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setCategoryId(null);
    }
  }, [task]);

  const loadCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const data: CreateTaskDTO | UpdateTaskDTO = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      category: categoryId,
    };

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-theme-surface rounded-xl shadow-xl w-full max-w-md animate-slide-up border border-theme-border">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-theme-text mb-4">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-lg focus:ring-2 focus:outline-none transition-colors text-theme-text placeholder-theme-text-muted"
                style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
                placeholder="What needs to be done?"
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-lg focus:ring-2 focus:outline-none transition-colors resize-none text-theme-text placeholder-theme-text-muted"
                style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
                placeholder="Add some details..."
                rows={3}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Category
              </label>
              <select
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-lg focus:ring-2 focus:outline-none transition-colors text-theme-text"
                style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Priority
                Priority
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium capitalize transition-colors ${
                      priority === p
                        ? p === 'low'
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : p === 'medium'
                          ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                          : 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-theme-surface border-theme-border text-theme-text hover:bg-theme-surface-hover'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-lg focus:ring-2 focus:outline-none transition-colors text-theme-text"
                style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2 px-4 border border-theme-border text-theme-text rounded-lg font-medium hover:bg-theme-surface-hover transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-theme-primary text-white rounded-lg font-medium bg-theme-primary-hover transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-primary)' }}
                disabled={isLoading || !title.trim()}
              >
                {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
