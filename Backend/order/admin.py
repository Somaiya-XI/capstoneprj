from django.contrib import admin
from .models import Order, OrderItem
from .cart.models import Cart, CartItem
from .paymentwallet.models import PaymentWallet


class CartAdmin(admin.ModelAdmin):
    readonly_fields = ['total']


class CartItemAdmin(admin.ModelAdmin):
    readonly_fields = ['subtotal']


# Register your models here.
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem, CartItemAdmin)
admin.site.register(PaymentWallet)
