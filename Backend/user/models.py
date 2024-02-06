from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.auth.models import Permission, User, Group
from django.db.models.signals import post_save
from django.dispatch import receiver
import uuid


# Create your models here.
class User(AbstractUser):
    username = None
    company_name = models.CharField(max_length=20, blank=False, null=False)
    email = models.EmailField(max_length=250, unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    commercial_reg = models.ImageField(
        "commercial register",
        upload_to='comm_reg_imgs/',
        blank=False,
        null=False,
        default='000',
    )
    profile_picture = models.ImageField(
        "profile picture", upload_to='profile_imgs/', blank=True, null=True
    )
    session_token = models.CharField(max_length=10, default=0)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        SUPPLIER = "SUPPLIER", "Supplier"
        RETAILER = "RETAILER", "Retailer"

    role = models.CharField(
        max_length=50, choices=Role.choices, blank=False, null=False
    )

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.role
        return super().save(*args, **kwargs)
    # # group = Group.objects.get(username='')
    # user.groups.add()


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
    supplier_id = models.UUIDField(
        "Supplier ID", default=uuid.uuid4, editable=False, unique=True, primary_key=True
    )


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

    schedule_id = models.UUIDField(
        "ID", default=uuid.uuid4, editable=False, unique=True, primary_key=True
    )
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
    retailer_id = models.UUIDField(
        "Retailer ID", default=uuid.uuid4, editable=False, unique=True, primary_key=True
    )


@receiver(post_save, sender=Retailer)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == "RETAILER":
        RetailerProfile.objects.create(user=instance)

# @receiver(models.signals.post_migrate)
# class CustomUserPermissions:
#     class Meta:
#         permissions = (
#             ("view_all_users", "Can view all users"),
#             ("edit_all_users", "Can edit all users"),
#             ("delete_users", "Can delete users"),

#         )
#         user = User.objects.get(username='admin')
#         view_all_users_permission = Permission.objects.get(codename='view_all_users')
#         edit_all_users_permission = Permission.objects.get(codename='edit_all_users')
#         delete_users_permission = Permission.objects.get(codename='delete_users')

#         user.user_permissions.add(view_all_users_permission)
#         user.user_permissions.add(edit_all_users_permission)
#         user.user_permissions.add(delete_users_permission)
#         user.save()
        
# user = User.objects.get(username='Admin')
# print(user.get_all_permissions())


