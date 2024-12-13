from django.urls import path
from . import views
from .views import RegisterView, LoginView, CreateGameView

urlpatterns = [
    # Routes pour les utilisateurs
    path('users/', views.user_list, name='user_list'),
    path('users/<int:id>/', views.user_detail, name='user_detail'),

    # Routes pour les parties
    path('games/', views.game_list, name='game_list'),
    path('games/<int:id>/', views.game_detail, name='game_detail'),

    # Routes pour les sportifs
    path('athletes/', views.athlete_list, name='athlete_list'),  # Lister les sportifs
    path('athletes/<int:id>/', views.athlete_detail, name='athlete_detail'),  # Détails d'un sportif

    path('register/', RegisterView.as_view(), name='register'),  # Création d'un utilisateur
    path('login/', LoginView.as_view(), name='login'),           # Connexion d'un utilisateur
    path('games/create/', CreateGameView.as_view(), name='create_game'),  # Création d'une partie
    
]
