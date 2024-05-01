from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
import uuid
from product.models import ProductCatalog
from user.models import Retailer


# Create your models here.
class Cart(models.Model):
    CART_TYPE = [
        ("BASIC", "BASIC"),
        ("SMART", "SMART"),
    ]
    cart_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    user = models.ForeignKey(Retailer, on_delete=models.CASCADE)
    products = models.ManyToManyField(ProductCatalog, through='CartItem')
    # total = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    type = models.CharField(choices=CART_TYPE, max_length=20, default='BASIC')

    @property
    def total(self):
        total = 0
        for item in self.cartitem_set.all():
            total += item.subtotal
        return total

    class Meta:
        db_table = "Cart"
        unique_together = ('type', 'user')

    def __str__(self):
        return f"{self.type.capitalize()} Cart of {self.user.company_name.capitalize()} Retailer"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(ProductCatalog, on_delete=models.CASCADE, null=True)
    quantity = models.IntegerField("Quantity", default=1)

    # subtotal = models.DecimalField("Subtotal", max_digits=5, decimal_places=2, default=0)
    @property
    def subtotal(self):
        return self.product.new_price * self.quantity

    def __str__(self):
        return f"{self.product} of {self.cart.user.company_name.capitalize()}'s {self.cart.type.capitalize()} Cart "

    class Meta:
        db_table = "Cart Item"
        unique_together = ('product', 'cart')
