/**
 * Task Repository Interface - Domain Layer
 * 
 * This interface defines the contract for task data operations.
 * Implementations will be in the infrastructure layer.
 */

import { Task, CreateTaskDTO, UpdateTaskDTO, TaskStatistics } from '../entities/Task';

export interface ITaskRepository {
  /**
   * Get all tasks with optional filtering
   */
  getAll(filters?: TaskFilters): Promise<Task[]>;

  /**
   * Get a single task by ID
   */
  getById(id: number): Promise<Task | null>;

  /**
   * Create a new task
   */
  create(data: CreateTaskDTO): Promise<Task>;

  /**
   * Update an existing task
   */
  update(id: number, data: UpdateTaskDTO): Promise<Task>;

  /**
   * Delete a task
   */
  delete(id: number): Promise<void>;

  /**
   * Toggle task completion status
   */
  toggleStatus(id: number): Promise<Task>;

  /**
   * Get task statistics
   */
  getStatistics(): Promise<TaskStatistics>;
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  search?: string;
  category?: number;
}
