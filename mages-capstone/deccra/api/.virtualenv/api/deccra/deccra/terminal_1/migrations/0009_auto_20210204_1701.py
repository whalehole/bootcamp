# Generated by Django 3.1.5 on 2021-02-04 09:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('terminal_1', '0008_auto_20210204_1700'),
    ]

    operations = [
        migrations.AlterField(
            model_name='characterart',
            name='characterid',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='char_art_char', to='terminal_1.character'),
        ),
    ]
