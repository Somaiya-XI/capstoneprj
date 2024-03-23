from rest_framework import serializers
from .models import PaymentWallet
from user.models import Retailer


class PaymetWalletSerializer(serializers.HyperlinkedModelSerializer):
    retailer = serializers.PrimaryKeyRelatedField(queryset=Retailer.objects.all())

    class Meta:
        model = PaymentWallet
        fields = ['wallet_id', 'retailer', 'balance']
