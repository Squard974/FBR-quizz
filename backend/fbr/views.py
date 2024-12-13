from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Athlete, CustomUser, Game

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from .serializers import GameSerializer, CustomUserSerializer
from django.db.utils import IntegrityError

#get all users
def user_list(request):
    users = CustomUser.objects.all()
    data = [
        {"id": user.id, "username": user.username, "email": user.email, "is_staff": user.is_staff}
        for user in users
    ]
    return JsonResponse(data, safe=False)

#get user per id
def user_detail(request, id):
    user = get_object_or_404(CustomUser, id=id)
    data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_staff": user.is_staff,
        "date_joined": user.date_joined,
    }
    return JsonResponse(data)

#get all all athletes
def athlete_list(request):
    athletes = Athlete.objects.all()
    data = [{"id": athlete.id, "name": athlete.name, "sport": athlete.sport} for athlete in athletes]
    return JsonResponse(data, safe=False)

#get athlete per id
def athlete_detail(request, id):
    athlete = get_object_or_404(Athlete, id=id)
    data = {
        "id": athlete.id,
        "name": athlete.name,
        "sport": athlete.sport,
        "nationality": athlete.nationality,
        "team": athlete.team,
        "position": athlete.position,
        "age": athlete.age,
    }
    return JsonResponse(data)

#get all games
def game_list(request):
    games = Game.objects.all()
    data = [
        {"id": game.id, "sport": game.sport, "created_at": game.created_at, "user_id": game.user.id}
        for game in games
    ]
    return JsonResponse(data, safe=False)

#get game per id
def game_detail(request, id):
    game = get_object_or_404(Game, id=id)
    data = {
        "id": game.id,
        "sport": game.sport,
        "created_at": game.created_at,
        "user": {
            "id": game.user.id,
            "username": game.user.username,
        },
    }
    return JsonResponse(data)










# Création d'un utilisateur
class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email")
        username = request.data.get("username")
        password = request.data.get("password")
        bio = request.data.get("bio", "")
        avatar = request.data.get("avatar", None)
        
        if not email or not username or not password:
            return Response({"error": "Email, username, et password sont requis."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = CustomUser.objects.create_user(
                email=email, 
                username=username, 
                password=password, 
                bio=bio, 
                avatar=avatar
            )
            return Response({"message": "Utilisateur créé avec succès."}, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({"error": "Email ou username déjà utilisé."}, status=status.HTTP_400_BAD_REQUEST)


# Connexion d'un utilisateur
class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email et password sont requis."}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, email=email, password=password)
        if user is not None:
            return Response({"message": "Connexion réussie."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Identifiants invalides."}, status=status.HTTP_401_UNAUTHORIZED)


# Création d'une partie
class CreateGameView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        players_ids = request.data.get("players", [])
        score = request.data.get("score", {})

        if not players_ids:
            return Response({"error": "Au moins un joueur est requis."}, status=status.HTTP_400_BAD_REQUEST)

        players = CustomUser.objects.filter(id__in=players_ids)
        if players.count() != len(players_ids):
            return Response({"error": "Certains utilisateurs n'existent pas."}, status=status.HTTP_400_BAD_REQUEST)

        game = Game.objects.create(score=score)
        game.players.set(players)
        game.save()

        return Response({"message": "Partie créée avec succès.", "game_id": game.id}, status=status.HTTP_201_CREATED)
