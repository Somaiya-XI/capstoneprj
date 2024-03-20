from rest_framework import viewsets
from .serializers import ScheduleSerializer
from .models import SupplyingSchedule
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

import json


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def create_schedule(request):
    if request.user.is_anonymous:
        return JsonResponse({'message': 'You are not authenticated, log in then try again'})
 
    data = request.data
 
    if request.user.is_authenticated:
        data['supplier_id'] = request.user.id
        print(data)
    else:
        return JsonResponse({'error': 'You are not authenticated, log in then try again'})

    serializer = ScheduleSerializer(data=data)
 
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'message': 'Schedule created successfully.'})
    else:
        return JsonResponse(serializer.errors)

@csrf_exempt
def remove_schedule(request):
    # check if Django server recognizes the
    # CSRF as authenticated user's token
    if request.user.is_anonymous:
        return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    # collect data from body
    data = json.loads(request.body)
    id = data.get('id')

    # check if a schedule with the passed id exists
    try:
        schedule = SupplyingSchedule.objects.get(pk=id)
    except SupplyingSchedule.DoesNotExist:
        return JsonResponse({'error': 'Schedule does not exist'})

    # check if the schedule belongs to the supplier requesting the delete
    if schedule.supplier_id != request.user:
        return JsonResponse({'message': 'You are not authorized to delete this schedule'})

    # delete the schedule
    schedule.delete()
    return JsonResponse({'message': 'Schedule deleted'})


# Create your views here.
class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = SupplyingSchedule.objects.all()
    serializer_class = ScheduleSerializer
