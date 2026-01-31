/**
 * Subtask API Implementation
 * Handles HTTP requests for subtasks.
 */
import { apiClient } from './apiClient';
import { Subtask, CreateSubtaskData, UpdateSubtaskData } from '../../domain/entities/Subtask';
import { ISubtaskRepository } from '../../domain/repositories/ISubtaskRepository';

class SubtaskApi implements ISubtaskRepository {
  private getBasePath(taskId: number) {
    return `/tasks/${taskId}/subtasks/`;
  }

  async create(taskId: number, data: CreateSubtaskData): Promise<Subtask> {
    const response = await apiClient.post<Subtask>(this.getBasePath(taskId), data);
    return response.data;
  }

  async update(taskId: number, subtaskId: number, data: UpdateSubtaskData): Promise<Subtask> {
    const response = await apiClient.patch<Subtask>(
      `${this.getBasePath(taskId)}${subtaskId}/`,
      data
    );
    return response.data;
  }

  async delete(taskId: number, subtaskId: number): Promise<void> {
    await apiClient.delete(`${this.getBasePath(taskId)}${subtaskId}/`);
  }

  async toggle(taskId: number, subtaskId: number): Promise<Subtask> {
    const response = await apiClient.post<Subtask>(
      `${this.getBasePath(taskId)}${subtaskId}/toggle/`
    );
    return response.data;
  }
}

export const subtaskApi = new SubtaskApi();
