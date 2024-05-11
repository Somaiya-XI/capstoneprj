from rest_framework import viewsets
from .serializers import HardwareSetSerializer
from .models import HardwareSet

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.http import JsonResponse
import json


@api_view(['POST'])
def create(request):
    try:
        if request.user.is_authenticated:

            # access authenticated user
            retailer = request.user.id

            # access entered gateway id
            id = request.data['gateway_id']

            # create a device using the serializer
            serializer = HardwareSetSerializer(data={'retailer': retailer, 'gateway_id': id})

            if serializer.is_valid():
                serializer.save()
                return JsonResponse({'message': 'Device registered successfully.'}, status=201)
            else:
                return JsonResponse(serializer.errors, status=400)

        return JsonResponse({'error': 'you are not authenticated!'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'something went wrong, err: {e}'}, status=400)


@api_view(['GET'])
def get_device(request):
    if request.user.is_authenticated:

        # access authenticated user
        retailer = request.user.id

        # find the user's device
        device = HardwareSet.objects.filter(retailer=retailer).first()

        if device:
            return JsonResponse({'id': device.gateway_id}, status=201)
        else:
            return JsonResponse({'id': None}, status=201)

    return JsonResponse({'error': 'you are not authenticated!'}, status=400)


class HardwareSetViewSet(viewsets.ModelViewSet):
    queryset = HardwareSet.objects.all()
    serializer_class = HardwareSetSerializer
