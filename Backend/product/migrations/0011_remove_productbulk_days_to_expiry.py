# Generated by Django 5.0.1 on 2024-04-21 13:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0010_remove_supermarketproduct_days_to_expiry_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='productbulk',
            name='days_to_expiry',
        ),
    ]
