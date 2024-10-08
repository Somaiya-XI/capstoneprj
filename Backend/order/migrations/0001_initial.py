# Generated by Django 5.0.1 on 2024-01-29 21:19

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('order_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True, verbose_name='ID')),
                ('order_date', models.DateField(auto_now_add=True, verbose_name='Ordering Date')),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=5, verbose_name='Total')),
                ('payment_method', models.CharField(choices=[('credit_card', 'Credit Card'), ('wallet', 'Wallet')], max_length=20)),
                ('order_status', models.CharField(choices=[('pending', 'Pending'), ('processing', 'Processing'), ('shipped', 'Shipped'), ('delivered', 'Delivered')], max_length=20)),
                ('shipping_address', models.CharField(max_length=200)),
            ],
            options={
                'db_table': 'Order',
            },
        ),
        migrations.CreateModel(
            name='OrderedItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ordered_quant', models.IntegerField(verbose_name='Quantity')),
                ('item_status', models.CharField(max_length=20)),
                ('order_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='order.order', verbose_name='Order ID')),
            ],
            options={
                'db_table': 'Ordered Item',
            },
        ),
    ]
