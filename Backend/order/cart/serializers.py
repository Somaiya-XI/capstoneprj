from rest_framework import serializers
from .models import Cart, CartItem
from product.serializers import CartProductSerializer, ProductCatalogSerializer
from product.models import ProductCatalog
from user.models import Retailer


class CartItemSerializer(serializers.HyperlinkedModelSerializer):
    product = CartProductSerializer(read_only=True)
    cart = serializers.SlugRelatedField(slug_field='cart_id', queryset=Cart.objects.all())

    class Meta:
        model = CartItem
        fields = ('cart', 'product', 'quantity', 'subtotal')


class CartSerializer(serializers.HyperlinkedModelSerializer):
    products = CartProductSerializer(many=True, read_only=True)
    user = serializers.SlugRelatedField(slug_field='email', queryset=Retailer.objects.all())

    class Meta:
        model = Cart
        fields = ['cart_id', 'user', 'products', 'total']
