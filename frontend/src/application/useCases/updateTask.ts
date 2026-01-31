/**
 * Update Task Use Case - Application Layer
 * 
 * This use case handles updating an existing task.
 */

import { Task, UpdateTaskDTO, ITaskRepository } from '@/domain';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: number, data: UpdateTaskDTO): Promise<Task> {
    // Validation
    if (data.title !== undefined && data.title.trim() === '') {
      throw new Error('Task title cannot be empty');
    }

    const updateData: UpdateTaskDTO = { ...data };
    if (data.title) {
      updateData.title = data.title.trim();
    }
    if (data.description !== undefined) {
      updateData.description = data.description.trim();
    }

    return this.taskRepository.update(id, updateData);
  }
}
