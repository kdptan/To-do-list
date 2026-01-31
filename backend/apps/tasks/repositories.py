"""
Repository Layer for Tasks.

This layer abstracts data access logic.
The repository pattern provides a clean separation between
the domain and data mapping layers.
"""

from typing import List, Optional
from django.db.models import QuerySet, Q
from .models import Task, Category, Subtask


class CategoryRepository:
    """Repository for Category data access operations."""
    
    def __init__(self):
        self.model = Category
    
    def get_all(self) -> QuerySet[Category]:
        return self.model.objects.all()
    
    def get_by_id(self, category_id: int) -> Optional[Category]:
        try:
            return self.model.objects.get(id=category_id)
        except self.model.DoesNotExist:
            return None
    
    def create(self, data: dict) -> Category:
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
    
    def __init__(self):
        self.model = Subtask
    
    def get_by_task(self, task_id: int) -> QuerySet[Subtask]:
        return self.model.objects.filter(task_id=task_id)
    
    def get_by_id(self, subtask_id: int) -> Optional[Subtask]:
        try:
            return self.model.objects.get(id=subtask_id)
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
    
    def __init__(self):
        self.model = Task
    
    def get_all(self) -> QuerySet[Task]:
        """Retrieve all tasks."""
        return self.model.objects.all()
    
    def get_by_id(self, task_id: int) -> Optional[Task]:
        """Retrieve a task by its ID."""
        try:
            return self.model.objects.get(id=task_id)
        except self.model.DoesNotExist:
            return None
    
    def get_by_status(self, status: str) -> QuerySet[Task]:
        """Retrieve tasks filtered by status."""
        return self.model.objects.filter(status=status)
    
    def get_by_priority(self, priority: str) -> QuerySet[Task]:
        """Retrieve tasks filtered by priority."""
        return self.model.objects.filter(priority=priority)
    
    def get_by_category(self, category_id: int) -> QuerySet[Task]:
        """Retrieve tasks filtered by category."""
        return self.model.objects.filter(category_id=category_id)
    
    def get_by_date_range(self, start_date, end_date) -> QuerySet[Task]:
        """Retrieve tasks with due dates in a range."""
        return self.model.objects.filter(
            due_date__gte=start_date,
            due_date__lte=end_date
        )
    
    def get_pending(self) -> QuerySet[Task]:
        """Retrieve all pending tasks."""
        return self.model.objects.filter(status=Task.Status.PENDING)
    
    def get_completed(self) -> QuerySet[Task]:
        """Retrieve all completed tasks."""
        return self.model.objects.filter(status=Task.Status.COMPLETED)
    
    def create(self, data: dict) -> Task:
        """Create a new task."""
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
        return self.model.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query)
        )
    
    def count(self) -> int:
        """Get total count of tasks."""
        return self.model.objects.count()
    
    def count_by_status(self, status: str) -> int:
        """Get count of tasks by status."""
        return self.model.objects.filter(status=status).count()
    
    def count_by_category(self, category_id: int) -> int:
        """Get count of tasks by category."""
        return self.model.objects.filter(category_id=category_id).count()
