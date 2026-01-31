/**
 * Local Storage Repository - Infrastructure Layer
 * 
 * Implementation of ITaskRepository using browser localStorage.
 * Useful for offline support and as a fallback when API is unavailable.
 */

import { 
  Task, 
  CreateTaskDTO, 
  UpdateTaskDTO, 
  TaskStatistics,
  ITaskRepository, 
  TaskFilters 
} from '@/domain';

const STORAGE_KEY = 'todolist_tasks';

export class LocalStorageTaskRepository implements ITaskRepository {
  private getStoredTasks(): Task[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  private generateId(): number {
    const tasks = this.getStoredTasks();
    return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  }

  async getAll(filters?: TaskFilters): Promise<Task[]> {
    let tasks = this.getStoredTasks();

    if (filters?.status) {
      tasks = tasks.filter(t => t.status === filters.status);
    }
    if (filters?.priority) {
      tasks = tasks.filter(t => t.priority === filters.priority);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(search) || 
        t.description.toLowerCase().includes(search)
      );
    }

    return tasks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getById(id: number): Promise<Task | null> {
    const tasks = this.getStoredTasks();
    return tasks.find(t => t.id === id) || null;
  }

  async create(data: CreateTaskDTO): Promise<Task> {
    const tasks = this.getStoredTasks();
    const now = new Date().toISOString();
    
    const newTask: Task = {
      id: this.generateId(),
      title: data.title,
      description: data.description || '',
      status: 'pending',
      priority: data.priority || 'medium',
      dueDate: data.dueDate || null,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
      isCompleted: false,
      isOverdue: false,
    };

    tasks.unshift(newTask);
    this.saveTasks(tasks);
    
    return newTask;
  }

  async update(id: number, data: UpdateTaskDTO): Promise<Task> {
    const tasks = this.getStoredTasks();
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Task not found');
    }

    const updatedTask: Task = {
      ...tasks[index],
      ...data,
      updatedAt: new Date().toISOString(),
      isCompleted: (data.status || tasks[index].status) === 'completed',
    };

    if (data.status === 'completed' && tasks[index].status !== 'completed') {
      updatedTask.completedAt = new Date().toISOString();
    } else if (data.status && data.status !== 'completed') {
      updatedTask.completedAt = null;
    }

    tasks[index] = updatedTask;
    this.saveTasks(tasks);
    
    return updatedTask;
  }

  async delete(id: number): Promise<void> {
    const tasks = this.getStoredTasks();
    const filtered = tasks.filter(t => t.id !== id);
    this.saveTasks(filtered);
  }

  async toggleStatus(id: number): Promise<Task> {
    const tasks = this.getStoredTasks();
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
      throw new Error('Task not found');
    }

    const newStatus = task.isCompleted ? 'pending' : 'completed';
    return this.update(id, { status: newStatus });
  }

  async getStatistics(): Promise<TaskStatistics> {
    const tasks = this.getStoredTasks();
    
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    };
  }
}
