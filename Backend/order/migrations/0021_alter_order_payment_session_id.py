# Generated by Django 5.0.1 on 2024-05-06 10:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("order", "0020_remove_cart_total"),
    ]

    operations = [
        migrations.AlterField(
            model_name="order",
            name="payment_session_id",
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
    ]
