from django.contrib import admin
from .models import ProductCatalog, SupermarketProduct, ProductBulk


class ProductCatalogAdmin(admin.ModelAdmin):
    readonly_fields = ['new_price']


admin.site.register(ProductCatalog, ProductCatalogAdmin)
admin.site.register(SupermarketProduct)
admin.site.register(ProductBulk)
