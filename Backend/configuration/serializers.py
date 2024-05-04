from rest_framework import serializers
from .models import AutoOrderConfig, NotificationConfig

from user.models import Retailer


# send data as json
class AutoOrderConfigSerializer(serializers.HyperlinkedModelSerializer):
    retailer = serializers.PrimaryKeyRelatedField(queryset=Retailer.objects.all())

    class Meta:
        model = AutoOrderConfig
        fields = [
            'id',
            'qunt_reach_level',
            'ordering_amount',
            'confirmation_status',
            'retailer',
            'type',
        ]


# send data as json
class NotificationConfigSerializer(serializers.HyperlinkedModelSerializer):
     retailer = serializers.PrimaryKeyRelatedField(queryset=Retailer.objects.all())
     class Meta:
        model = NotificationConfig
        fields = [
            'activation_status',
            'near_expiry_days',
            'low_quantity_threshold',
        ]
        fields = '__all__'
