from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from drf_extra_fields.fields import Base64ImageField
from .models import User, Supplier
import re


class UserSerializer(serializers.HyperlinkedModelSerializer):
    commercial_reg = Base64ImageField(required=False)
    profile_picture = Base64ImageField(required=False)

    def validate_password(self, value):
        errors = []
        if len(value) < 8:
            errors.append('Password must be at least 8 characters long.')
        if not any(char.isupper() for char in value):
            errors.append('Password must contain at least one uppercase letter.')
        if not any(char.islower() for char in value):
            errors.append('Password must contain at least one lowercase letter.')
        if not any(char.isdigit() for char in value):
            errors.append('Password must contain at least one digit.')
        if errors:
            raise ValidationError(errors)
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        email = validated_data.get("email")
        commercial_reg = validated_data.get('commercial_reg')
        provider = validated_data.get('provider')

        if provider == 'email' and commercial_reg is None:
            raise ValidationError('Commercial Register is required')

        if not re.match('^[\w\.\+\-]+@[\w]+\.[a-z]{2,3}$', email):
            raise ValidationError('Please enter a valid email address')

        if password is not None:

            validated_data['password'] = self.validate_password(password)
            instance = self.Meta.model(**validated_data)
            instance.set_password(password)
        if provider == 'email':
            instance.is_active = False

        instance.save()
        return instance

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'old_password' or attr == "password":
                # old_password = validated_data.pop('old_password', None)
                # if old_password != instance.password:
                #     raise ValidationError('Please enter the correct password')
                # new_password = validated_data.pop('new_password', None)
                # validated_password = self.validate_password(new_password)
                # confirmed_password = validated_data.pop('confirm_password', None)
                # if validated_password != confirmed_password:
                #     raise ValidationError('please enter the same password again')
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance

    class Meta:
        model = User
        extra_kwargs = {'password': {'write_only': True}}
        fields = [
            'id',
            'company_name',
            'email',
            'password',
            'phone',
            'address',
            'commercial_reg',
            'role',
            'profile_picture',
            'session_token',
            'auth_provider',
            'is_authenticated',
            "is_active",
        ]
