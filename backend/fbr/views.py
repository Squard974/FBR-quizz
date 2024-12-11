from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Athlete


def athlete_list(request):
    athletes = Athlete.objects.all()
    data = [{"id": athlete.id, "name": athlete.name, "sport": athlete.sport} for athlete in athletes]
    return JsonResponse(data, safe=False)

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