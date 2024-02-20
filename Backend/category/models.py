from django.db import models


# Create your models here.
class Category(models.Model):
    name = models.CharField("Name", max_length=50)
    description = models.CharField("Description", max_length=250, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "Category"
