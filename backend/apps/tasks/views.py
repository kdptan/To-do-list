"""
Views (Controllers) for Tasks API.

This layer handles HTTP requests and responses,
delegating business logic to the service layer.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated

from .models import Task, Category, Subtask
from .serializers import (
    TaskSerializer,
    TaskCreateSerializer,
    TaskUpdateSerializer,
    TaskStatusSerializer,
    CategorySerializer,
    SubtaskSerializer,
    SubtaskCreateSerializer,
)
from .services import TaskService, CategoryService, SubtaskService


class CategoryViewSet(viewsets.ViewSet):
    """
    ViewSet for Category CRUD operations.
    """
    permission_classes = [IsAuthenticated]
    
    def get_service(self, request):
        return CategoryService(user=request.user)
    
    def list(self, request: Request) -> Response:
        """List all categories."""
        service = self.get_service(request)
        categories = service.get_all_categories()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    def create(self, request: Request) -> Response:
        """Create a new category."""
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            service = self.get_service(request)
            category = service.create_category(serializer.validated_data)
            response_serializer = CategorySerializer(category)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request: Request, pk: int = None) -> Response:
        """Retrieve a category by ID."""
        service = self.get_service(request)
        category = service.get_category_by_id(pk)
        if not category:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    
    def update(self, request: Request, pk: int = None) -> Response:
        """Update a category."""
        serializer = CategorySerializer(data=request.data, partial=True)
        if serializer.is_valid():
            service = self.get_service(request)
            category = service.update_category(pk, serializer.validated_data)
            if not category:
                return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
            response_serializer = CategorySerializer(category)
            return Response(response_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request: Request, pk: int = None) -> Response:
        """Delete a category."""
        service = self.get_service(request)
        deleted = service.delete_category(pk)
        if not deleted:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SubtaskViewSet(viewsets.ViewSet):
    """
    ViewSet for Subtask operations.
    """
    permission_classes = [IsAuthenticated]
    
    def get_service(self, request):
        return SubtaskService(user=request.user)
    
    def create(self, request: Request, task_pk: int = None) -> Response:
        """Create a subtask for a task."""
        serializer = SubtaskCreateSerializer(data=request.data)
        if serializer.is_valid():
            service = self.get_service(request)
            subtask = service.create_subtask(task_pk, serializer.validated_data)
            response_serializer = SubtaskSerializer(subtask)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request: Request, task_pk: int = None, pk: int = None) -> Response:
        """Update a subtask."""
        serializer = SubtaskSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            service = self.get_service(request)
            subtask = service.update_subtask(pk, serializer.validated_data)
            if not subtask:
                return Response({'error': 'Subtask not found'}, status=status.HTTP_404_NOT_FOUND)
            response_serializer = SubtaskSerializer(subtask)
            return Response(response_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request: Request, task_pk: int = None, pk: int = None) -> Response:
        """Delete a subtask."""
        service = self.get_service(request)
        deleted = service.delete_subtask(pk)
        if not deleted:
            return Response({'error': 'Subtask not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def toggle(self, request: Request, task_pk: int = None, pk: int = None) -> Response:
        """Toggle subtask completion."""
        service = self.get_service(request)
        subtask = service.toggle_subtask(pk)
        if not subtask:
            return Response({'error': 'Subtask not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SubtaskSerializer(subtask)
        return Response(serializer.data)


class TaskViewSet(viewsets.ViewSet):
    """
    ViewSet for Task CRUD operations.
    
    Provides endpoints for:
    - GET /api/tasks/ - List all tasks
    - POST /api/tasks/ - Create a new task
    - GET /api/tasks/{id}/ - Retrieve a task
    - PUT /api/tasks/{id}/ - Update a task
    - DELETE /api/tasks/{id}/ - Delete a task
    - POST /api/tasks/{id}/toggle/ - Toggle task completion
    - GET /api/tasks/statistics/ - Get task statistics
    - GET /api/tasks/calendar/ - Get tasks for calendar view
    """
    permission_classes = [IsAuthenticated]
    
    def get_service(self, request):
        return TaskService(user=request.user)
    
    def list(self, request: Request) -> Response:
        """
        List all tasks with optional filtering.
        
        Query Parameters:
            - status: Filter by status (pending, in_progress, completed)
            - priority: Filter by priority (low, medium, high)
            - category: Filter by category ID
            - search: Search in title and description
        """
        filters = {
            'status': request.query_params.get('status'),
            'priority': request.query_params.get('priority'),
            'category': request.query_params.get('category'),
            'search': request.query_params.get('search'),
        }
        # Remove None values
        filters = {k: v for k, v in filters.items() if v is not None}
        
        service = self.get_service(request)
        tasks = service.get_all_tasks(filters if filters else None)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    
    def create(self, request: Request) -> Response:
        """Create a new task."""
        serializer = TaskCreateSerializer(data=request.data)
        if serializer.is_valid():
            service = self.get_service(request)
            task = service.create_task(serializer.validated_data)
            response_serializer = TaskSerializer(task)
            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request: Request, pk: int = None) -> Response:
        """Retrieve a single task by ID."""
        service = self.get_service(request)
        task = service.get_task_by_id(pk)
        if not task:
            return Response(
                {'error': 'Task not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = TaskSerializer(task)
        return Response(serializer.data)
    
    def update(self, request: Request, pk: int = None) -> Response:
        """Update an existing task."""
        serializer = TaskUpdateSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            service = self.get_service(request)
            task = service.update_task(pk, serializer.validated_data)
            if not task:
                return Response(
                    {'error': 'Task not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            response_serializer = TaskSerializer(task)
            return Response(response_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request: Request, pk: int = None) -> Response:
        """Partially update an existing task."""
        return self.update(request, pk)
    
    def destroy(self, request: Request, pk: int = None) -> Response:
        """Delete a task."""
        service = self.get_service(request)
        deleted = service.delete_task(pk)
        if not deleted:
            return Response(
                {'error': 'Task not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def toggle(self, request: Request, pk: int = None) -> Response:
        """Toggle task completion status."""
        service = self.get_service(request)
        task = service.toggle_task_status(pk)
        if not task:
            return Response(
                {'error': 'Task not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = TaskSerializer(task)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request: Request) -> Response:
        """Get task statistics."""
        service = self.get_service(request)
        stats = service.get_task_statistics()
        return Response(stats)
    
    @action(detail=False, methods=['get'])
    def calendar(self, request: Request) -> Response:
        """
        Get tasks grouped by date for calendar view.
        
        Query Parameters:
            - year: Year (default: current year)
            - month: Month (default: current month)
        """
        from datetime import datetime
        
        year = int(request.query_params.get('year', datetime.now().year))
        month = int(request.query_params.get('month', datetime.now().month))
        
        service = self.get_service(request)
        tasks_by_date = service.get_tasks_for_month(year, month)
        
        # Serialize tasks
        result = {}
        for date_key, tasks in tasks_by_date.items():
            result[date_key] = TaskSerializer(tasks, many=True).data
        
        return Response(result)
