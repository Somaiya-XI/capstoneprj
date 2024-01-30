from rest_framework import serializers
from .models import ProductCatalog, SupermarketProduct

#send all data as jason
class ProductCatalogSerializer(serializers.HyperlinkedModelSerializer):
    product_img = serializers.ImageField(max_length=None, allow_empty_file=False, allow_null=True, required=False)
    class Meta:
        model = ProductCatalog
        fields = ('product_name', 'price', 'quantity', 'expiry_date', 'description', 'discount_percentage', 'min_order_quantity', 'production_date', 'product_img')

#send all data as jason
class SupermarketProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SupermarketProduct
        fields = '__all__' 