from django.db import models
import uuid

from user.models import Supplier, Retailer

from .category.models import Category
from decimal import Decimal
from configuration.models import AutoOrderConfig

# Create your models here.


class Product(models.Model):
    product_id = models.UUIDField("ID", default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    product_name = models.CharField("Name", max_length=50)
    price = models.DecimalField("Price", max_digits=5, decimal_places=2)
    quantity = models.IntegerField("Quantity")
    brand = models.CharField("Brand", max_length=50, blank=True, null=True)
    tag_id = models.CharField(max_length=13, blank=True, null=True)

    class Meta:
        abstract = True


class ProductCatalog(Product):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, verbose_name="Supplier")
    product_img = models.ImageField("Product Image", upload_to='catalogImgs/', blank=False, null=False)
    description = models.CharField("Description", max_length=250, blank=True, null=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        verbose_name="Category",
        max_length=50,
        null=True,
    )
    discount_percentage = models.DecimalField(
        "Discount %",
        max_digits=5,
        decimal_places=2,
        default=0,
    )
    min_order_quantity = models.IntegerField("Min Allowed", default=1)

    @property
    def new_price(self):
        discount_percentage = self.discount_percentage or 0
        price = self.price or 0
        return Decimal(price - (price * (discount_percentage / Decimal(100))))

    def __str__(self):
        return self.product_name

    class Meta:
        db_table = "Product Catalog"


class SupermarketProduct(Product):
    retailer = models.ForeignKey(Retailer, on_delete=models.CASCADE, verbose_name="Retailer")
    product_img = models.ImageField("Product Image", upload_to='marketProductImgs/', blank=True, null=True)
    order_config = models.ForeignKey(AutoOrderConfig, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.product_name} of {self.retailer.company_name}"

    class Meta:
        db_table = "Supermarket Product"
        unique_together = (('tag_id', 'retailer'),)


class ProductBulk(models.Model):
    product = models.ForeignKey(SupermarketProduct, on_delete=models.CASCADE)
    expiry_date = models.DateField("Expiry Date", null=False, blank=False)
    bulk_qyt = models.IntegerField()
    days_to_expiry = models.IntegerField()

    def __str__(self):
        return f"{self.product.product_name} bulk of {self.product.retailer.company_name}"

    class Meta:
        db_table = "Product Bulk"
        unique_together = (('id', 'product'),)
