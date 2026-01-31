# Generated migration for adding user field to models
# This migration will DELETE all existing tasks/categories since they have no user association
# Run this after installing dependencies and before starting the server

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def delete_existing_data(apps, schema_editor):
    """Delete all existing tasks, subtasks, and categories since they have no user."""
    Task = apps.get_model('tasks', 'Task')
    Category = apps.get_model('tasks', 'Category')
    Subtask = apps.get_model('tasks', 'Subtask')
    
    # Delete in order due to foreign key constraints
    Subtask.objects.all().delete()
    Task.objects.all().delete()
    Category.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tasks', '0002_category_task_category_subtask'),
    ]

    operations = [
        # First, delete all existing data
        migrations.RunPython(delete_existing_data, migrations.RunPython.noop),
        
        # Then add the user field to Category
        migrations.AddField(
            model_name='category',
            name='user',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='categories',
                to=settings.AUTH_USER_MODEL,
            ),
            preserve_default=False,
        ),
        # Add the user field to Task
        migrations.AddField(
            model_name='task',
            name='user',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='tasks',
                to=settings.AUTH_USER_MODEL,
            ),
            preserve_default=False,
        ),
    ]
