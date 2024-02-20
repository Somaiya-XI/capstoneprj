from rest_framework import serializers
from .models import ProductCatalog, SupermarketProduct
from drf_extra_fields.fields import Base64ImageField
from user.models import Supplier
from category.models import Category


class ProductCatalogSerializer(serializers.HyperlinkedModelSerializer):
    product_img = Base64ImageField(required=True)
    supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all())
    category = serializers.SlugRelatedField(
        slug_field='name', queryset=Category.objects.all()
    )

    class Meta:
        model = ProductCatalog
        fields = '__all__'


# send all data as jason
class SupermarketProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SupermarketProduct
        fields = '__all__'
