/**
 * Get Task Statistics Use Case - Application Layer
 * 
 * This use case handles fetching task statistics.
 */

import { TaskStatistics, ITaskRepository } from '@/domain';

export class GetTaskStatisticsUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(): Promise<TaskStatistics> {
    return this.taskRepository.getStatistics();
  }
}
