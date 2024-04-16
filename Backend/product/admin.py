from django.contrib import admin
from .models import ProductCatalog, SupermarketProduct, ProductBulk

# Register your models here.
admin.site.register(ProductCatalog)
admin.site.register(SupermarketProduct)
admin.site.register(ProductBulk)
