/**
 * Toggle Task Status Use Case - Application Layer
 * 
 * This use case handles toggling task completion.
 */

import { Task, ITaskRepository } from '@/domain';

export class ToggleTaskStatusUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: number): Promise<Task> {
    return this.taskRepository.toggleStatus(id);
  }
}
