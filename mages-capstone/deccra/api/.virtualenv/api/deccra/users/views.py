from django.shortcuts import render, redirect
from .forms import CustomUserChangeForm, CustomUserCreationForm
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import SignupSerializer, UserVerifyPasswordSerializer, UsersSerializer, UserChangeDetailsSerializer, UserChangePasswordSerializer
import requests
from rest_framework.views import APIView
from rest_framework import permissions
from .permissions import IsUser
from django.http import Http404
from django.contrib.auth import authenticate, login

User = get_user_model()
    

class SignupView(APIView):

    def post(self, request):
        reg_serializer = SignupSerializer(data=request.data)
        if reg_serializer.is_valid():
            new_user = reg_serializer.save()
            if new_user:
                r = requests.post('http://127.0.0.1:8000/api-auth/token', data = {
                    'username': new_user.email,
                    'password': request.data['password'],
                    'client_id': 'CeCoLs5SF0ZFOfvt1tOe77sQVv9YqNSObQ4Q66a0',
                    'client_secret': 'uGGNC4oVZfsLpcpmBUNhTbqgM7aNOGrmcF7IQLOXKeBJhz7MCx49iMTtAs2Tz41TW0ixI1gJWiL6NxNQNKWDUyCdozp3gPGfPLx57T6M5f1OfA905P6XYnZ0mYzPZHt3',
                    'grant_type': 'password'
                })
                return Response(r.json(), status=status.HTTP_201_CREATED)
        return Response(reg_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SigninView(APIView):
    
    def post(self, request):
        serializer = UserVerifyPasswordSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('email')
            password = serializer.data.get('password')
            user = authenticate(request, email=username, password=password)
            if user is not None:
                r = requests.post('http://127.0.0.1:8000/api-auth/token', data = {
                    'username': user.email,
                    'password': request.data['password'],
                    'client_id': 'CeCoLs5SF0ZFOfvt1tOe77sQVv9YqNSObQ4Q66a0',
                    'client_secret': 'uGGNC4oVZfsLpcpmBUNhTbqgM7aNOGrmcF7IQLOXKeBJhz7MCx49iMTtAs2Tz41TW0ixI1gJWiL6NxNQNKWDUyCdozp3gPGfPLx57T6M5f1OfA905P6XYnZ0mYzPZHt3',
                    'grant_type': 'password'
                })
                return Response(r.json(), status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserChangeDetailsView(APIView):
    permission_classes = [IsUser]
    def get(self, request, format=None):
        serializer = UserChangeDetailsSerializer(self.request.user)
        return Response(serializer.data)

    def patch(self, request, format=None):
        serializer = UserChangeDetailsSerializer(self.request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        user = User.objects.get(email=self.request.user)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserChangePasswordView(APIView):
    permission_classes = [IsUser]

    def put(self, request, *args, **kwargs):
        serializer = UserChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            old_password = serializer.data.get('old_password')
            if not self.request.user.check_password(old_password):
                return Response({"old_password": ["Wrong password."]},status=status.HTTP_400_BAD_REQUEST)
            self.request.user.set_password(serializer.data.get('new_password'))
            self.request.user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserChangeEmailView(APIView):
    permission_classes = [IsUser]

    def put(self, request):
        serializer = UserVerifyPasswordSerializer(data=request.data)
        if serializer.is_valid():
            username = self.request.user
            password = serializer.data.get('password')
            user = authenticate(request, email=username, password=password)
            if user is not None:
                user.email = serializer.data.get('email')
                user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UsersListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UsersSerializer

class UserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UsersSerializer

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, format=None):
        serializer = UsersSerializer(self.request.user)
        return Response(serializer.data)





