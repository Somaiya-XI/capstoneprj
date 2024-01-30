from rest_framework import serializers
from .models import Category

#send all data as jason
class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = '__all__' 