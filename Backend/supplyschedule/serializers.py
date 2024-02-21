from rest_framework import serializers
from .models import SupplyingSchedule


# send all data as jason
class ScheduleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SupplyingSchedule
        fields = '__all__'
