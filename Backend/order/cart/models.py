from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
import uuid
from product.models import ProductCatalog
from user.models import Retailer


# Create your models here.
class Cart(models.Model):
    cart_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    user = models.ForeignKey(Retailer, on_delete=models.CASCADE)
    products = models.ManyToManyField(ProductCatalog, through='CartItem')
    total = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    class Meta:
        db_table = "Cart"
        unique_together = ('cart_id', 'user')


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(ProductCatalog, on_delete=models.CASCADE, null=True)
    quantity = models.IntegerField("Quantity", default=1)
    subtotal = models.DecimalField("Subtotal", max_digits=5, decimal_places=2, default=0)

    class Meta:
        db_table = "Cart Item"
        unique_together = ('product', 'cart')

    def save(self, *args, **kwargs):
        if self.product:
            if self.product.discount_percentage:
                discount = 1 - (self.product.discount_percentage / 100)
                self.subtotal = self.product.price * self.quantity * discount
            else:
                self.subtotal = self.product.price * self.quantity
        else:
            self.subtotal = 0
        super().save(*args, **kwargs)


@receiver([post_save, post_delete], sender=CartItem)
def update_cart_total(sender, instance, **kwargs):
    cart = instance.cart
    total_price = cart.cartitem_set.aggregate(total_price=models.Sum('subtotal'))['total_price']
    cart.total = total_price if total_price else 0
    cart.save()
