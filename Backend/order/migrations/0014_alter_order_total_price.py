# Generated by Django 5.0.1 on 2024-04-12 02:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("order", "0013_remove_order_order_status"),
    ]

    operations = [
        migrations.AlterField(
            model_name="order",
            name="total_price",
            field=models.DecimalField(
                decimal_places=2, max_digits=5, verbose_name="Total Price"
            ),
        ),
    ]
