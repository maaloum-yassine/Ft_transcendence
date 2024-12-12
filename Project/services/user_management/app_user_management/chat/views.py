from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from django.contrib.auth.models import User
# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from user_managemanet.models import Friendship,CustomUser
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

@api_view(['GET'])
def chathome(request):
    
    # print(f"USER ------------>  {request.user}")
    return Response("Welcome To chat 1337  page")

@api_view(['PATCH'])
def block_friend(request, friend_id):
    """
    View to block a specific friend.
    The user must be the one initiating the block request.
    """
    # Get the authenticated user
    user = request.user

    # Ensure the friend exists
    friend = get_object_or_404(CustomUser, id=friend_id)

    # Find the friendship record where the current user is involved with the friend
    friendship = Friendship.objects.filter(
        user=user, friend=friend
    ).first() or Friendship.objects.filter(
        user=friend, friend=user
    ).first()

    if not friendship:
        return Response({"detail": "Friendship not found"}, status=status.HTTP_404_NOT_FOUND)

    # If friendship exists, update the blocked status
    friendship.blocked = True
    friendship.save()

    return Response({"detail": "Friend successfully blocked."}, status=status.HTTP_200_OK)

def get_non_friends(authenticated_user):
    friends = Friendship.objects.filter(
        Q(user=authenticated_user) | Q(friend=authenticated_user),
        accepted=True
    ).values_list('user', 'friend')  

    friend_ids = set(
        user_id for friend_pair in friends for user_id in friend_pair if user_id != authenticated_user.id
    )

    non_friends = CustomUser.objects.exclude(
        Q(pk=authenticated_user.pk) | Q(pk__in=friend_ids)
    )

    return non_friends



















def is_friend_blocked_view(request, friend_id):
    """
    Checks if the authenticated user is blocked by or has blocked a specific friend.

    Args:
        request: The HTTP request object.
        friend_id (int): The ID of the friend to check.

    Returns:
        JsonResponse: Indicates if the friend is blocked or has blocked the user.
    """
    authenticated_user = request.user  # The logged-in user

    try:
        # Fetch the friend user by ID or return 404 if not found
        friend_user = get_object_or_404(CustomUser, id=friend_id)

        # Check if the authenticated user has blocked the friend
        friendship_from_user = Friendship.objects.filter(user=authenticated_user, friend=friend_user).first()

        # Check if the friend has blocked the authenticated user
        friendship_from_friend = Friendship.objects.filter(user=friend_user, friend=authenticated_user).first()

        # Determine blocking statuses
        user_blocked_friend = friendship_from_user.blocked if friendship_from_user else False
        friend_blocked_user = friendship_from_friend.blocked if friendship_from_friend else False

        # Consolidated blocked status
        blocked = user_blocked_friend or friend_blocked_user

        return JsonResponse({
            'authenticated_user_id': authenticated_user.id,
            'friend_id': friend_id,
            'blocked': blocked,  # Consolidated status
        })

    except CustomUser.DoesNotExist:
        return JsonResponse({
            'error': 'Friend user not found.'
        }, status=404)

    except Exception as e:
        return JsonResponse({
            'error': 'An unexpected error occurred.',
            'details': str(e)
        }, status=500)


















@api_view(['GET'])
def list_non_friends(request):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=404)
        
    
    authenticated_user = request.user
    non_friends = get_non_friends(authenticated_user)
    
    # Serialize the data with details about invitations
    data = []
    for user in non_friends:
        has_invitation = Friendship.objects.filter(
            user=authenticated_user, friend=user, accepted=False
        ).exists()

        # Directly use avatar if it's already a URL or path
        avatar = user.avatar if user.avatar else None

        data.append({
            "id": user.id,
            "username": user.username,
            "avatar": avatar,
            "invitation_sent": has_invitation  # True if an invitation exists
        })
    
    return Response({"non_friends": data}, status=200)
# def index(request):
#     return render(request, "index.html")

# def room(request, room    _name):
#     return render(request, "room.html", {"room_name": room_name})


# class UserListView(APIView):
#     def get(self, request, *args, **kwargs):
#         # Fetch all users from the database
#         users = User.objects.all()

#         # Define the serializer inline
#         class UserSerializer(serializers.ModelSerializer):
#             class Meta:
#                 model = User
#                 fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined']
        
#         # Serialize the user data
#         serializer = UserSerializer(users, many=True)

#         # Get the ID and username of the authenticated user
#         authenticated_user_id = request.user.id if request.user.is_authenticated else None
#         authenticated_user_name = request.user.username if request.user.is_authenticated else None

#         # Return the serialized data along with the authenticated user's ID and name
#         response_data = {
#             'authenticated_user_id': authenticated_user_id,
#             'authenticated_user_name': authenticated_user_name,
#             'users': serializer.data
#         }

#         return Response(response_data, status=status.HTTP_200_OK)