from rest_framework import serializers
from django.db import models
from .models import Character, Gender, CharacterArt, Comment, CommentCommentReply, CharArtCharArtRelationship, CharArtTag, CharacterLikes, CharacterHates, CharacterTag, UserCharacterLike, UserCharacterFollow, UserCharArtBookmark, UserCharArtLike, UserCommentLike, UserUserFollow
from users.models import CustomUser


class UserCreateCharacterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Character
        fields = ['characterid', 'character_name', 'character_nickname', 'genderid', 'character_age', 'character_species', 'character_background', 'character_birthday', 'character_height', 'character_dialogue']
        read_only_fields = ['characterid']
        
class UserCreatedCharacterDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Character
        fields = ['characterid', 'character_name', 'character_nickname', 'character_nickname', 'genderid', 'character_age', 'character_species', 'character_background', 'character_birthday', 'character_height', 'character_dialogue', 'date_created', 'date_updated', 'num_of_views', 'userid']
        read_only_fields = ['characterid', 'date_created', 'date_updated', 'num_of_views', 'userid']

class AdminCreateGenderSerializer(serializers. ModelSerializer):

    class Meta:
        model = Gender
        fields = ['genderid', 'gender']
        read_only_fields = ['genderid']

class UserCreateCharacterArtSerializer(serializers.ModelSerializer):

    class Meta:
        model = CharacterArt
        fields = ['id', 'characterid', 'title', 'caption']
        read_only_fields = ['id']

class UserCreatedCharacterArtDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = CharacterArt
        fields = ['id', 'title', 'caption']
        read_only_fields = ['id']

class UserCreateCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ['commentid', 'character_artid', 'comment']
        read_only_fields = ['commentid']

class UserCreatedCommentDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ['commentid', 'comment']
        read_only_fields = ['commentid']

class UserLikeCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserCommentLike
        fields = ['commentid']

class UserCommentLikesSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserCommentLike
        fields = ['commentid_id']

class UserFollowCharacterSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserCharacterFollow
        fields = ['characterid']

class UserLikeCharacterArtSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserCharArtLike
        fields = ['character_artid']

class UserUserFollowSerializer(serializers.ModelSerializer):

    class Meta: 
        model = UserUserFollow
        fields = ['userid_followed']

class UserCharArtBookmarkSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserCharArtBookmark
        fields = ['character_artid', 'date_created']

class UserGetUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['username', 'date_joined', 'country', 'self_introduction']

class UserGetCharacterArtSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CharacterArt
        fields = '__all__'

class UserGetCharacterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Character
        fields = '__all__'

class UserGetCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'

class UserGetCommentResponseSerializer(serializers.ModelSerializer):

    class Meta:
        model = CommentCommentReply
        fields = '__all__'

class UserCreateCommentResponseSerializer(serializers.ModelSerializer):

    class Meta:
        model = CommentCommentReply
        fields = '__all__'
        read_only_fields = ['userid', 'date_created', 'date_updated']

class UserCreatedCommentResponseDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = CommentCommentReply
        fields = '__all__'
        read_only_fields = ['comment_responseid', 'userid', 'date_created', 'date_updated']

class UserCreateCharArtCharArtRelationshipSerializer(serializers.ModelSerializer):

    class Meta:
        model = CharArtCharArtRelationship
        fields = '__all__'

class UserGetChildCharArtSerializer(serializers.ModelSerializer):

    class Meta:
        model = CharArtCharArtRelationship
        fields = ['character_artid_child']

class UserGetParentCharArtSerializer(serializers.ModelSerializer):

    class Meta:
        model = CharArtCharArtRelationship
        fields = ['character_artid_parent']

class UserCreateCharTagsSerializer(serializers.ModelSerializer):

    class Meta:
        model = CharacterTag
        fields = ['id', 'characterid', 'tag']

class UserCreateCharArtTagsSerializer(serializers.ModelSerializer):

    class Meta:
        model = CharArtTag
        fields = ['id', 'character_artid', 'tag']

class UserGetBookmarksOfUsersSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserCharArtBookmark
        fields = ['character_artid']

class UserGetFollowingUsersSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserUserFollow
        fields = ['userid_follower']


class UserGetCountSerializer(serializers.Serializer):

    # character counts
    follower_count = serializers.IntegerField(required=False)
    page_views = serializers.IntegerField(required=False)
    # character art counts
    page_views = serializers.IntegerField(required=False)
    like_count = serializers.IntegerField(required=False)
    comment_count = serializers.IntegerField(required=False)
    child_count = serializers.IntegerField(required=False)
    # comment counts
    like_count = serializers.IntegerField(required=False)
    response_count = serializers.IntegerField(required=False)
    # user counts
    follower_count = serializers.IntegerField(required=False)
    following_count = serializers.IntegerField(required=False)
    bookmark_count = serializers.IntegerField(required=False)
    character_created_count = serializers.IntegerField(required=False)
    character_art_created_count = serializers.IntegerField(required=False)


