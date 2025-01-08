from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

# Manager pour CustomUser
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'utilisateur doit avoir une adresse email.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if not extra_fields.get('is_staff'):
            raise ValueError('Le superutilisateur doit avoir is_staff=True.')
        if not extra_fields.get('is_superuser'):
            raise ValueError('Le superutilisateur doit avoir is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

# Modèle utilisateur personnalisé
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    elo = models.IntegerField(default=0)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

# Modèle Sportif (Athlete)
class Athlete(models.Model):
    name = models.CharField(max_length=255)
    sport = models.CharField(max_length=100)
    nationality = models.CharField(max_length=100, null=True, blank=True)
    team = models.CharField(max_length=255, null=True, blank=True)
    position = models.CharField(max_length=100, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    photo = models.ImageField(upload_to='athletes_photos/', null=True, blank=True)

    def __str__(self):
        return self.name

# Modèle Partie (Game)
class Game(models.Model):
    players = models.ManyToManyField(CustomUser, related_name='games')  # Joueurs participant à la partie
    date = models.DateTimeField(auto_now_add=True)
    score = models.JSONField(default=dict)

    def __str__(self):
        return f"Game on {self.date}"
