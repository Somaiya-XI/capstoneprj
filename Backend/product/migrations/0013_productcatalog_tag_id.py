# Generated by Django 5.0.1 on 2024-04-21 20:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0012_productbulk_days_to_expiry'),
    ]

    operations = [
        migrations.AddField(
            model_name='productcatalog',
            name='tag_id',
            field=models.CharField(blank=True, max_length=13, null=True),
        ),
    ]
