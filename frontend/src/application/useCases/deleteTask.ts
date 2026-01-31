/**
 * Delete Task Use Case - Application Layer
 * 
 * This use case handles deleting a task.
 */

import { ITaskRepository } from '@/domain';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
