from django.db import models
from user.models import Retailer


class HardwareSet(models.Model):
    gateway_id = models.CharField(max_length=10)
    retailer = models.ForeignKey(Retailer, on_delete=models.CASCADE)

    class Meta:
        db_table = "HardwareSet"

    def __str__(self):
        return f"gateway {self.gateway_id}"
