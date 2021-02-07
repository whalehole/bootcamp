from django.shortcuts import render, redirect
from .forms import CustomUserChangeForm, CustomUserCreationForm
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import SignupSerializer

User = get_user_model()
# Create your views here.


# @api_view(['POST'])
# def signup(request):
#     if request.method == 'POST':
#         form = CustomUserCreationForm(request.POST)
#         if form.is_valid():
#             form.save()
#         return redirect('signup')
    

class SignupView(generics.CreateAPIView):

    queryset = User.objects.all()
    serializer_class = SignupSerializer