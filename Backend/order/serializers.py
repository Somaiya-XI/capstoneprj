from rest_framework import serializers
from .models import Order

from product.serializers import ProductCatalogSerializer
from .cart.serializers import CartItemSerializer

from user.models import Retailer


class OrderSerializer(serializers.HyperlinkedModelSerializer):
    ordered_items = CartItemSerializer(many=True, read_only=True)
    retailer = serializers.PrimaryKeyRelatedField(queryset=Retailer.objects.all())

    class Meta:
        model = Order
        fields = [
            'order_id',
            'retailer',
            'order_date',
            'payment_method',
            'total_price',
            'order_status',
            'shipping_address',
            'ordered_items',
        ]
