from django.db import models

# from product.models import SupermarketProduct
from user.models import Retailer


# Create your models here.
class AutoOrderConfig(models.Model):
    TYPE = [
        ('DEFAULT', 'Default'),
        ('SPECIAL', 'Special'),
    ]

    retailer = models.ForeignKey(
        Retailer, on_delete=models.CASCADE, verbose_name="Retailer"
    )
    type = models.CharField(choices=TYPE, default='DEFAULT', max_length=15)
    qunt_reach_level = models.PositiveIntegerField("Reach Level", default=0)
    ordering_amount = models.PositiveIntegerField("Ordering Amount", default=1)
    confirmation_status = models.BooleanField("Requires Confirmation", default=False)

    class Meta:
        db_table = "Auto Ordering Config"


class NotificationConfig(models.Model):
    # NOTIFICATION_METHODS = [
    #     # ('email', 'Email'),
    #     ('in_app', 'In-App'),
    # ] 
    # Note: Reason why is due to the default in app notifications ..
    retailer = models.ForeignKey(
        Retailer, on_delete=models.CASCADE, verbose_name="Retailer"
    )
    activation_status = models.BooleanField(default=True)
    near_expiry_days = models.IntegerField()
    low_quantity_threshold = models.IntegerField()
    # notification_method = models.CharField(choices=NOTIFICATION_METHODS, max_length=10)

    class Meta:
        db_table = "Notification Config"
        # unique_together = ['retailer', 'notification_method']
