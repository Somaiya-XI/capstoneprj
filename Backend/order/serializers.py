from rest_framework import serializers
from .models import Order

#send all data as jason
class OrderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Order
        fields = '__all__' #can choose some fields not all
