from rest_framework import viewsets
from .serializers import ScheduleSerializer
from .models import SupplyingSchedule
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

import json


@api_view(['POST'])
def add_schedule_entry(request):
    try:
        if request.user.is_anonymous:
            return JsonResponse({'message': 'You are not authenticated, log in then try again'})

        data = request.data

        # add the authenticated user as supplier
        if request.user.is_authenticated:
            data['supplier_id'] = request.user.id
        else:
            return JsonResponse({'error': 'You are not authenticated, log in then try again'})

        # create the schedule using the serializer
        serializer = ScheduleSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'Schedule created successfully.'})
        else:
            return JsonResponse(serializer.errors)
    except Exception as e:
        return JsonResponse({'error': f'something went wrong, err: {e}'}, status=400)


@api_view(['POST'])
def remove_schedule_entry(request):

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


@api_view(['PUT'])
def update_schedule_entry(request):
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

    serializer = ScheduleSerializer(schedule, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'message': 'Schedule updated successfully.'})
    else:
        return JsonResponse(serializer.errors)


@api_view(['GET'])
def view_supplier_schedule(request, supplier_id):
    try:
        schedules = SupplyingSchedule.objects.filter(supplier_id=supplier_id)
        response_data = []

        for schedule in schedules:
            schedule_serializer = ScheduleSerializer(instance=schedule)
            response_data.append(schedule_serializer.data)

        return JsonResponse(response_data, safe=False)
    except Exception as e:
        return JsonResponse({'error': f'something went wrong, err: {e}'}, status=400)


# Create your views here.
class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = SupplyingSchedule.objects.all()
    serializer_class = ScheduleSerializer
