from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
import datetime
from django.utils.timezone import make_aware

# Create your models here.

class Character(models.Model):
    characterid = models.AutoField(primary_key=True)
    character_name = models.CharField(max_length=50, blank=True)
    character_nickname = models.CharField(max_length=50, blank=True)
    genderid = models.ForeignKey('Gender', on_delete=models.CASCADE, blank=False)
    character_age = models.CharField(max_length=25, blank=True)
    character_species = models.CharField(max_length=25, blank=True)
    character_background = models.TextField(blank=True)
    character_birthday = models.DateField(blank=True, null=True)
    character_height = models.BigIntegerField(blank=True, null=True, validators=[MinValueValidator(0)])
    character_dialogue = models.CharField(max_length=100, blank=True)
    character_tag = models.TextField(blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    num_of_views = models.BigIntegerField(blank=True, null=True)
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='char_creator')
    page_views = models.BigIntegerField(blank=True, null=False, default=0)

    @property
    def trending_score(self):
        aware_now = make_aware(datetime.datetime.now())
        diff = aware_now - self.date_created
        total_seconds = diff.total_seconds()
        return self.page_views/total_seconds

class Gender(models.Model):
    genderid = models.AutoField(primary_key=True)
    gender = models.CharField(max_length=20, blank=False)

class CommentSection(models.Model):
    comment_sectionid = models.OneToOneField('CharacterArt', on_delete=models.CASCADE, related_name='comment_section_char_art', primary_key=True)

class CharacterArt(models.Model):
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='char_art_creator')
    title = models.CharField(max_length=50, blank=True)
    caption = models.CharField(max_length=300, blank=True)
    genderid = models.ForeignKey('Gender', on_delete=models.CASCADE, blank=False)
    character_age = models.CharField(max_length=25, blank=True)
    character_species = models.CharField(max_length=25, blank=True)
    character_background = models.TextField(blank=True)
    character_height = models.BigIntegerField(blank=True, null=True, validators=[MinValueValidator(0)])
    character_dialogue = models.CharField(max_length=100, blank=True)
    character_likes = models.CharField(max_length=100, blank=True)
    character_hates = models.CharField(max_length=100, blank=True)
    characterid = models.ForeignKey('Character', on_delete=models.CASCADE, related_name='char_art_char', blank=True, null=True)
    character_art_tag = models.TextField(blank=True)
    character_art_url = models.TextField(blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    page_views = models.BigIntegerField(blank=True, null=False, default=0)

    @property
    def trending_score(self):
        aware_now = make_aware(datetime.datetime.now())
        diff = aware_now - self.date_created
        total_seconds = diff.total_seconds()
        return self.page_views/total_seconds


class Comment(models.Model):
    commentid = models.AutoField(primary_key=True)
    character_artid = models.ForeignKey('CharacterArt', on_delete=models.CASCADE, related_name='comment_charart')
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='commenter')
    comment = models.CharField(max_length=1000, blank=False, null=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now_add=True)

class CommentCommentReply(models.Model):
    comment_responseid = models.AutoField(primary_key=True)
    commentid = models.ForeignKey('Comment', on_delete=models.CASCADE)
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.CharField(max_length=1000, blank=False, null=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now_add=True)

class CharArtCharArtRelationship(models.Model):
    character_artid_parent = models.ForeignKey('CharacterArt', on_delete=models.CASCADE, related_name='char_art_parent', null=True)
    character_artid_child = models.ForeignKey('CharacterArt', on_delete=models.CASCADE, related_name='char_art_child', null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now_add=True)

class CharArtTag(models.Model):
    character_artid = models.ForeignKey('CharacterArt', on_delete=models.CASCADE, related_name='chararttag')
    tag = models.CharField(max_length=100, blank=False, null=False)
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

class CharacterLikes(models.Model):
    characterid = models.ForeignKey('Character', on_delete=models.CASCADE)
    likes = models.CharField(max_length=100, blank=False, null=False)

class CharacterHates(models.Model):
    characterid = models.ForeignKey('Character', on_delete=models.CASCADE)
    hates = models.CharField(max_length=100, blank=False, null=False)

class CharacterTag(models.Model):
    characterid = models.ForeignKey('Character', on_delete=models.CASCADE, related_name='chartag')
    tag = models.CharField(max_length=100, blank=False, null=False)
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

class UserCharacterLike(models.Model):
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    characterid = models.ForeignKey('Character', on_delete=models.CASCADE)

class UserCharacterFollow(models.Model):
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    characterid = models.ForeignKey('Character', on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)

class UserUserFollow(models.Model):
    userid_follower = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_user_follower')
    userid_followed = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_user_followed')
    date_created = models.DateTimeField(auto_now_add=True)

class UserCharArtBookmark(models.Model):
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    character_artid = models.ForeignKey('CharacterArt', on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)

class UserCharArtLike(models.Model):
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    character_artid = models.ForeignKey('CharacterArt', on_delete=models.CASCADE)

class UserCommentLike(models.Model):
    userid = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    commentid = models.ForeignKey('Comment', on_delete=models.CASCADE)
