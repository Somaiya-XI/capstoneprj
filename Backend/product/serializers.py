from rest_framework import serializers
from .models import ProductCatalog, SupermarketProduct
from drf_extra_fields.fields import Base64ImageField
from user.models import Supplier
from category.models import Category
from user.serializers import UserSerializer


class ProductCatalogSerializer(serializers.HyperlinkedModelSerializer):
    product_img = Base64ImageField(required=True)
    supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all())
    # supplier = UserSerializer()
    category = serializers.SlugRelatedField(slug_field='name', queryset=Category.objects.all())

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
            'expiry_date',
            'production_date',
        )


class CartProductSerializer(serializers.HyperlinkedModelSerializer):
    unit_price = serializers.DecimalField(source='new_price', max_digits=8, decimal_places=2)

    class Meta:
        model = ProductCatalog
        fields = ['product_id', 'product_name', 'unit_price']


# send all data as jason
class SupermarketProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SupermarketProduct
        fields = '__all__'
