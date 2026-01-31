/**
 * TaskList Component - Presentation Layer
 * 
 * Displays a list of tasks.
 */

import React from 'react';
import { Task } from '@/domain';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onTaskUpdate: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  onToggle,
  onEdit,
  onDelete,
  onTaskUpdate,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-theme-surface rounded-lg shadow-sm border border-theme-border p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-theme-surface-hover rounded-full" style={{ backgroundColor: 'var(--color-surface-hover)' }} />
              <div className="flex-1">
                <div className="h-5 bg-theme-surface-hover rounded w-1/3 mb-2" style={{ backgroundColor: 'var(--color-surface-hover)' }} />
                <div className="h-4 bg-theme-surface-hover rounded w-2/3" style={{ backgroundColor: 'var(--color-surface-hover)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-theme-text mb-2">No tasks yet</h3>
        <p className="text-theme-text-muted">
          Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onTaskUpdate={onTaskUpdate}
        />
      ))}
    </div>
  );
};
