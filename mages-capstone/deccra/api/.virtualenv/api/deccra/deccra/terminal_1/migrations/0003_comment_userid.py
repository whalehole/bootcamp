# Generated by Django 3.1.5 on 2021-02-08 14:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('terminal_1', '0002_auto_20210207_1837'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='userid',
            field=models.ForeignKey(default='1', on_delete=django.db.models.deletion.CASCADE, related_name='commenter', to='users.customuser'),
            preserve_default=False,
        ),
    ]
