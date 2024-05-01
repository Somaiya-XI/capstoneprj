from rest_framework import serializers
from .models import SupplyingSchedule
from user.models import Supplier


# send all data as jason
class ScheduleSerializer(serializers.HyperlinkedModelSerializer):
    supplier_id = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all())

    class Meta:
        model = SupplyingSchedule
        fields = ['id', 'time', 'day', 'supplier_id']
