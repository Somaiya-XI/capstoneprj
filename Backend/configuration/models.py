from django.db import models

# from product.models import SupermarketProduct
from user.models import Retailer


# Create your models here.
class AutoOrderConfig(models.Model):
    CONFIRMATION_STATUS = [
        ('required', 'Required'),
        ('not_required', 'Not Required'),
    ]
    # product = models.ForeignKey(SupermarketProduct, on_delete=models.CASCADE)
    qunt_reach_level = models.IntegerField("Reach Level", default=0)
    ordering_amount = models.IntegerField("Ordering Amount")
    confirmation_status = models.BooleanField("Requires Confirmation", default=False)
    # auto_order_time = models.TimeField("Ordering Time")

    class Meta:
        db_table = "Auto Ordering Config"


class NotificationConfig(models.Model):
    NOTIFICATION_METHODS = [
        ('email', 'Email'),
        ('in_app', 'In-App'),
    ]

    retailer = models.ForeignKey(Retailer, on_delete=models.CASCADE, verbose_name="Retailer")
    activation_status = models.BooleanField(default=True)
    near_expiry_days = models.IntegerField()
    low_quantity_threshold = models.IntegerField()
    notification_method = models.CharField(choices=NOTIFICATION_METHODS, max_length=10)

    class Meta:
        db_table = "Notification Config"
        unique_together = ['retailer', 'notification_method']
