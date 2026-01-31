from django.contrib import admin
from .models import Task, Category, Subtask


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin configuration for Category model."""
    
    list_display = ['name', 'icon', 'color', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """Admin configuration for Task model."""
    
    list_display = ['title', 'status', 'priority', 'category', 'due_date', 'created_at']
    list_filter = ['status', 'priority', 'category', 'created_at']
    search_fields = ['title', 'description']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']


@admin.register(Subtask)
class SubtaskAdmin(admin.ModelAdmin):
    """Admin configuration for Subtask model."""
    
    list_display = ['title', 'task', 'is_completed', 'order', 'created_at']
    list_filter = ['is_completed', 'task']
    search_fields = ['title']
    ordering = ['task', 'order']
