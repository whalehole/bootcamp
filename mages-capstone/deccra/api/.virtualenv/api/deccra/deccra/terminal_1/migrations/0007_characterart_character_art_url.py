# Generated by Django 3.1.5 on 2021-02-22 06:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('terminal_1', '0006_auto_20210215_2155'),
    ]

    operations = [
        migrations.AddField(
            model_name='characterart',
            name='character_art_url',
            field=models.TextField(default='lol'),
            preserve_default=False,
        ),
    ]
