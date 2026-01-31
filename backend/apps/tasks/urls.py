"""
URL routing for Tasks API.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, CategoryViewSet, SubtaskViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'categories', CategoryViewSet, basename='category')

# Custom URL patterns for nested subtasks
subtask_list = SubtaskViewSet.as_view({
    'post': 'create'
})

subtask_detail = SubtaskViewSet.as_view({
    'put': 'update',
    'patch': 'update',
    'delete': 'destroy'
})

subtask_toggle = SubtaskViewSet.as_view({
    'post': 'toggle'
})

urlpatterns = [
    path('', include(router.urls)),
    # Nested subtask URLs under tasks
    path('tasks/<int:task_pk>/subtasks/', subtask_list, name='subtask-list'),
    path('tasks/<int:task_pk>/subtasks/<int:pk>/', subtask_detail, name='subtask-detail'),
    path('tasks/<int:task_pk>/subtasks/<int:pk>/toggle/', subtask_toggle, name='subtask-toggle'),
]
