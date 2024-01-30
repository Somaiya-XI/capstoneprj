from django.db import models
import uuid
#from user.models import Supplier, Retailer

# Create your models here.
class Order(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('credit_card', 'Credit Card'),
        ('wallet', 'Wallet'),
    ]

    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
    ]

    order_id = models.UUIDField("ID", default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    #retailer_id = models.ForeignKey(Retailer, on_delete=models.CASCADE, verbose_name="Retailer")
    order_date = models.DateField("Ordering Date", auto_now_add=True)
    total_amount = models.DecimalField("Total", max_digits=5, decimal_places=2)
    payment_method = models.CharField(choices=PAYMENT_METHOD_CHOICES, max_length=20)
    order_status = models.CharField(choices=ORDER_STATUS_CHOICES, max_length=20)
    shipping_address = models.CharField(max_length=200)


    class Meta:
        db_table = "Order"
        #unique_together = (('order_id', 'retailer_id')) 

class OrderedItem(models.Model):
    #product_id = models.ManyToManyField(CatalogProduct.id, verbose_name="Product ID")
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE, verbose_name="Order ID")
    ordered_quant = models.IntegerField("Quantity")
    item_status = models.CharField(max_length = 20)
    
    class Meta:
        db_table = "Ordered Item"
        #unique_together = (('order_id', 'product_id')) 
