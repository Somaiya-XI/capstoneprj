# Generated by Django 5.0.1 on 2024-04-24 19:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "configuration",
            "0006_autoorderconfig_retailer_autoorderconfig_type_and_more",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="autoorderconfig",
            name="ordering_amount",
            field=models.IntegerField(default=1, verbose_name="Ordering Amount"),
        ),
    ]
