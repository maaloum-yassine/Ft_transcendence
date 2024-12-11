#views.py
from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view
from django.contrib.auth.models import AnonymousUser

@api_view(['GET'])
def badr(request: Request):
    if request.user.is_anonymous:
        return Response({"status": "error", "message": "User not logged in"})
    return Response({"status": "success", "user_id": request.user.id})


def index(request):
    return render(request, 'index.html')