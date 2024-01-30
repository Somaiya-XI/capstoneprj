from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver
import uuid


# Create your models here.
class User(AbstractUser):
    company_name  = models.CharField(max_length=20)
    #email = models.EmailField(max_length=250, unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    #commercial_reg = models.ImageField("reg img")

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        SUPPLIER = "SUPPLIER", "Supplier"
        RETAILER = "RETAILER", "Retailer"

    base_role = Role.ADMIN

    role = models.CharField(max_length=50, choices=Role.choices)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
            return super().save(*args, **kwargs)


class SupplierUserGetter(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.SUPPLIER)

class Supplier(User):
    
    base_role = User.Role.SUPPLIER
    supplier = SupplierUserGetter()
    
    class Meta:
        proxy = True



@receiver(post_save, sender=Supplier)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == "SUPPLIER":
        SupplierProfile.objects.create(user=instance)


class SupplierProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    supplier_id = models.UUIDField("Supplier ID", default=uuid.uuid4, editable=False, unique=True, primary_key=True)

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

    schedule_id = models.UUIDField("ID", default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    supplier_id = models.ForeignKey(SupplierProfile, on_delete=models.CASCADE)
    day = models.CharField(choices=WEEKDAY_CHOICES, max_length=3)
    time = models.TimeField()



class RetailerUserGetter(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.RETAILER)


class Retailer(User):

    base_role = User.Role.RETAILER
    retailer = RetailerUserGetter()
    
    class Meta:
        proxy = True



class RetailerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    retailer_id = models.UUIDField("Retailer ID", default=uuid.uuid4, editable=False, unique=True, primary_key=True)


@receiver(post_save, sender=Retailer)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == "RETAILER":
        RetailerProfile.objects.create(user=instance)