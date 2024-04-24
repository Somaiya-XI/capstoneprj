from django.contrib import admin
from .models import Order, OrderItem
from .cart.models import Cart, CartItem
from .paymentwallet.models import PaymentWallet


# Register your models here.
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(PaymentWallet)
