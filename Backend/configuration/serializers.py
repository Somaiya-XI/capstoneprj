from rest_framework import serializers
from .models import AutoOrderConfig, NotificationConfig

from user.models import Retailer


# send data as jason
class AutoOrderConfigSerializer(serializers.HyperlinkedModelSerializer):
    retailer = serializers.PrimaryKeyRelatedField(queryset=Retailer.objects.all())

    class Meta:
        model = AutoOrderConfig
        fields = ['id', 'qunt_reach_level', 'ordering_amount', 'retailer', 'type']


# send data as jason
class NotificationConfigSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = NotificationConfig
        fields = '__all__'
