# Generated by Django 5.0.1 on 2024-04-15 19:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0004_supermarketproduct_tag_id'),
        ('user', '0006_alter_user_session_token'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='supermarketproduct',
            unique_together={('tag_id', 'retailer')},
        ),
    ]
