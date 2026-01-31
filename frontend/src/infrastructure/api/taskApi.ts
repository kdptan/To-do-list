/**
 * Task API Repository - Infrastructure Layer
 * 
 * Implementation of ITaskRepository that communicates with the Django backend.
 */

import { 
  Task, 
  CreateTaskDTO, 
  UpdateTaskDTO, 
  TaskStatistics,
  ITaskRepository, 
  TaskFilters 
} from '@/domain';
import { apiClient } from './apiClient';

interface ApiSubtask {
  id: number;
  title: string;
  is_completed: boolean;
  order: number;
  created_at: string;
}

interface ApiCategory {
  id: number;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

interface ApiTask {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  is_completed: boolean;
  is_overdue: boolean;
  category: number | null;
  category_details: ApiCategory | null;
  subtasks: ApiSubtask[];
  subtask_progress: {
    total: number;
    completed: number;
    percentage: number;
  };
}

interface ApiStatistics {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
}

/**
 * Maps API response to domain Task entity
 */
function mapApiTaskToTask(apiTask: ApiTask): Task {
  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description,
    status: apiTask.status as Task['status'],
    priority: apiTask.priority as Task['priority'],
    dueDate: apiTask.due_date,
    completedAt: apiTask.completed_at,
    createdAt: apiTask.created_at,
    updatedAt: apiTask.updated_at,
    isCompleted: apiTask.is_completed,
    isOverdue: apiTask.is_overdue,
    category: apiTask.category,
    categoryDetails: apiTask.category_details,
    subtasks: apiTask.subtasks || [],
    subtaskProgress: apiTask.subtask_progress || { total: 0, completed: 0, percentage: 0 },
  };
}

/**
 * Maps domain CreateTaskDTO to API format
 */
function mapCreateDtoToApi(dto: CreateTaskDTO): Record<string, unknown> {
  return {
    title: dto.title,
    description: dto.description || '',
    priority: dto.priority || 'medium',
    due_date: dto.dueDate || null,
    category: dto.category || null,
  };
}

/**
 * Maps domain UpdateTaskDTO to API format
 */
function mapUpdateDtoToApi(dto: UpdateTaskDTO): Record<string, unknown> {
  const apiDto: Record<string, unknown> = {};
  
  if (dto.title !== undefined) apiDto.title = dto.title;
  if (dto.description !== undefined) apiDto.description = dto.description;
  if (dto.status !== undefined) apiDto.status = dto.status;
  if (dto.priority !== undefined) apiDto.priority = dto.priority;
  if (dto.dueDate !== undefined) apiDto.due_date = dto.dueDate;
  if (dto.category !== undefined) apiDto.category = dto.category;
  
  return apiDto;
}

export class TaskApiRepository implements ITaskRepository {
  async getAll(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', String(filters.category));
    
    const response = await apiClient.get<ApiTask[]>('/tasks/', { params });
    return response.data.map(mapApiTaskToTask);
  }

  async getById(id: number): Promise<Task | null> {
    try {
      const response = await apiClient.get<ApiTask>(`/tasks/${id}/`);
      return mapApiTaskToTask(response.data);
    } catch (error) {
      return null;
    }
  }

  async create(data: CreateTaskDTO): Promise<Task> {
    const response = await apiClient.post<ApiTask>('/tasks/', mapCreateDtoToApi(data));
    return mapApiTaskToTask(response.data);
  }

  async update(id: number, data: UpdateTaskDTO): Promise<Task> {
    const response = await apiClient.patch<ApiTask>(`/tasks/${id}/`, mapUpdateDtoToApi(data));
    return mapApiTaskToTask(response.data);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/tasks/${id}/`);
  }

  async toggleStatus(id: number): Promise<Task> {
    const response = await apiClient.post<ApiTask>(`/tasks/${id}/toggle/`);
    return mapApiTaskToTask(response.data);
  }

  async getStatistics(): Promise<TaskStatistics> {
    const response = await apiClient.get<ApiStatistics>('/tasks/statistics/');
    return {
      total: response.data.total,
      pending: response.data.pending,
      inProgress: response.data.in_progress,
      completed: response.data.completed,
    };
  }

  async getCalendarTasks(year: number, month: number): Promise<Record<string, Task[]>> {
    const response = await apiClient.get<Record<string, ApiTask[]>>(
      `/tasks/calendar/?year=${year}&month=${month}`
    );
    
    const result: Record<string, Task[]> = {};
    for (const [date, tasks] of Object.entries(response.data)) {
      result[date] = tasks.map(mapApiTaskToTask);
    }
    return result;
  }
}
