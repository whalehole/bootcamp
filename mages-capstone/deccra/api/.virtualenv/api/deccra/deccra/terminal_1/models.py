from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

# Create your models here.

class Character(models.Model):
    characterid = models.AutoField(primary_key=True)
    character_name = models.CharField(max_length=50, blank=True)
    genderid = models.ForeignKey('Gender', on_delete=models.CASCADE)
    character_age = models.CharField(max_length=25, blank=True)
    character_species = models.CharField(max_length=25, blank=True)
    character_background = models.TextField(blank=True)
    character_birthday = models.DateField(blank=True, null=True)
    character_height = models.BigIntegerField(blank=True, null=True, validators=[MinValueValidator(0)])
    character_dialogue = models.CharField(max_length=100, blank=True)
    date_created = models.DateField(auto_now_add=True)
    date_updated = models.DateField(auto_now=True)
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='char_creator')

class Gender(models.Model):
    genderid = models.AutoField(primary_key=True)
    gender = models.CharField(max_length=20, blank=False)

class CommentSection(models.Model):
    comment_sectionid = models.AutoField(primary_key=True)

class CharacterArt(models.Model):
    character_artid = models.AutoField(primary_key=True)
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='char_art_creator')
    title = models.CharField(max_length=50, blank=True)
    caption = models.CharField(max_length=300, blank=True)
    characterid = models.ForeignKey('Character', on_delete=models.CASCADE, related_name='char_art_char', blank=True, null=True)
    date_created = models.DateField(auto_now_add=True)
    date_updated = models.DateField(auto_now=True)
    comment_sectionid = models.ForeignKey('CommentSection', on_delete=models.CASCADE, related_name='char_art_comment_section', unique=True)

class Comment(models.Model):
    commentid = models.AutoField(primary_key=True)
    comment_sectionid = models.ForeignKey('CommentSection', on_delete=models.CASCADE, related_name='comment_comment_section')
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='commenter')
    date_created = models.DateField(auto_now_add=True)
    date_updated = models.DateField(auto_now_add=True)

class CharArtCharArtRelationship(models.Model):
    character_artid_parent = models.ForeignKey('CharacterArt', on_delete=models.CASCADE, related_name='char_art_parent', null=True)
    character_artid_child = models.ForeignKey('CharacterArt', on_delete=models.CASCADE, related_name='char_art_child', null=True)

class CharArtTag(models.Model):
    character_artid = models.ForeignKey('CharacterArt', on_delete=models.CASCADE)
    tag = models.CharField(max_length=50, blank=False, null=False)

class CharacterLikes(models.Model):
    characterid = models.ForeignKey('Character', on_delete=models.CASCADE)
    likes = models.CharField(max_length=100, blank=False, null=False)

class CharacterHates(models.Model):
    characterid = models.ForeignKey('Character', on_delete=models.CASCADE)
    hates = models.CharField(max_length=100, blank=False, null=False)

class UserCharacterLike(models.Model):
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    characterid = models.ForeignKey('Character', on_delete=models.CASCADE)

class UserCharacterFollow(models.Model):
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    characterid = models.ForeignKey('Character', on_delete=models.CASCADE)

class UserUserFollow(models.Model):
    userid_follower = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_user_follower')
    userid_followed = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_user_followed')

class UserCharArtBookmark(models.Model):
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    character_artid = models.ForeignKey('CharacterArt', on_delete=models.CASCADE)

class UserCharArtLike(models.Model):
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    character_artid = models.ForeignKey('CharacterArt', on_delete=models.CASCADE)

class UserCommentLike(models.Model):
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    commentid = models.ForeignKey('Comment', on_delete=models.CASCADE)
