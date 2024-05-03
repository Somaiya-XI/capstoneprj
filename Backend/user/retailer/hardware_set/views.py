from rest_framework import viewsets
from .serializers import HardwareSetSerializer
from .models import HardwareSet

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.http import JsonResponse
import json


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def create(request):
    if request.user.is_authenticated:
        retailer = request.user.id
        id = request.data['gateway_id']
        print(retailer)
        print(id)
        serializer = HardwareSetSerializer(
            data={
                'retailer': retailer,
                'gateway_id': id,
            }
        )

        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'Device registered successfully.'}, status=201)
        else:
            return JsonResponse(serializer.errors, status=400)

    return JsonResponse({'error': 'you are not authenticated!'}, status=400)


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def get_device(request):
    if request.user.is_authenticated:
        retailer = request.user.id
        print(retailer)
        device = HardwareSet.objects.filter(retailer=retailer).first()
        if device:
            return JsonResponse({'id': device.gateway_id}, status=201)
        else:
            return JsonResponse({'id': None}, status=201)

    return JsonResponse({'error': 'you are not authenticated!'}, status=400)


class HardwareSetViewSet(viewsets.ModelViewSet):
    queryset = HardwareSet.objects.all()
    serializer_class = HardwareSetSerializer
