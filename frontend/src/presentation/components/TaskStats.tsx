/**
 * TaskStats Component - Presentation Layer
 * 
 * Displays task statistics.
 */

import React from 'react';
import { TaskStatistics } from '@/domain';

interface TaskStatsProps {
  statistics: TaskStatistics | null;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ statistics }) => {
  if (!statistics) return null;

  const stats = [
    { label: 'Total', value: statistics.total, color: 'bg-gray-100 text-gray-800' },
    { label: 'Pending', value: statistics.pending, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'In Progress', value: statistics.inProgress, color: 'bg-blue-100 text-blue-800' },
    { label: 'Completed', value: statistics.completed, color: 'bg-green-100 text-green-800' },
  ];

  const completionRate = statistics.total > 0 
    ? Math.round((statistics.completed / statistics.total) * 100) 
    : 0;

  return (
    <div className="bg-theme-surface rounded-lg shadow-sm border border-theme-border p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`px-4 py-2 rounded-lg ${stat.color}`}
          >
            <span className="text-2xl font-bold">{stat.value}</span>
            <span className="ml-2 text-sm">{stat.label}</span>
          </div>
        ))}
        
        <div className="flex-1 min-w-[200px]">
          <div className="flex justify-between text-sm text-theme-text-muted mb-1">
            <span>Completion Rate</span>
            <span>{completionRate}%</span>
          </div>
          <div className="h-2 bg-theme-surface-hover rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-hover)' }}>
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${completionRate}%`, backgroundColor: 'var(--color-primary)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
