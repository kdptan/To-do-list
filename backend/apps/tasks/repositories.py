"""
Repository Layer for Tasks.

This layer abstracts data access logic.
The repository pattern provides a clean separation between
the domain and data mapping layers.
"""

from typing import List, Optional
from django.db.models import QuerySet, Q
from django.contrib.auth.models import User
from .models import Task, Category, Subtask


class CategoryRepository:
    """Repository for Category data access operations."""
    
    def __init__(self, user: User = None):
        self.model = Category
        self.user = user
    
    def get_all(self) -> QuerySet[Category]:
        if self.user:
            return self.model.objects.filter(user=self.user)
        return self.model.objects.none()
    
    def get_by_id(self, category_id: int) -> Optional[Category]:
        try:
            if self.user:
                return self.model.objects.get(id=category_id, user=self.user)
            return None
        except self.model.DoesNotExist:
            return None
    
    def create(self, data: dict) -> Category:
        if self.user:
            data['user'] = self.user
        return self.model.objects.create(**data)
    
    def update(self, category: Category, data: dict) -> Category:
        for key, value in data.items():
            setattr(category, key, value)
        category.save()
        return category
    
    def delete(self, category: Category) -> bool:
        category.delete()
        return True


class SubtaskRepository:
    """Repository for Subtask data access operations."""
    
    def __init__(self, user: User = None):
        self.model = Subtask
        self.user = user
    
    def get_by_task(self, task_id: int) -> QuerySet[Subtask]:
        if self.user:
            return self.model.objects.filter(task_id=task_id, task__user=self.user)
        return self.model.objects.none()
    
    def get_by_id(self, subtask_id: int) -> Optional[Subtask]:
        try:
            if self.user:
                return self.model.objects.get(id=subtask_id, task__user=self.user)
            return None
        except self.model.DoesNotExist:
            return None
    
    def create(self, task_id: int, data: dict) -> Subtask:
        return self.model.objects.create(task_id=task_id, **data)
    
    def update(self, subtask: Subtask, data: dict) -> Subtask:
        for key, value in data.items():
            setattr(subtask, key, value)
        subtask.save()
        return subtask
    
    def delete(self, subtask: Subtask) -> bool:
        subtask.delete()
        return True


class TaskRepository:
    """
    Repository for Task data access operations.
    
    This class encapsulates all database operations for Tasks,
    providing a clean interface for the service layer.
    """
    
    def __init__(self, user: User = None):
        self.model = Task
        self.user = user
    
    def get_all(self) -> QuerySet[Task]:
        """Retrieve all tasks for the user."""
        if self.user:
            return self.model.objects.filter(user=self.user)
        return self.model.objects.none()
    
    def get_by_id(self, task_id: int) -> Optional[Task]:
        """Retrieve a task by its ID for the user."""
        try:
            if self.user:
                return self.model.objects.get(id=task_id, user=self.user)
            return None
        except self.model.DoesNotExist:
            return None
    
    def get_by_status(self, status: str) -> QuerySet[Task]:
        """Retrieve tasks filtered by status."""
        if self.user:
            return self.model.objects.filter(status=status, user=self.user)
        return self.model.objects.none()
    
    def get_by_priority(self, priority: str) -> QuerySet[Task]:
        """Retrieve tasks filtered by priority."""
        if self.user:
            return self.model.objects.filter(priority=priority, user=self.user)
        return self.model.objects.none()
    
    def get_by_category(self, category_id: int) -> QuerySet[Task]:
        """Retrieve tasks filtered by category."""
        if self.user:
            return self.model.objects.filter(category_id=category_id, user=self.user)
        return self.model.objects.none()
    
    def get_by_date_range(self, start_date, end_date) -> QuerySet[Task]:
        """Retrieve tasks with due dates in a range."""
        if self.user:
            return self.model.objects.filter(
                due_date__gte=start_date,
                due_date__lte=end_date,
                user=self.user
            )
        return self.model.objects.none()
    
    def get_pending(self) -> QuerySet[Task]:
        """Retrieve all pending tasks."""
        if self.user:
            return self.model.objects.filter(status=Task.Status.PENDING, user=self.user)
        return self.model.objects.none()
    
    def get_completed(self) -> QuerySet[Task]:
        """Retrieve all completed tasks."""
        if self.user:
            return self.model.objects.filter(status=Task.Status.COMPLETED, user=self.user)
        return self.model.objects.none()
    
    def create(self, data: dict) -> Task:
        """Create a new task."""
        if self.user:
            data['user'] = self.user
        return self.model.objects.create(**data)
    
    def update(self, task: Task, data: dict) -> Task:
        """Update an existing task."""
        for key, value in data.items():
            setattr(task, key, value)
        task.save()
        return task
    
    def delete(self, task: Task) -> bool:
        """Delete a task."""
        task.delete()
        return True
    
    def delete_by_id(self, task_id: int) -> bool:
        """Delete a task by its ID."""
        task = self.get_by_id(task_id)
        if task:
            task.delete()
            return True
        return False
    
    def search(self, query: str) -> QuerySet[Task]:
        """Search tasks by title or description."""
        if self.user:
            return self.model.objects.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query),
                user=self.user
            )
        return self.model.objects.none()
    
    def count(self) -> int:
        """Get total count of tasks."""
        if self.user:
            return self.model.objects.filter(user=self.user).count()
        return 0
    
    def count_by_status(self, status: str) -> int:
        """Get count of tasks by status."""
        if self.user:
            return self.model.objects.filter(status=status, user=self.user).count()
        return 0
    
    def count_by_category(self, category_id: int) -> int:
        """Get count of tasks by category."""
        if self.user:
            return self.model.objects.filter(category_id=category_id, user=self.user).count()
        return 0
