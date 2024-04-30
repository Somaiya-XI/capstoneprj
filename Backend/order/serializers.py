from rest_framework import serializers
from .models import Order, OrderItem

from product.serializers import ProductCatalogSerializer, OrderProductSerializer
from .cart.serializers import CartItemSerializer
from .cart.models import CartItem

from user.models import Retailer
from product.models import ProductCatalog


class OrderSerializer(serializers.HyperlinkedModelSerializer):
    retailer = serializers.PrimaryKeyRelatedField(queryset=Retailer.objects.all())

    class Meta:
        model = Order
        fields = [
            'order_id',
            'retailer',
            'order_date',
            'payment_method',
            'total_price',
            'shipping_address',
            'payment_session_id',
        ]


class OrderItemSerializer(serializers.HyperlinkedModelSerializer):
    product_id = OrderProductSerializer(read_only=True)
    order_id = serializers.SlugRelatedField(
        slug_field='order_id', queryset=Order.objects.all()
    )

    class Meta:
        model = OrderItem
        fields = ['order_id', 'product_id', 'ordered_quantity', 'item_status']
