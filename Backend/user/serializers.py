#TODO
#Implement serializer, password hash, token generator, permessions...
#send all data as jason

from rest_framework import serializers
from .models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = '__all__'