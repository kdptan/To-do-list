/**
 * useTasks Hook - Presentation Layer
 * 
 * Custom hook for managing tasks state and operations.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskStatistics, TaskFilters } from '@/domain';
import {
  GetTasksUseCase,
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  ToggleTaskStatusUseCase,
  GetTaskStatisticsUseCase,
} from '@/application';
import { TaskApiRepository } from '@/infrastructure';

// Create repository and use cases
const taskRepository = new TaskApiRepository();
const getTasksUseCase = new GetTasksUseCase(taskRepository);
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
const toggleTaskStatusUseCase = new ToggleTaskStatusUseCase(taskRepository);
const getTaskStatisticsUseCase = new GetTaskStatisticsUseCase(taskRepository);

interface UseTasksReturn {
  tasks: Task[];
  statistics: TaskStatistics | null;
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskDTO) => Promise<Task>;
  updateTask: (id: number, data: UpdateTaskDTO) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskStatus: (id: number) => Promise<Task>;
  refreshStatistics: () => Promise<void>;
  refreshTasks: () => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statistics, setStatistics] = useState<TaskStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await getTasksUseCase.execute(filters);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const refreshStatistics = useCallback(async () => {
    try {
      const stats = await getTaskStatisticsUseCase.execute();
      setStatistics(stats);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  }, []);

  const createTask = useCallback(async (data: CreateTaskDTO): Promise<Task> => {
    const newTask = await createTaskUseCase.execute(data);
    setTasks(prev => [newTask, ...prev]);
    await refreshStatistics();
    return newTask;
  }, [refreshStatistics]);

  const updateTask = useCallback(async (id: number, data: UpdateTaskDTO): Promise<Task> => {
    const updatedTask = await updateTaskUseCase.execute(id, data);
    setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    await refreshStatistics();
    return updatedTask;
  }, [refreshStatistics]);

  const deleteTask = useCallback(async (id: number): Promise<void> => {
    await deleteTaskUseCase.execute(id);
    setTasks(prev => prev.filter(t => t.id !== id));
    await refreshStatistics();
  }, [refreshStatistics]);

  const toggleTaskStatus = useCallback(async (id: number): Promise<Task> => {
    const updatedTask = await toggleTaskStatusUseCase.execute(id);
    setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    await refreshStatistics();
    return updatedTask;
  }, [refreshStatistics]);

  const refreshTasks = useCallback(async (): Promise<void> => {
    await fetchTasks();
    await refreshStatistics();
  }, [fetchTasks, refreshStatistics]);

  useEffect(() => {
    fetchTasks();
    refreshStatistics();
  }, [fetchTasks, refreshStatistics]);

  return {
    tasks,
    statistics,
    isLoading,
    error,
    filters,
    setFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    refreshStatistics,
    refreshTasks,
  };
}
