"""
URL configuration for To-Do List project.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.tasks.urls')),
    path('api/auth/', include('apps.authentication.urls')),
]
