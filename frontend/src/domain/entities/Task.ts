/**
 * Task Entity - Domain Layer
 * 
 * This represents the core business entity for a task.
 * It should be framework-agnostic and contain only business logic.
 */

import { Subtask } from './Subtask';
import { Category } from './Category';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;
  isOverdue: boolean;
  category?: number | null;
  categoryDetails?: Category | null;
  subtasks?: Subtask[];
  subtaskProgress?: {
    total: number;
    completed: number;
    percentage: number;
  };
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  category?: number | null;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  category?: number | null;
}

/**
 * Task Statistics
 */
export interface TaskStatistics {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}
