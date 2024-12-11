from django.urls import path
from . import views

urlpatterns = [
    path('athletes/', views.athlete_list, name='athlete_list'),  # Lister les sportifs
    path('athletes/<int:id>/', views.athlete_detail, name='athlete_detail'),  # Détails d'un sportif
]
