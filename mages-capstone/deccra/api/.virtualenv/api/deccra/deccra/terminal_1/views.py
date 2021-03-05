from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import permissions
from .serializers import (UserCreatedCharacterDetailsSerializer, UserCreateCharacterSerializer, AdminCreateGenderSerializer, UserCreateCharacterArtSerializer, UserCreatedCharacterArtDetailsSerializer, UserCreateCommentSerializer, UserCreatedCommentDetailsSerializer, UserLikeCommentSerializer, UserCommentLikesSerializer, UserFollowCharacterSerializer, UserLikeCharacterArtSerializer, UserUserFollowSerializer, UserCharArtBookmarkSerializer,
UserGetUserSerializer, UserGetCharacterArtSerializer, UserGetCharacterSerializer, UserGetCommentSerializer, UserGetCommentResponseSerializer, UserCreateCommentResponseSerializer, UserCreatedCommentResponseDetailsSerializer,
UserCreateCharArtCharArtRelationshipSerializer, UserGetChildCharArtSerializer, UserGetParentCharArtSerializer, UserCreateCharTagsSerializer, UserCreateCharArtTagsSerializer, UserGetBookmarksOfUsersSerializer, UserGetFollowingUsersSerializer, UserGetCountSerializer, UserGetCharArtUrlSerializer,
UserViewCharartSerializer, UserViewCharSerializer)
from .models import Character, Gender, CharacterArt, Comment, CommentCommentReply, CharArtCharArtRelationship, CharArtTag, CharacterLikes, CharacterHates, CharacterTag, UserCharacterLike, UserCharacterFollow, UserCharArtBookmark, UserCharArtLike, UserCommentLike, UserUserFollow
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
import json
from rest_framework.pagination import PageNumberPagination
from .homepagePagination import PaginationHandlerMixin
User = get_user_model()

# PAGINATION

class HomePagePagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'

class BasicPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'

# VIEWS

class UserCreateCharacterView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = UserCreateCharacterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userid_id=self.request.user.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserCreatedCharacterDetailsView(APIView, PaginationHandlerMixin):
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = BasicPagination

    def get(self, request):
        queryset = Character.objects.filter(userid_id=self.request.user.id)
        if request.GET.get('order_by'):
            # sort by newest
            if request.GET.get('order_by') == 'newest':
                queryset = queryset.order_by('-date_created')
            # sort by oldest
            elif request.GET.get('order_by') == 'oldest':
                queryset = queryset.order_by('date_created')
         
        page = self.paginate_queryset(queryset)
        if page is not None:           
            serializer = self.get_paginated_response(UserCreatedCharacterDetailsSerializer(page, many=True).data)
        else:
            serializer = UserCreatedCharacterDetailsSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        queryset = Character.objects.filter(userid_id=self.request.user.id)
        character = queryset.get(characterid=request.GET.get('characterid'))
        serializer = UserCreatedCharacterDetailsSerializer(character, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        queryset = Character.objects.filter(userid_id=self.request.user.id)
        character = queryset.get(characterid=request.GET.get('characterid'))
        character.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AdminCreateGenderView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        serializer = AdminCreateGenderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserCreateCharacterArtView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = UserCreateCharacterArtSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userid_id=self.request.user.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserCreatedCharacterArtDetailsView(APIView, PaginationHandlerMixin):
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = BasicPagination

    def get(self, request):
        queryset = CharacterArt.objects.filter(userid_id=self.request.user.id)
        if request.GET.get('order_by'):
            # sort by newest
            if request.GET.get('order_by') == 'newest':
                queryset = queryset.order_by('-date_created')
            # sort by oldest
            elif request.GET.get('order_by') == 'oldest':
                queryset = queryset.order_by('date_created')
         
        page = self.paginate_queryset(queryset)
        if page is not None:           
            serializer = self.get_paginated_response(UserCreatedCharacterArtDetailsSerializer(page, many=True).data)
        else:
            serializer = UserCreatedCharacterArtDetailsSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        queryset = CharacterArt.objects.filter(userid_id=self.request.user.id)
        character_art = queryset.get(id=request.GET.get('character_artid'))
        serializer = UserCreatedCharacterArtDetailsSerializer(character_art, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        queryset = CharacterArt.objects.filter(userid_id=self.request.user.id)
        character_art = queryset.get(id=request.GET.get('character_artid'))
        character_art.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# comment like

class UserCreateCommentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = UserCreateCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userid_id=self.request.user.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserCreatedCommentDetailsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        queryset = Comment.objects.filter(userid_id=self.request.user)
        comment = queryset.get(commentid=request.GET.get('commentid'))
        serializer = UserCreatedCommentDetailsSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)      

    def delete(self, request):
        queryset = Comment.objects.filter(userid_id=self.request.user)
        comment = queryset.get(commentid=request.GET.get('commentid'))
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserLikeCommentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = UserCommentLike.objects.filter(userid=self.request.user).select_related('commentid').filter(commentid_id__character_artid=request.GET.get('character_artid'))
        serializer = UserCommentLikesSerializer(queryset, many=True)
        return Response(serializer.data)      

    def post(self, request):
        serializer = UserLikeCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userid_id=self.request.user.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        queryset = UserCommentLike.objects.filter(userid_id=self.request.user)
        comment_like = queryset.get(commentid=request.GET.get('commentid'))
        comment_like.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# user follow character

class UserFollowCharacterView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = UserCharacterFollow.objects.filter(userid=self.request.user)
        if not request.GET.get('characterid'):
            if request.GET.get('keywords'):
                query = SearchQuery(request.GET.get('keywords'))
                vector = SearchVector('characterid__character_name', 'characterid__character_nickname', 'characterid__character_background', 'characterid__character_species')
                queryset = queryset.annotate(search=vector).filter(search=query)
            if request.GET.get('order_by'):
                if request.GET.get('order_by') == 'newest':
                    queryset = queryset.order_by('-date_created')
                elif request.GET.get('order_by') == 'oldest':
                    queryset = queryset.order_by('date_created')
            serializer = UserFollowCharacterSerializer(queryset, many=True)
            return Response(serializer.data)
        character = queryset.get(characterid=request.GET.get('characterid'))
        serializer = UserFollowCharacterSerializer(character)       
        return Response(serializer.data)

    def post(self, request):
        serializer = UserFollowCharacterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userid=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        queryset = UserCharacterFollow.objects.filter(userid=self.request.user)
        followed_character = queryset.get(characterid=request.GET.get('characterid'))
        followed_character.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# user like character art

class UserLikeCharacterArtView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = UserCharArtLike.objects.filter(userid=self.request.user)
        if not request.GET.get('character_artid'):
            serializer = UserLikeCharacterArtSerializer(queryset, many=True)
            return Response(serializer.data)
        character_art = queryset.get(character_artid=request.GET.get('character_artid'))
        serializer = UserLikeCharacterArtSerializer(character_art)       
        return Response(serializer.data)

    def post(self, request):
        serializer = UserLikeCharacterArtSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userid=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        queryset = UserCharArtLike.objects.filter(userid=self.request.user)
        liked_character_art = queryset.get(character_artid=request.GET.get('character_artid'))
        liked_character_art.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# user follow user

class UserUserFollowView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = UserUserFollow.objects.filter(userid_follower=self.request.user).order_by('-date_created')
        if not request.GET.get('userid'):
            if request.GET.get('keywords'):
                query = SearchQuery(request.GET.get('keywords'))
                vector = SearchVector('userid_followed__username')
                queryset = queryset.annotate(search=vector).filter(search=query)
            serializer = UserUserFollowSerializer(queryset, many=True)
            return Response(serializer.data)
        userid_followed = queryset.get(userid_followed=request.GET.get('userid'))
        serializer = UserUserFollowSerializer(userid_followed)       
        return Response(serializer.data)

    def post(self, request):
        serializer = UserUserFollowSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userid_follower=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        queryset = UserUserFollow.objects.filter(userid_follower=self.request.user)
        followed_user = queryset.get(userid_followed=request.GET.get('userid'))
        followed_user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 

# user bookmark character art

class UserCharArtBookmarkView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = UserCharArtBookmark.objects.filter(userid=self.request.user)
        if not request.GET.get('character_artid'):
            if request.GET.get('keywords'):
                query = SearchQuery(request.GET.get('keywords'))
                vector = SearchVector('character_artid__title','character_artid__caption','character_artid__characterid__character_name', 'character_artid__characterid__character_nickname', 'character_artid__characterid__character_background', 'character_artid__characterid__character_species')
                queryset = queryset.annotate(search=vector).filter(search=query)
            if request.GET.get('order_by'):
                if request.GET.get('order_by') == 'newest':
                    queryset = queryset.order_by('-date_created')
                elif request.GET.get('order_by') == 'oldest':
                    queryset = queryset.order_by('date_created')
            serializer = UserCharArtBookmarkSerializer(queryset, many=True)
            return Response(serializer.data)
        character_art_bookmarked = queryset.get(character_artid=request.GET.get('character_artid'))
        serializer = UserCharArtBookmarkSerializer(character_art_bookmarked)       
        return Response(serializer.data)

    def post(self, request):
        serializer = UserCharArtBookmarkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userid=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        queryset = UserCharArtBookmark.objects.filter(userid=self.request.user)
        bookmarked_character_art = queryset.get(character_artid=request.GET.get('character_artid'))
        bookmarked_character_art.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 

# user get other user information

class UserGetUserView(APIView):

    def get(self, request):
        queryset = User.objects.all()
        if not request.GET.get('userid'):
            # FILTER
            # filter using keywords
            if request.GET.get('keywords'):
                query = SearchQuery(request.GET.get('keywords'))
                vector = SearchVector('username')
                queryset = queryset.annotate(rank=SearchRank(vector, query)).order_by('-rank')
            serializer = UserGetUserSerializer(queryset, many=True)
            return Response(serializer.data)
        user_details = queryset.get(id=request.GET.get('userid'))
        serializer = UserGetUserSerializer(user_details)       
        return Response(serializer.data)

# users get character art

class UserGetCharacterArtView(APIView, PaginationHandlerMixin):
    pagination_class = HomePagePagination
    serializer_class = UserGetCharacterArtSerializer
    def get(self, request, format=None, *args, **kwargs):
        character_arts = CharacterArt.objects.prefetch_related('chararttag').all()

        if not request.GET.get('character_artid'):
            if not request.GET.get('characterid'): 
                # FILTER
                # filter using keywords
                if request.GET.get('keywords'):
                    query = SearchQuery(request.GET.get('keywords'))
                    vector = SearchVector('title', 'caption', 'character_background', 'character_species', 'characterid__character_name', 'characterid__character_nickname', 'characterid__character_background', 'characterid__character_species', 'character_art_tag')
                    character_arts = character_arts.annotate(rank=SearchRank(vector, query)).distinct().order_by('-rank')
                # filter using tags
                if request.GET.get('tags'):
                    arrayOfTags = list(request.GET.get('tags').split(","))
                    for tag in arrayOfTags: 
                        query = SearchQuery(tag)
                        vector = SearchVector('tag')
                        character_arts = character_arts.filter(id__in=CharArtTag.objects.annotate(search=vector).filter(search=query).values('character_artid'))
                # filter using gender
                if request.GET.get('genderid'):
                    character_arts = character_arts.filter(genderid=request.GET.get('genderid'))
                # filter using species
                if request.GET.get('species'):
                    query = SearchQuery(request.GET.get('species'))
                    vector = SearchVector('character_species')
                    character_arts = character_arts.annotate(search=vector).filter(search=query)
            #filter using characterid
            if request.GET.get('characterid'):
                character_arts = character_arts.filter(characterid=request.GET.get('characterid'))
            # SORT
            if request.GET.get('order_by'):
                # sort by newest
                if request.GET.get('order_by') == 'newest':
                    character_arts = character_arts.order_by('-date_created')
                # sort by oldest
                elif request.GET.get('order_by') == 'oldest':
                    character_arts = character_arts.order_by('date_created')
                # sort by trending
                elif request.GET.get('order_by') == 'trending':
                    character_arts = sorted(character_arts, key=lambda t: t.trending_score, reverse=True)
                # sort by most views
                if request.GET.get('order_by') == 'views':
                    character_arts = character_arts.order_by('-page_views')
            page = self.paginate_queryset(character_arts)
            if page is not None:           
                serializer = self.get_paginated_response(self.serializer_class(page, many=True).data)
            else:
                serializer = self.serializer_class(character_arts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        id_list = json.loads(request.GET.get('character_artid'))
        character_arts = character_arts.filter(id__in=id_list)
        serializer = UserGetCharacterArtSerializer(character_arts, many=True)
        return Response(serializer.data)

class UserGetCharacterView(APIView, PaginationHandlerMixin):
    pagination_class = HomePagePagination

    def get(self, request, format=None, *args, **kwargs):
        characters = Character.objects.prefetch_related('chartag').all()
        serializer = UserGetCharacterSerializer

        if not request.GET.get('characterid'):
            # FILTER
            # filter using keywords
            if request.GET.get('keywords'):
                query = SearchQuery(request.GET.get('keywords'))
                vector = SearchVector('character_background', 'character_species', 'character_name', 'character_nickname', 'character_tag')
                characters = characters.annotate(rank=SearchRank(vector, query)).order_by('-rank')
            # filter using tags
            if request.GET.get('tags'):
                arrayOfTags = list(request.GET.get('tags').split(","))
                for tag in arrayOfTags: 
                    query = SearchQuery(tag)
                    vector = SearchVector('tag')
                    characters = characters.filter(characterid__in=CharacterTag.objects.annotate(search=vector).filter(search=query).values('characterid'))
            # filter using gender
            if request.GET.get('genderid'):
                characters = characters.filter(genderid=request.GET.get('genderid'))
            # filter using species
            if request.GET.get('species'):
                query = SearchQuery(request.GET.get('species'))
                vector = SearchVector('character_species')
                characters = characters.annotate(search=vector).filter(search=query)
            # SORT
            if request.GET.get('order_by'):
                # sort by newest
                if request.GET.get('order_by') == 'newest':
                    characters = characters.order_by('-date_created')
                # sort by oldest
                elif request.GET.get('order_by') == 'oldest':
                    characters = characters.order_by('date_created')
                # sort by trending
                elif request.GET.get('order_by') == 'trending':
                    characters = sorted(characters, key=lambda t: t.trending_score, reverse=True)
                # sort by most views
                if request.GET.get('order_by') == 'views':
                    characters = characters.order_by('-page_views')
        
            page = self.paginate_queryset(characters)
            if page is not None:           
                serializer = self.get_paginated_response(UserGetCharacterSerializer(page, many=True).data)
            else:
                serializer = UserGetCharacterSerializer(characters, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        id_list = json.loads(request.GET.get('characterid'))
        characters = characters.filter(characterid__in=id_list)
        serializer = UserGetCharacterSerializer(characters, many=True)
        return Response(serializer.data)

class UserGetCommentView(APIView, PaginationHandlerMixin):
    pagination_class = BasicPagination
    serializer = UserGetCommentSerializer

    def get(self, request):
        queryset = Comment.objects.filter(character_artid=request.GET.get('character_artid'))
        if request.GET.get('order_by'):
            # sort by newest
            if request.GET.get('order_by') == 'newest':
                comments = queryset.order_by('-date_created')
            # sort by oldest
            elif request.GET.get('order_by') == 'oldest':
                comments = queryset.order_by('date_created')
        page = self.paginate_queryset(comments)
        if page is not None:           
            serializer = self.get_paginated_response(UserGetCommentResponseSerializer(page, many=True).data)
        else:
            serializer = UserGetCommentResponseSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserGetCommentResponseView(APIView, PaginationHandlerMixin):
    pagination_class = BasicPagination
    serializer = UserGetCommentResponseSerializer

    def get(self, request):
        queryset = CommentCommentReply.objects.filter(commentid=request.GET.get('commentid'))
        serializer = UserGetCommentResponseSerializer(queryset, many=True)
        if request.GET.get('order_by'):
            # sort by newest
            if request.GET.get('order_by') == 'newest':
                comments = queryset.order_by('-date_created')
            # sort by oldest
            elif request.GET.get('order_by') == 'oldest':
                comments = queryset.order_by('date_created')
        page = self.paginate_queryset(comments)
        if page is not None:           
            serializer = self.get_paginated_response(UserGetCommentResponseSerializer(page, many=True).data)
        else:
            serializer = UserGetCommentResponseSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserCreateCommentResponseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = UserCreateCommentResponseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userid_id=self.request.user.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserCreatedCommentResponseDetailsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        queryset = CommentCommentReply.objects.filter(userid_id=self.request.user)
        response = queryset.get(comment_responseid=request.GET.get('comment_responseid'))
        serializer = UserCreatedCommentResponseDetailsSerializer(response, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)      

    def delete(self, request):
        queryset = CommentCommentReply.objects.filter(userid_id=self.request.user)
        response = queryset.get(comment_responseid=request.GET.get('comment_responseid'))
        response.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserCreateCharArtCharArtRelationshipView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = UserCreateCharArtCharArtRelationshipSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserGetChildCharArtView(APIView):

    def get(self, request):
        if request.GET.get('find') == 'parent':
            # get child
            queryset = CharArtCharArtRelationship.objects.filter(character_artid_parent=request.GET.get('character_artid_parent'))
            serializer = UserGetChildCharArtSerializer(queryset, many=True)
            return Response(serializer.data)
        # get parent 
        queryset = CharArtCharArtRelationship.objects.filter(character_artid_child=request.GET.get('character_artid_child'))
        serializer = UserGetParentCharArtSerializer(queryset, many=True)
        return Response(serializer.data)

class UserCreateCharTagsView(APIView):

    def get(self, request):
        queryset = CharacterTag.objects.filter(userid=self.request.user)
        char_tags = queryset.filter(characterid=request.GET.get('characterid'))
        serializer = UserCreateCharTagsSerializer(char_tags, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserCreateCharTagsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userid_id= self.request.user.id)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        queryset = CharacterTag.objects.filter(userid=self.request.user)
        char_tag = queryset.get(id=request.GET.get('tagid'))
        char_tag.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserCreateCharArtTagsView(APIView):

    def get(self, request):
        queryset = CharArtTag.objects.filter(userid=self.request.user)
        char_art_tags = queryset.filter(character_artid=request.GET.get('character_artid'))
        serializer = UserCreateCharArtTagsSerializer(char_art_tags, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserCreateCharArtTagsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userid_id= self.request.user.id)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        queryset = CharArtTag.objects.filter(userid=self.request.user)
        char_art_tag = queryset.get(id=request.GET.get('tagid'))
        char_art_tag.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserGetBookmarksOfUsersView(APIView):

    def get(self, request):
        queryset = UserCharArtBookmark.objects.filter(userid=request.GET.get('userid')).order_by('-date_created')
        serializer = UserGetBookmarksOfUsersSerializer(queryset, many=True)
        return Response(serializer.data)

class UserGetUserFollowingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = UserUserFollow.objects.filter(userid_followed=self.request.user).order_by('-date_created')
        if not request.GET.get('userid'):
            if request.GET.get('keywords'):
                query = SearchQuery(request.GET.get('keywords'))
                vector = SearchVector('userid_follower__username')
                queryset = queryset.annotate(search=vector).filter(search=query)
            serializer = UserGetFollowingUsersSerializer(queryset, many=True)
            return Response(serializer.data)
        userid_follower = queryset.get(userid_follower=request.GET.get('userid'))
        serializer = UserGetFollowingUsersSerializer(userid_follower)       
        return Response(serializer.data)

class UserGetUserFollowingCharView(APIView):

    def get(self, request):
        queryset = UserCharacterFollow.objects.filter(userid=request.GET.get('userid')).order_by('-date_created')
        if not request.GET.get('characterid'):
            if request.GET.get('keywords'):
                query = SearchQuery(request.GET.get('keywords'))
                vector = SearchVector('characterid__character_name', 'characterid__character_nickname', 'characterid__character_background', 'characterid__character_species')
                queryset = queryset.annotate(search=vector).filter(search=query)
            serializer = UserFollowCharacterSerializer(queryset, many=True)
            return Response(serializer.data)
        character = queryset.get(characterid=request.GET.get('characterid'))
        serializer = UserFollowCharacterSerializer(character)       
        return Response(serializer.data)

class UserGetCharCountView(APIView):

    def get(self, request):
        if request.GET.get("type") == "follower_count":
            follower_count = UserCharacterFollow.objects.filter(characterid=request.GET.get('characterid')).count()
            count_object = {"follower_count": follower_count}
            serializer = UserGetCountSerializer(count_object)
            return Response(serializer.data)
        if request.GET.get("type") == "page_views":
            query = Character.objects.get(characterid=request.GET.get('characterid'))
            serializer = UserGetCountSerializer(query)
            return Response(serializer.data)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserGetCharArtCountView(APIView):

    def get(self, request):
        if request.GET.get("type") == "counts":
            like_count = UserCharArtLike.objects.filter(character_artid=request.GET.get('character_artid')).count()
            comment_count = Comment.objects.filter(character_artid=request.GET.get('character_artid')).count()
            child_count = CharArtCharArtRelationship.objects.filter(character_artid_parent=request.GET.get('character_artid')).count()
            count_object = {"like_count": like_count, "comment_count": comment_count, "child_count": child_count}
            serializer = UserGetCountSerializer(count_object)
            return Response(serializer.data)
        if request.GET.get("type") == "page_views":
            query = CharacterArt.objects.get(id=request.GET.get('character_artid'))
            serializer = UserGetCountSerializer(query)
            return Response(serializer.data)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserGetCommentCountView(APIView):

    def get(self, request):
        if request.GET.get("type") == "counts":
            like_count = UserCommentLike.objects.filter(commentid=request.GET.get('commentid')).count()
            response_count = CommentCommentReply.objects.filter(commentid=request.GET.get('commentid')).count()
            count_object = {"like_count": like_count, "response_count": response_count}
            serializer = UserGetCountSerializer(count_object)
            return Response(serializer.data)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserGetUserCountView(APIView):

    def get(self, request):
        if request.GET.get("type") == "counts":
            follower_count = UserUserFollow.objects.filter(userid_followed=request.GET.get('userid')).count()
            following_count = UserUserFollow.objects.filter(userid_follower=request.GET.get('userid')).count()
            bookmark_count = UserCharArtBookmark.objects.filter(userid=request.GET.get('userid')).count()
            character_created_count = Character.objects.filter(userid=request.GET.get('userid')).count()
            character_art_created_count = CharacterArt.objects.filter(userid=request.GET.get('userid')).count()
            count_object = {"follower_count": follower_count, "following_count": following_count, "bookmark_count": bookmark_count, "character_created_count": character_created_count, "character_art_created_count": character_art_created_count}
            serializer = UserGetCountSerializer(count_object)
            return Response(serializer.data)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserGetCharArtUrlView(APIView):

    def get(self, request):
        url = CharacterArt.objects.get(character_art_url=request.GET.get("character_art_url"))
        serializer = UserGetCharArtUrlSerializer(url)
        return Response(serializer.data)

class UserViewCharartView(APIView):

    def patch(self, request):
        queryitem = CharacterArt.objects.get(id=request.GET.get('character_artid'))
        serializer = UserViewCharartSerializer(queryitem, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewCharView(APIView):

    def patch(self, request):
        queryitem = Character.objects.get(characterid=request.GET.get('characterid'))
        serializer = UserViewCharSerializer(queryitem, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
