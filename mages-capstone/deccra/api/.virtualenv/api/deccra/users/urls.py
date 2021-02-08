from django.urls import path, include
from . import views

urlpatterns = [
    path('signup/', views.SignupView.as_view()),
    path('users/', views.UsersListView.as_view()),
    path('user/<int:pk>/', views.UserView.as_view()),
    path('currentuser/', views.CurrentUserView.as_view()),
    path('currentuser/changedetails/', views.UserChangeDetailsView.as_view()),
    path('currentuser/changepassword/', views.UserChangePasswordView.as_view()),
]