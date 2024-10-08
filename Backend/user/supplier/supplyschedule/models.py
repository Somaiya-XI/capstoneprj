from django.db import models
import uuid
from user.models import Supplier


# Create your models here.
class SupplyingSchedule(models.Model):

    WEEKDAY_CHOICES = [
        ('mon', 'Monday'),
        ('tue', 'Tuesday'),
        ('wed', 'Wednesday'),
        ('thu', 'Thursday'),
        ('fri', 'Friday'),
        ('sat', 'Saturday'),
        ('sun', 'Sunday'),
    ]

    supplier_id = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    day = models.CharField(choices=WEEKDAY_CHOICES, max_length=3)
    time = models.TimeField()
