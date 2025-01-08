from django.contrib import admin
from .models import CustomUser, Athlete, Game

admin.site.register(CustomUser)
admin.site.register(Athlete)
admin.site.register(Game)
