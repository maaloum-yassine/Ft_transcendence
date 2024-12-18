from django.urls import path, include
from .views import *
from django.http import HttpResponse

def hello(request):
    return HttpResponse("hello")

urlpatterns = [
    # path('', test, name='test'),
    # path('creategame_form/', creategame_form, name='creategame_form'),
    path('hello', hello),
    path('create_friends_game/', create_friends_game, name='create_friends_game'),
    path('tournament/', include('tournament.urls')),
    path('history/', history, name='fetch_user_wins_by_id'),
    path('user-data/', list_games, name='fetch_user_wins_by_id'),
    path('<str:room_name>/', game_view, name='game'),
]
