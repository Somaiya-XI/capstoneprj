from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import uuid

AUTH_PROVIDERS = {'email': 'email', 'google': 'google'}


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
    profile_picture = models.ImageField("profile picture", upload_to='profile_imgs/', blank=True, null=True)
    auth_provider = models.CharField(max_length=50, default=AUTH_PROVIDERS.get('email'))

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        SUPPLIER = "SUPPLIER", "Supplier"
        RETAILER = "RETAILER", "Retailer"
        NO_ROLE = 'UNDEFIEND', 'Undefined'

    role = models.CharField(max_length=50, choices=Role.choices, blank=False, null=False)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.role
        return super().save(*args, **kwargs)


class SupplierUserGetter(models.Manager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.SUPPLIER)


class Supplier(User):

    objects = SupplierUserGetter()

    class Meta:
        proxy = True

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = User.Role.SUPPLIER
        return super().save(*args, **kwargs)


class RetailerUserGetter(models.Manager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.RETAILER)


class Retailer(User):

    objects = RetailerUserGetter()

    class Meta:
        proxy = True

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = User.Role.RETAILER
        return super().save(*args, **kwargs)


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
