"""
Service Layer for Tasks.

This layer contains business logic and orchestrates
operations between the repository and the views.
"""

from typing import Dict, List, Optional, Any
from django.utils import timezone
from datetime import datetime, timedelta, timezone as dt_timezone
from .models import Task, Category, Subtask
from .repositories import TaskRepository, CategoryRepository, SubtaskRepository


class CategoryService:
    """Service class for Category operations."""
    
    def __init__(self):
        self.repository = CategoryRepository()
    
    def get_all_categories(self) -> List[Category]:
        return list(self.repository.get_all())
    
    def get_category_by_id(self, category_id: int) -> Optional[Category]:
        return self.repository.get_by_id(category_id)
    
    def create_category(self, data: Dict[str, Any]) -> Category:
        return self.repository.create(data)
    
    def update_category(self, category_id: int, data: Dict[str, Any]) -> Optional[Category]:
        category = self.repository.get_by_id(category_id)
        if not category:
            return None
        return self.repository.update(category, data)
    
    def delete_category(self, category_id: int) -> bool:
        category = self.repository.get_by_id(category_id)
        if not category:
            return False
        return self.repository.delete(category)


class SubtaskService:
    """Service class for Subtask operations."""
    
    def __init__(self):
        self.repository = SubtaskRepository()
    
    def get_subtasks_by_task(self, task_id: int) -> List[Subtask]:
        return list(self.repository.get_by_task(task_id))
    
    def create_subtask(self, task_id: int, data: Dict[str, Any]) -> Subtask:
        return self.repository.create(task_id, data)
    
    def update_subtask(self, subtask_id: int, data: Dict[str, Any]) -> Optional[Subtask]:
        subtask = self.repository.get_by_id(subtask_id)
        if not subtask:
            return None
        return self.repository.update(subtask, data)
    
    def toggle_subtask(self, subtask_id: int) -> Optional[Subtask]:
        subtask = self.repository.get_by_id(subtask_id)
        if not subtask:
            return None
        subtask.toggle()
        return subtask
    
    def delete_subtask(self, subtask_id: int) -> bool:
        subtask = self.repository.get_by_id(subtask_id)
        if not subtask:
            return False
        return self.repository.delete(subtask)


class TaskService:
    """
    Service class for Task business operations.
    
    This class implements the use cases for task management,
    keeping business logic separate from views and repositories.
    """
    
    def __init__(self):
        self.repository = TaskRepository()
    
    def get_all_tasks(self, filters: Optional[Dict[str, Any]] = None) -> List[Task]:
        """
        Get all tasks with optional filtering.
        
        Args:
            filters: Optional dictionary with filter parameters
                - status: Filter by task status
                - priority: Filter by task priority
                - category: Filter by category ID
                - search: Search in title and description
        
        Returns:
            List of Task objects
        """
        queryset = self.repository.get_all()
        
        if filters:
            if status := filters.get('status'):
                queryset = queryset.filter(status=status)
            if priority := filters.get('priority'):
                queryset = queryset.filter(priority=priority)
            if category := filters.get('category'):
                queryset = queryset.filter(category_id=category)
            if search := filters.get('search'):
                queryset = queryset.filter(
                    title__icontains=search
                ) | queryset.filter(
                    description__icontains=search
                )
        
        return list(queryset)
    
    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """
        Get a single task by ID.
        
        Args:
            task_id: The ID of the task
        
        Returns:
            Task object or None if not found
        """
        return self.repository.get_by_id(task_id)
    
    def get_tasks_by_date_range(self, start_date: datetime, end_date: datetime) -> List[Task]:
        """Get tasks within a date range for calendar view."""
        return list(self.repository.get_by_date_range(start_date, end_date))
    
    def get_tasks_for_month(self, year: int, month: int) -> Dict[str, List[Task]]:
        """Get tasks grouped by date for a specific month."""
        from calendar import monthrange
        
        first_day = datetime(year, month, 1, tzinfo=dt_timezone.utc)
        last_day = datetime(year, month, monthrange(year, month)[1], 23, 59, 59, tzinfo=dt_timezone.utc)
        
        tasks = self.repository.get_by_date_range(first_day, last_day)
        
        # Group tasks by date
        tasks_by_date: Dict[str, List[Task]] = {}
        for task in tasks:
            if task.due_date:
                date_key = task.due_date.strftime('%Y-%m-%d')
                if date_key not in tasks_by_date:
                    tasks_by_date[date_key] = []
                tasks_by_date[date_key].append(task)
        
        return tasks_by_date
    
    def create_task(self, data: Dict[str, Any]) -> Task:
        """
        Create a new task.
        
        Args:
            data: Dictionary containing task data
                - title: Task title (required)
                - description: Task description (optional)
                - category: Category ID (optional)
                - priority: Task priority (optional, defaults to 'medium')
                - due_date: Due date (optional)
        
        Returns:
            Created Task object
        """
        return self.repository.create(data)
    
    def update_task(self, task_id: int, data: Dict[str, Any]) -> Optional[Task]:
        """
        Update an existing task.
        
        Args:
            task_id: The ID of the task to update
            data: Dictionary containing updated task data
        
        Returns:
            Updated Task object or None if not found
        """
        task = self.repository.get_by_id(task_id)
        if not task:
            return None
        
        return self.repository.update(task, data)
    
    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task.
        
        Args:
            task_id: The ID of the task to delete
        
        Returns:
            True if deleted, False if not found
        """
        return self.repository.delete_by_id(task_id)
    
    def mark_task_completed(self, task_id: int) -> Optional[Task]:
        """
        Mark a task as completed.
        
        Args:
            task_id: The ID of the task
        
        Returns:
            Updated Task object or None if not found
        """
        task = self.repository.get_by_id(task_id)
        if not task:
            return None
        
        task.mark_completed()
        return task
    
    def mark_task_pending(self, task_id: int) -> Optional[Task]:
        """
        Mark a task as pending (undo completion).
        
        Args:
            task_id: The ID of the task
        
        Returns:
            Updated Task object or None if not found
        """
        task = self.repository.get_by_id(task_id)
        if not task:
            return None
        
        task.mark_pending()
        return task
    
    def toggle_task_status(self, task_id: int) -> Optional[Task]:
        """
        Toggle task between completed and pending.
        
        Args:
            task_id: The ID of the task
        
        Returns:
            Updated Task object or None if not found
        """
        task = self.repository.get_by_id(task_id)
        if not task:
            return None
        
        if task.is_completed:
            task.mark_pending()
        else:
            task.mark_completed()
        
        return task
    
    def get_task_statistics(self) -> Dict[str, int]:
        """
        Get task statistics.
        
        Returns:
            Dictionary with task counts by status
        """
        return {
            'total': self.repository.count(),
            'pending': self.repository.count_by_status(Task.Status.PENDING),
            'in_progress': self.repository.count_by_status(Task.Status.IN_PROGRESS),
            'completed': self.repository.count_by_status(Task.Status.COMPLETED),
        }
