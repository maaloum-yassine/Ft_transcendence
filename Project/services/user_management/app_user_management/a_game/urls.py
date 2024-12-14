from django.urls import path, include
from .views import *

urlpatterns = [
    # path('', test, name='test'),
    # path('creategame_form/', creategame_form, name='creategame_form'),
    path('create_friends_game/', create_friends_game, name='create_friends_game'),
    path('tournament/', include('tournament.urls')),
    path('<str:room_name>/', game_view, name='game'),
]
