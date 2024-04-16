from rest_framework import serializers
from .models import HardwareSet
from user.models import Retailer


class HardwareSetSerializer(serializers.HyperlinkedModelSerializer):
    retailer = serializers.PrimaryKeyRelatedField(queryset=Retailer.objects.all())

    class Meta:
        model = HardwareSet
        fields = ['gateway_id', 'retailer']
