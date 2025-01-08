from rest_framework import serializers
from .models import CustomUser, Game

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'bio', 'avatar', 'elo']

class GameSerializer(serializers.ModelSerializer):
    players = CustomUserSerializer(many=True, read_only=True)  # Les joueurs seront affichés comme des objets sérialisés

    class Meta:
        model = Game
        fields = ['id', 'players', 'date', 'score']
