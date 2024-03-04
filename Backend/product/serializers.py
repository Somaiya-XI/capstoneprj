from rest_framework import serializers
from .models import ProductCatalog, SupermarketProduct
from drf_extra_fields.fields import Base64ImageField
from user.models import Supplier
from category.models import Category


class ProductCatalogSerializer(serializers.HyperlinkedModelSerializer):
    product_img = Base64ImageField(required=True)
    supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all())
    category = serializers.SlugRelatedField(slug_field='name', queryset=Category.objects.all())

    class Meta:
        model = ProductCatalog
        fields = '__all__'


class CartProductSerializer(serializers.HyperlinkedModelSerializer):
    unit_price = serializers.DecimalField(source='price', max_digits=8, decimal_places=2)

    class Meta:
        model = ProductCatalog
        fields = ['product_id', 'product_name', 'unit_price']


# send all data as jason
class SupermarketProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SupermarketProduct
        fields = '__all__'
