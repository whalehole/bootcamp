from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from .forms import CustomUserCreationForm
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

# @api_view(['POST'])
# def signup(request):
#     if request.method == 'POST':
#         form = CustomUserCreationForm(request.POST)
#         if form.is_valid():
#             form.save()
#         return Response(status=status.HTTP_201_CREATED)
            

