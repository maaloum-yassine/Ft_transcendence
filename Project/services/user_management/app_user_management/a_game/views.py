from user_managemanet.models import CustomUser
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import GameModel
from datetime import datetime
import shortuuid
from rest_framework.request import Request
from django.views import View
import sys
from django.db.models import Q
from django.conf import settings


@login_required
@api_view(['GET'])
def game_view(request, room_name):
    game_room = get_object_or_404(GameModel, room_name=room_name)

    if request.user not in game_room.players.all():
        if game_room.players.count() < 2:
            game_room.players.add(request.user)

            if game_room.players.count() == 2:
                game_room.game_started = True
                game_room.created_at = datetime.now()
                game_room.save()

            return JsonResponse({
                "state": True,
                "message": f"Added {request.user.username} to the game room {game_room.room_name}.",
                "players": list(game_room.players.values('id', 'username')),
                "game_started": game_room.game_started,
            })
        else:
            return JsonResponse({"state": False, "message": "Game room is full."})
    else:
        return JsonResponse({
            "state": False,
            "message": f"{request.user.username} is already a player in the room.",
            "players": list(game_room.players.values('id', 'username')),
            "game_started": game_room.game_started,
        })

@login_required
@api_view(['POST'])
def create_friends_game(request: Request):

    if request.method == 'POST':
        room_name = request.data.get("roomName")

        if not room_name:
            return JsonResponse({"state": False, "message": "Room name is missing."})

        if GameModel.objects.filter(gameroom_name=room_name).exists():
            game_room = GameModel.objects.get(gameroom_name=room_name)
            if game_room.players.count() == 1 and request.user not in game_room.players.all():
                game_room.players.add(request.user)
                game_room.game_started = True
                game_room.save()
                return JsonResponse({"state": True, 'message': "Game room Joined successfully", "room_name": game_room.room_name})
            
            return JsonResponse({"state": False, "message": "This game room name already exists."})
        
        new_gameroom = GameModel.objects.create(gameroom_name=room_name)
        new_gameroom.players.add(request.user)
        new_gameroom.created_at = datetime.now()
        new_gameroom.room_name = shortuuid.uuid()
        new_gameroom.save()

        print(f"room name: {new_gameroom.room_name}")
        return JsonResponse({"state": True, 'message': "Game room created successfully", "room_name": new_gameroom.room_name})

    return JsonResponse({"state": False, "message": "Invalid request method."})

@login_required
@api_view(['GET'])
def list_games(request: Request):
    user = request.user
    games = GameModel.objects.filter(players=user)

    wins = games.filter(winner=user.username).count()
    losses = games.filter(~Q(winner=None) & ~Q(winner=user.username)).count()

    game_data = [
        {
            "room_name": game.room_name,
            "gameroom_name": game.gameroom_name,
            "players": [player.username for player in game.players.all()],
            "player1Score": game.player1Score,
            "player2Score": game.player2Score,
            "game_spend_time": game.game_spend_time,
            "game_started": game.game_started,
            "game_ended": game.game_ended,
            "winner": game.winner,
            "created_at": game.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }
        for game in games
    ]

    avatar_user = request.build_absolute_uri(settings.MEDIA_URL + user.avatar).replace('http://', 'https://')
    return JsonResponse({
        
        "avatar": avatar_user,
        "user": user.username,
        "total_games": games.count(),
        "wins": wins,
        "losses": losses,
        "games": game_data,
    })

@login_required
@api_view(['GET'])
def history(request: Request):
    user = request.user
    games = GameModel.objects.filter(players=user.id)
    list_games = [
        {
            "players": [player.username for player in game.players.all()],
            "player1Score": game.player1Score,
            "winner": game.winner,
            "created_at": game.created_at,
        }
        for game in games
    ]
    return JsonResponse ({
        "user": user.username,
        "games": list_games
    })