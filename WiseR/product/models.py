from django.db import models
import uuid
#from user.models import Supplier, Retailer
#from category.models import Category

# Create your models here.

class Product(models.Model):
    product_id = models.UUIDField("ID", default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    product_name = models.CharField("Name", max_length=50)
    price = models.DecimalField("Price", max_digits=5, decimal_places=2)
    quantity = models.IntegerField("Quantity")
    expiry_date = models.DateField("Expiry Date")
    product_img = models.ImageField("Product Image",upload_to='productimgs/' ,blank=True, null=True)

    class Meta:
        abstract = True


class ProductCatalog(Product):
    #brand_name = models.ForeignKey(Supplier, on_delete=models.CASCADE, verbose_name="Brand")
    description = models.CharField("Description", max_length=250)
    #category = models.ForeignKey(Category, "Category", max_length=50)
    discount_percentage = models.DecimalField("Discount %", max_digits=5, decimal_places=2, default=0)
    min_order_quantity = models.IntegerField("Min Allowed", default=1)
    production_date = models.DateField("Production Date")

    def __str__(self):
        return self.product_name

    class Meta:
        db_table = "Product Catalog"


class SupermarketProduct(Product):
    #retailer = models.ForeignKey(Retailer, on_delete=models.CASCADE, verbose_name="Retailer")

    def __str__(self):
        return self.product_name

    class Meta:
        db_table = "Supermarket Product"


class ProductBulks(Product):
    #retailer = models.ForeignKey(Retailer, on_delete=models.CASCADE, verbose_name="Retailer")
    bulk_id = models.IntegerField("Bulk ID")
    #brand_name = models.ForeignKey(Supplier, on_delete=models.CASCADE, verbose_name="Brand")

    def __str__(self):
        return self.product_name
    
    class Meta:
        db_table = "Product Bulk"
        unique_together = (('product_id', 'bulk_id'),)