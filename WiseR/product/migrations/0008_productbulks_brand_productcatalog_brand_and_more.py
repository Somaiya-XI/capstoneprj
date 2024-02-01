# Generated by Django 5.0.1 on 2024-02-01 18:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0007_productbulks_product_img_productcatalog_product_img_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='productbulks',
            name='brand',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Name'),
        ),
        migrations.AddField(
            model_name='productcatalog',
            name='brand',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Name'),
        ),
        migrations.AddField(
            model_name='supermarketproduct',
            name='brand',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Name'),
        ),
    ]
