"""
Domain Models (Entities) for Tasks.

This layer contains the core business entities.
Models should be as pure as possible with minimal dependencies.
"""

from django.db import models
from django.utils import timezone


class Category(models.Model):
    """
    Category entity for organizing tasks.
    """
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=10, default='📁')  # Emoji icon
    color = models.CharField(max_length=7, default='#6b7280')  # Hex color
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        return f"{self.icon} {self.name}"


class Task(models.Model):
    """
    Task entity representing a to-do item.
    
    This is the core domain entity that encapsulates
    the business rules for a task.
    """
    
    class Priority(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'
    
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
    
    # Core fields
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    
    # Category relationship
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tasks'
    )
    
    # Status fields
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM
    )
    
    # Date fields
    due_date = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'
    
    def __str__(self):
        return self.title
    
    def mark_completed(self):
        """Mark task as completed with timestamp."""
        self.status = self.Status.COMPLETED
        self.completed_at = timezone.now()
        self.save()
    
    def mark_pending(self):
        """Mark task as pending."""
        self.status = self.Status.PENDING
        self.completed_at = None
        self.save()
    
    @property
    def is_completed(self) -> bool:
        """Check if task is completed."""
        return self.status == self.Status.COMPLETED
    
    @property
    def is_overdue(self) -> bool:
        """Check if task is overdue."""
        if self.due_date and not self.is_completed:
            return timezone.now() > self.due_date
        return False


class Subtask(models.Model):
    """
    Subtask entity - smaller checklist items within a task.
    """
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='subtasks'
    )
    title = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = 'Subtask'
        verbose_name_plural = 'Subtasks'
    
    def __str__(self):
        return self.title
    
    def toggle(self):
        """Toggle subtask completion."""
        self.is_completed = not self.is_completed
        self.completed_at = timezone.now() if self.is_completed else None
        self.save()
