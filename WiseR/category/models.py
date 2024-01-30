from django.db import models

# Create your models here.
class Category(models.Model):
    _name = models.CharField("Name", max_length=50)
    _description = models.CharField("Description", max_length=250)


    def __str__(self):
        return self._name

    class Meta:
        db_table = "Category"