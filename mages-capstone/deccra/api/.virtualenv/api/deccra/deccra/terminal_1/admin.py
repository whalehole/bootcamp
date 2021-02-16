from django.contrib import admin
from .models import Character, Gender, CommentSection, CharacterArt, Comment, CommentCommentReply, CharArtCharArtRelationship, CharArtTag, CharacterTag, CharacterLikes, CharacterHates, UserCharacterLike, UserCharacterFollow, UserUserFollow, UserCharArtBookmark, UserCharArtLike, UserCommentLike

# Register your models here.


admin.site.register(Character)
admin.site.register(Gender)
admin.site.register(CommentSection)
admin.site.register(CharacterArt)
admin.site.register(Comment)
admin.site.register(CharArtCharArtRelationship)
admin.site.register(CharArtTag)
admin.site.register(CharacterLikes)
admin.site.register(CharacterHates)
admin.site.register(UserCharacterLike)
admin.site.register(UserCharacterFollow)
admin.site.register(UserUserFollow)
admin.site.register(UserCharArtBookmark)
admin.site.register(UserCharArtLike)
admin.site.register(UserCommentLike)
admin.site.register(CharacterTag)
admin.site.register(CommentCommentReply)