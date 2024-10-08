from django.db import models
import uuid

from user.models import Retailer
from .cart.models import CartItem
from product.models import ProductCatalog


# Create your models here.
class Order(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ("credit_card", "Credit Card"),
        ("wallet", "Wallet"),
    ]

    order_id = models.UUIDField(
        default=uuid.uuid4, editable=False, unique=True, primary_key=True
    )
    retailer = models.ForeignKey(Retailer, on_delete=models.CASCADE)
    order_date = models.DateField("Ordering Date", auto_now_add=True)
    total_price = models.DecimalField("Total Price", max_digits=8, decimal_places=2)
    payment_method = models.CharField(choices=PAYMENT_METHOD_CHOICES, max_length=20)
    shipping_address = models.CharField(max_length=200)
    payment_session_id = models.CharField(max_length=255, unique=True, null=True)

    class Meta:
        db_table = "Order"


class OrderItem(models.Model):
    ITEM_STATUS_CHOICES = [
        ("processing", "Processing"),
        ("ready_for_delivery", "ready for delivery"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    product_id = models.ForeignKey(ProductCatalog, on_delete=models.CASCADE)
    ordered_quantity = models.PositiveIntegerField("Quantity")
    item_status = models.CharField(choices=ITEM_STATUS_CHOICES, max_length=20)

    class Meta:
        db_table = "Order Item"
        unique_together = ('order_id', 'product_id')
