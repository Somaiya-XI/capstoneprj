from rest_framework import viewsets
from .serializers import ScheduleSerializer
from .models import SupplyingSchedule


# Create your views here.
class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = SupplyingSchedule.objects.all()
    serializer_class = ScheduleSerializer
