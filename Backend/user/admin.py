from django.contrib import admin
from django.contrib.auth import get_user_model

from .models import Supplier, Retailer

# Register your models here.
admin.site.register(get_user_model())
admin.site.register(Supplier)
admin.site.register(Retailer)
