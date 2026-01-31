/**
 * Subtask entity for breaking down tasks.
 */
export interface Subtask {
  id: number;
  title: string;
  is_completed: boolean;
  order: number;
  created_at: string;
}

export interface CreateSubtaskData {
  title: string;
  order?: number;
}

export interface UpdateSubtaskData {
  title?: string;
  is_completed?: boolean;
  order?: number;
}
