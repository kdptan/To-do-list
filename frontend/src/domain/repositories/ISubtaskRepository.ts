/**
 * Subtask Repository Interface
 * Defines the contract for subtask data operations.
 */
import { Subtask, CreateSubtaskData, UpdateSubtaskData } from '../entities/Subtask';

export interface ISubtaskRepository {
  create(taskId: number, data: CreateSubtaskData): Promise<Subtask>;
  update(taskId: number, subtaskId: number, data: UpdateSubtaskData): Promise<Subtask>;
  delete(taskId: number, subtaskId: number): Promise<void>;
  toggle(taskId: number, subtaskId: number): Promise<Subtask>;
}
