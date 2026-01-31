/**
 * Create Task Use Case - Application Layer
 * 
 * This use case handles creating a new task.
 */

import { Task, CreateTaskDTO, ITaskRepository } from '@/domain';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(data: CreateTaskDTO): Promise<Task> {
    // Validation
    if (!data.title || data.title.trim() === '') {
      throw new Error('Task title is required');
    }

    return this.taskRepository.create({
      ...data,
      title: data.title.trim(),
      description: data.description?.trim() || '',
    });
  }
}
