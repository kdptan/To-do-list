/**
 * MiniCalendar Component
 * Displays a compact calendar view with task indicators.
 */
import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Task } from '../../domain/entities/Task';
import { TaskApiRepository } from '../../infrastructure/api/taskApi';

interface MiniCalendarProps {
  onDateSelect?: (date: string | null) => void;
  selectedDate?: string | null;
}

const taskRepo = new TaskApiRepository();

export function MiniCalendar({ onDateSelect, selectedDate }: MiniCalendarProps) {
  const { currentTheme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState<Record<string, Task[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    loadCalendarTasks();
  }, [currentMonth]);

  const loadCalendarTasks = async () => {
    try {
      setIsLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const data = await taskRepo.getCalendarTasks(year, month);
      setTasksByDate(data);
    } catch (error) {
      console.error('Failed to load calendar tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    onDateSelect?.(null);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Toggle selection
    if (selectedDate === dateStr) {
      onDateSelect?.(null);
    } else {
      onDateSelect?.(dateStr);
    }
  };

  const getDateStr = (day: number): string => {
    return `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getDayIndicator = (day: number) => {
    const dateStr = getDateStr(day);
    const tasks = tasksByDate[dateStr] || [];
    
    if (tasks.length === 0) return null;

    const completed = tasks.filter(t => t.isCompleted).length;
    const pending = tasks.length - completed;

    return { completed, pending, total: tasks.length };
  };

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div 
      className="rounded-lg p-4"
      style={{ 
        backgroundColor: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border,
        borderWidth: '1px'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 
          className="text-lg font-semibold"
          style={{ color: currentTheme.colors.text }}
        >
          Calendar
        </h2>
        <button
          onClick={goToToday}
          className="text-xs px-2 py-1 rounded-md"
          style={{ 
            backgroundColor: currentTheme.colors.primary + '20',
            color: currentTheme.colors.primary
          }}
        >
          Today
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1 rounded-md hover:opacity-80 transition-opacity"
          style={{ color: currentTheme.colors.text }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <span 
          className="text-sm font-medium"
          style={{ color: currentTheme.colors.text }}
        >
          {monthYear}
        </span>
        <button
          onClick={nextMonth}
          className="p-1 rounded-md hover:opacity-80 transition-opacity"
          style={{ color: currentTheme.colors.text }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium py-1"
            style={{ color: currentTheme.colors.textMuted }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before first of month */}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = getDateStr(day);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const indicator = getDayIndicator(day);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className="aspect-square flex flex-col items-center justify-center rounded-md text-xs relative transition-all hover:opacity-80"
              style={{ 
                backgroundColor: isSelected 
                  ? currentTheme.colors.primary 
                  : isToday 
                    ? currentTheme.colors.primary + '30'
                    : 'transparent',
                color: isSelected 
                  ? '#fff' 
                  : currentTheme.colors.text,
                border: isToday && !isSelected
                  ? `1px solid ${currentTheme.colors.primary}`
                  : '1px solid transparent'
              }}
            >
              <span className={isToday ? 'font-bold' : ''}>{day}</span>
              
              {/* Task Indicators */}
              {indicator && (
                <div className="flex gap-0.5 mt-0.5">
                  {indicator.pending > 0 && (
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: currentTheme.colors.warning }}
                      title={`${indicator.pending} pending`}
                    />
                  )}
                  {indicator.completed > 0 && (
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: currentTheme.colors.success }}
                      title={`${indicator.completed} completed`}
                    />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div 
        className="flex items-center justify-center gap-4 mt-4 pt-3"
        style={{ borderTop: `1px solid ${currentTheme.colors.border}` }}
      >
        <div className="flex items-center gap-1">
          <span 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: currentTheme.colors.warning }}
          />
          <span 
            className="text-xs"
            style={{ color: currentTheme.colors.textMuted }}
          >
            Pending
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: currentTheme.colors.success }}
          />
          <span 
            className="text-xs"
            style={{ color: currentTheme.colors.textMuted }}
          >
            Done
          </span>
        </div>
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div 
          className="mt-3 p-2 rounded-md text-center"
          style={{ backgroundColor: currentTheme.colors.background }}
        >
          <span 
            className="text-xs"
            style={{ color: currentTheme.colors.textMuted }}
          >
            Showing tasks for:{' '}
          </span>
          <span 
            className="text-xs font-medium"
            style={{ color: currentTheme.colors.text }}
          >
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      )}

      {isLoading && (
        <div 
          className="text-center text-xs mt-2"
          style={{ color: currentTheme.colors.textMuted }}
        >
          Loading...
        </div>
      )}
    </div>
  );
}
