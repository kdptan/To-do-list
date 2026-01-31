"""
Production-specific Django settings.
"""

import os
import dj_database_url
from .base import *

DEBUG = False

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', '').split(',')

# Database - Use DATABASE_URL from Render
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# CORS - Restrict in production
CORS_ALLOWED_ORIGINS = [
    origin.strip() 
    for origin in os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',') 
    if origin.strip()
]

# Static files for production
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
