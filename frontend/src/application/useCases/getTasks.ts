/**
 * Get Tasks Use Case - Application Layer
 * 
 * This use case handles fetching tasks from the repository.
 */

import { Task, ITaskRepository, TaskFilters } from '@/domain';

export class GetTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(filters?: TaskFilters): Promise<Task[]> {
    return this.taskRepository.getAll(filters);
  }
}
