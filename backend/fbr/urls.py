from django.urls import path
from . import views
from .views import get_user_profile
from .views import RegisterView, LoginView, CreateGameView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Routes pour les utilisateurs
    path('profile/', get_user_profile, name='get_user_profile'),

    path('users/', views.user_list, name='user_list'),
    path('users/<int:id>/', views.user_detail, name='user_detail'),
    path('ladder/', views.top_players_ladder, name='top_players_ladder'), # Obtenir les 10 meilleurs joueurs selon l'elo


    # Routes pour les parties
    path('games/', views.game_list, name='game_list'),
    path('games/<int:id>/', views.game_detail, name='game_detail'),

    # Routes pour les sportifs
    path('athletes/', views.athlete_list, name='athlete_list'),  # Lister les sportifs
    path('athletes/<int:id>/', views.athlete_detail, name='athlete_detail'),  # Détails d'un sportif
    path('athletes/random/<str:sport>/', views.random_athletes_by_sport, name='random_athletes_by_sport'), # Obtenir 10 sportifs aléatoires selon le sport


    path('register/', RegisterView.as_view(), name='register'),  # Création d'un utilisateur
    path('login/', LoginView.as_view(), name='login'),           # Connexion d'un utilisateur
    path('games/create/', CreateGameView.as_view(), name='create_game'),  # Création d'une partie

    # JWT Authentication
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Obtenir un token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Rafraîchir un token
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)