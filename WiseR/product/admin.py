from django.contrib import admin
from .models import ProductCatalog, SupermarketProduct

# Register your models here.
admin.site.register(ProductCatalog)
admin.site.register(SupermarketProduct)
