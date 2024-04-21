from rest_framework import serializers
from .models import ProductCatalog, SupermarketProduct
from drf_extra_fields.fields import Base64ImageField
from user.models import Supplier, Retailer
from category.models import Category
from user.serializers import UserSerializer


class ProductCatalogSerializer(serializers.HyperlinkedModelSerializer):
    product_img = Base64ImageField(required=True)
    supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all())
    # supplier = UserSerializer()
    category = serializers.SlugRelatedField(
        slug_field='name', queryset=Category.objects.all()
    )

    class Meta:
        model = ProductCatalog
        fields = (
            'product_id',
            'product_name',
            'product_img',
            'description',
            'category',
            'brand',
            'supplier',
            'price',
            'discount_percentage',
            'new_price',
            'quantity',
            'min_order_quantity',
        )


class CartProductSerializer(serializers.HyperlinkedModelSerializer):
    unit_price = serializers.DecimalField(
        source='new_price', max_digits=8, decimal_places=2
    )

    class Meta:
        model = ProductCatalog
        fields = ['product_id', 'product_name', 'unit_price']


class OrderProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProductCatalog
        fields = ['product_id', 'product_name', 'new_price']


# send all data as jason
class SupermarketProductSerializer(serializers.HyperlinkedModelSerializer):
    retailer = serializers.PrimaryKeyRelatedField(queryset=Retailer.objects.all())

    class Meta:
        model = SupermarketProduct
        fields = [
            'retailer',
            'product_id',
            'product_name',
            'brand',
            'price',
            'quantity',
            'product_img',
        ]


class SupermarketSpecialSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SupermarketProduct
        fields = ['product_id', 'product_name', 'quantity', ' days_to_expiry']
