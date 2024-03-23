# Generated by Django 5.0.1 on 2024-03-19 12:11

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0008_remove_cartitem_subtotal'),
        ('user', '0006_alter_user_session_token'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='ordered_items',
            field=models.ManyToManyField(to='order.cartitem'),
        ),
        migrations.AddField(
            model_name='order',
            name='retailer',
            field=models.ForeignKey(default=7, on_delete=django.db.models.deletion.CASCADE, to='user.retailer'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='order',
            name='order_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='order_status',
            field=models.CharField(choices=[('processing', 'Processing'), ('ready_for_delivery', 'ready for delivery'), ('shipped', 'Shipped'), ('delivered', 'Delivered')], max_length=20),
        ),
    ]
