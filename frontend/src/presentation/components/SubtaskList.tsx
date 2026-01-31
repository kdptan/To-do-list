/**
 * SubtaskList Component
 * Displays and manages subtasks for a task.
 */
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Subtask } from '../../domain/entities/Subtask';
import { subtaskApi } from '../../infrastructure/api/subtaskApi';

interface SubtaskListProps {
  taskId: number;
  subtasks: Subtask[];
  onSubtasksChange: () => void;
}

export function SubtaskList({ taskId, subtasks, onSubtasksChange }: SubtaskListProps) {
  const { currentTheme } = useTheme();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    try {
      await subtaskApi.create(taskId, { 
        title: newSubtaskTitle.trim(),
        order: subtasks.length 
      });
      setNewSubtaskTitle('');
      setIsAdding(false);
      onSubtasksChange();
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  };

  const handleToggleSubtask = async (subtaskId: number) => {
    try {
      await subtaskApi.toggle(taskId, subtaskId);
      onSubtasksChange();
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
    }
  };

  const handleDeleteSubtask = async (subtaskId: number) => {
    try {
      await subtaskApi.delete(taskId, subtaskId);
      onSubtasksChange();
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  };

  const handleStartEdit = (subtask: Subtask) => {
    setEditingId(subtask.id);
    setEditTitle(subtask.title);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editTitle.trim()) {
      setEditingId(null);
      return;
    }

    try {
      await subtaskApi.update(taskId, editingId, { title: editTitle.trim() });
      setEditingId(null);
      onSubtasksChange();
    } catch (error) {
      console.error('Failed to update subtask:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const completedCount = subtasks.filter(s => s.is_completed).length;
  const progress = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

  return (
    <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${currentTheme.colors.border}` }}>
      {/* Header with Progress */}
      <div className="flex items-center justify-between mb-2">
        <span 
          className="text-xs font-medium"
          style={{ color: currentTheme.colors.textMuted }}
        >
          Subtasks ({completedCount}/{subtasks.length})
        </span>
        {subtasks.length > 0 && (
          <div 
            className="flex-1 mx-3 h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: currentTheme.colors.border }}
          >
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${progress}%`,
                backgroundColor: currentTheme.colors.success
              }}
            />
          </div>
        )}
      </div>

      {/* Subtask List */}
      <div className="space-y-1">
        {subtasks
          .sort((a, b) => a.order - b.order)
          .map((subtask) => (
            <div
              key={subtask.id}
              className="group flex items-center gap-2 py-1 px-2 rounded-md hover:opacity-90"
              style={{ backgroundColor: currentTheme.colors.background }}
            >
              <button
                onClick={() => handleToggleSubtask(subtask.id)}
                className="flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-colors"
                style={{ 
                  borderColor: subtask.is_completed 
                    ? currentTheme.colors.success 
                    : currentTheme.colors.border,
                  backgroundColor: subtask.is_completed 
                    ? currentTheme.colors.success 
                    : 'transparent'
                }}
              >
                {subtask.is_completed && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {editingId === subtask.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: currentTheme.colors.text }}
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-1 text-sm cursor-pointer ${subtask.is_completed ? 'line-through' : ''}`}
                  style={{ color: subtask.is_completed ? currentTheme.colors.textMuted : currentTheme.colors.text }}
                  onClick={() => handleStartEdit(subtask)}
                >
                  {subtask.title}
                </span>
              )}

              <button
                onClick={() => handleDeleteSubtask(subtask.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-opacity"
                style={{ color: currentTheme.colors.textMuted }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
      </div>

      {/* Add Subtask Form */}
      {isAdding ? (
        <form onSubmit={handleAddSubtask} className="mt-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Add subtask..."
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            className="flex-1 px-2 py-1 rounded-md text-sm"
            style={{ 
              backgroundColor: currentTheme.colors.background,
              color: currentTheme.colors.text,
              borderColor: currentTheme.colors.border,
              borderWidth: '1px'
            }}
            autoFocus
          />
          <button
            type="submit"
            className="px-2 py-1 rounded-md text-sm"
            style={{ 
              backgroundColor: currentTheme.colors.primary,
              color: '#fff'
            }}
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setNewSubtaskTitle('');
            }}
            className="px-2 py-1 rounded-md text-sm"
            style={{ color: currentTheme.colors.textMuted }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-2 flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
          style={{ color: currentTheme.colors.primary }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add subtask
        </button>
      )}
    </div>
  );
}
