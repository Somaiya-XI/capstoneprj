from django.shortcuts import render
from rest_framework import viewsets
from .serializers import AutoOrderConfigSerializer, NotificationConfigSerializer
from .models import AutoOrderConfig, NotificationConfig



# Create your views here.
class AutoOrderConfigViewSet(viewsets.ModelViewSet) :
    queryset = AutoOrderConfig.objects.all()
    serializer_class = AutoOrderConfigSerializer


class NotificationConfigViewSet(viewsets.ModelViewSet) :
    queryset = NotificationConfig.objects.all()
    serializer_class = NotificationConfigSerializer
