from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
import uuid
from product.models import ProductCatalog
from user.models import Retailer


# Create your models here.
class Cart(models.Model):
    cart_id = models.UUIDField(
        default=uuid.uuid4, editable=False, unique=True, primary_key=True
    )
    user = models.ForeignKey(Retailer, on_delete=models.CASCADE)
    products = models.ManyToManyField(ProductCatalog, through='CartItem')
    total = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    class Meta:
        db_table = "Cart"
        unique_together = ('cart_id', 'user')

    def __str__(self):
        return f"{self.user.company_name.capitalize()}'s Cart"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(ProductCatalog, on_delete=models.CASCADE, null=True)
    quantity = models.IntegerField("Quantity", default=1)

    # subtotal = models.DecimalField("Subtotal", max_digits=5, decimal_places=2, default=0)
    @property
    def subtotal(self):
        return self.product.new_price * self.quantity

    def calculate_subtotal(self):
        return self.subtotal

    def __str__(self):
        return f"{self.product} of {self.cart.user.company_name.capitalize()}'s Cart "

    class Meta:
        db_table = "Cart Item"
        unique_together = ('product', 'cart')
