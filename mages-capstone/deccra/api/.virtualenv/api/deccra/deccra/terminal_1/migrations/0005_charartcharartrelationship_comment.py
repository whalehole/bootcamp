# Generated by Django 3.1.5 on 2021-02-04 08:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('terminal_1', '0004_characterart_commentsection'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('commentid', models.AutoField(primary_key=True, serialize=False)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_updated', models.DateField(auto_now_add=True)),
                ('comment_sectionid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comment_comment_section', to='terminal_1.commentsection')),
            ],
        ),
        migrations.CreateModel(
            name='CharArtCharArtRelationship',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('character_artid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='char_art_child', to='terminal_1.characterart')),
            ],
        ),
    ]