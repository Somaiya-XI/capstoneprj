from django.db import models
from user.models import Retailer
import uuid


# Create your models here.
class PaymentWallet(models.Model):
    wallet_id = models.UUIDField(
        default=uuid.uuid4, editable=False, unique=True, primary_key=True
    )
    retailer = models.OneToOneField(
        Retailer, on_delete=models.CASCADE, verbose_name="Retailer"
    )
    balance = models.DecimalField(
        "Balance", default="0.00", max_digits=8, decimal_places=2
    )

    class Meta:
        db_table = "Payment Wallet"

    def __str__(self):
        return f"{self.retailer.company_name.capitalize()}'s Payment Wallet"
