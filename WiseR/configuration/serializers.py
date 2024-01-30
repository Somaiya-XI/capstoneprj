from rest_framework import serializers
from .models import AutoOrderConfig, NotificationConfig


#send data as jason
class AutoOrderConfigSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AutoOrderConfig
        fields = '__all__'

#send data as jason
class NotificationConfigSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = NotificationConfig
        fields = '__all__' 