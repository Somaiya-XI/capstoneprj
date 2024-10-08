# Generated by Django 5.0.1 on 2024-03-16 00:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("paymentwallet", "0002_alter_paymentwallet_balance"),
    ]

    operations = [
        migrations.AlterField(
            model_name="paymentwallet",
            name="balance",
            field=models.DecimalField(
                decimal_places=2, default=0.0, max_digits=8, verbose_name="Balance"
            ),
        ),
    ]
