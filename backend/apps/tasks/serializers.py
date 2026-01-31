"""
Serializers (DTOs) for Tasks.

This layer handles data transformation between
the API and domain models.
"""

from rest_framework import serializers
from .models import Task, Category, Subtask


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category entity."""
    task_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'color', 'task_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_task_count(self, obj):
        return obj.tasks.count()


class SubtaskSerializer(serializers.ModelSerializer):
    """Serializer for Subtask entity."""
    
    class Meta:
        model = Subtask
        fields = ['id', 'title', 'is_completed', 'completed_at', 'order', 'created_at']
        read_only_fields = ['id', 'completed_at', 'created_at']


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for Task entity.
    
    Handles conversion between Task model and JSON representation.
    """
    
    is_completed = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    subtasks = SubtaskSerializer(many=True, read_only=True)
    category_details = CategorySerializer(source='category', read_only=True)
    subtask_progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'category',
            'category_details',
            'status',
            'priority',
            'due_date',
            'completed_at',
            'created_at',
            'updated_at',
            'is_completed',
            'is_overdue',
            'subtasks',
            'subtask_progress',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'completed_at']
    
    def get_subtask_progress(self, obj):
        subtasks = obj.subtasks.all()
        total = subtasks.count()
        if total == 0:
            return None
        completed = subtasks.filter(is_completed=True).count()
        return {'completed': completed, 'total': total}


class TaskCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new task."""
    
    class Meta:
        model = Task
        fields = ['title', 'description', 'category', 'priority', 'due_date']


class TaskUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating an existing task."""
    
    class Meta:
        model = Task
        fields = ['title', 'description', 'category', 'status', 'priority', 'due_date']


class TaskStatusSerializer(serializers.Serializer):
    """Serializer for updating task status only."""
    
    status = serializers.ChoiceField(choices=Task.Status.choices)


class SubtaskCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a subtask."""
    
    class Meta:
        model = Subtask
        fields = ['title', 'order']
