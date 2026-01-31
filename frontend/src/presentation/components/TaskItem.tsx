/**
 * TaskItem Component - Presentation Layer
 * 
 * Displays a single task with actions and subtasks.
 */

import React, { useState } from 'react';
import { Task } from '@/domain';
import { useTheme } from '../contexts/ThemeContext';
import { SubtaskList } from './SubtaskList';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onTaskUpdate: () => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  onTaskUpdate,
}) => {
  const { currentTheme } = useTheme();
  const [showSubtasks, setShowSubtasks] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const subtaskProgress = task.subtaskProgress;

  return (
    <div
      className={`bg-theme-surface rounded-lg shadow-sm border border-theme-border p-4 transition-all duration-200 hover:shadow-md animate-fade-in ${
        task.isCompleted ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.isCompleted
              ? 'bg-theme-primary border-theme-primary text-white'
              : 'border-theme-border hover:border-theme-primary'
          }`}
          style={task.isCompleted ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)' } : {}}
        >
          {task.isCompleted && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-medium text-theme-text ${
                task.isCompleted ? 'line-through text-theme-text-muted' : ''
              }`}
            >
              {task.title}
            </h3>
            
            {/* Category Badge */}
            {task.categoryDetails && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                style={{ 
                  backgroundColor: task.categoryDetails.color + '20',
                  color: task.categoryDetails.color
                }}
              >
                <span>{task.categoryDetails.icon}</span>
                {task.categoryDetails.name}
              </span>
            )}
            
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                statusColors[task.status]
              }`}
            >
              {task.status.replace('_', ' ')}
            </span>
          </div>

          {task.description && (
            <p className="mt-1 text-sm text-theme-text-muted line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="mt-2 flex items-center gap-4 text-xs text-theme-text-muted flex-wrap">
            {task.dueDate && (
              <span className={task.isOverdue ? 'text-red-500 font-medium' : ''}>
                📅 Due: {formatDate(task.dueDate)}
                {task.isOverdue && ' (Overdue)'}
              </span>
            )}
            <span>Created: {formatDate(task.createdAt)}</span>
            
            {/* Subtask Progress Indicator */}
            {hasSubtasks && subtaskProgress && (
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{ color: currentTheme.colors.primary }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span>{subtaskProgress.completed}/{subtaskProgress.total} subtasks</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-3.5 w-3.5 transition-transform ${showSubtasks ? 'rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            
            {/* Show subtasks toggle when no subtasks exist */}
            {!hasSubtasks && (
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{ color: currentTheme.colors.textMuted }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Add subtasks</span>
              </button>
            )}
          </div>
          
          {/* Subtasks Section */}
          {showSubtasks && (
            <SubtaskList 
              taskId={task.id}
              subtasks={task.subtasks || []}
              onSubtasksChange={onTaskUpdate}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-theme-text-muted hover:text-theme-primary hover:bg-theme-surface-hover rounded-lg transition-colors"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-theme-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
