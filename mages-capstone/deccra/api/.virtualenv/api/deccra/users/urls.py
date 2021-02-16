from django.urls import path, include
from . import views

urlpatterns = [
    path('signup/', views.SignupView.as_view()),
    path('users/', views.UsersListView.as_view()),
    path('user/<int:pk>/', views.UserView.as_view()),
    path('currentuser/', views.CurrentUserView.as_view()),
    path('signin/', views.SigninView.as_view()),
    path('user/changedetails/', views.UserChangeDetailsView.as_view()),
    path('user/changepw/', views.UserChangePasswordView.as_view()),
    path('user/changeemail/', views.UserChangeEmailView.as_view()),
]
