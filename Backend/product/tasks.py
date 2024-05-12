from celery import shared_task
from django.db.models import F
import json

from .signals import date_updated

from .models import AutoOrderConfig
from order.cart.models import Cart, CartItem
from .models import SupermarketProduct, ProductBulk, ProductCatalog


@shared_task
def add_to_auto_order_list_task(product_data):

    # access data
    prod_data = json.loads(product_data)

    # get product object and configuration
    config = AutoOrderConfig.objects.get(supermarketproduct=prod_data['product_id'])
    product = SupermarketProduct.objects.get(pk=prod_data['product_id'])

    # check if given product is available for ordering
    catalog_prods = ProductCatalog.objects.filter(tag_id=product.tag_id)

    if not catalog_prods:
        return 'this product is not currently available for auto-orders'

    # get the retailer's smart cart
    cart, _ = Cart.objects.get_or_create(user=product.retailer, type='SMART')
    # get the least price if product has multible suppliers
    prod = min(catalog_prods, key=lambda product: product.new_price)
    # add product to the cart if it is not already in cart
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=prod)

    if not created:
        return 'already in cart!'
    # add the configured quantity in cart if it not exeeding the stock
    cart_item.quantity = config.ordering_amount if prod.quantity >= config.ordering_amount else prod.quantity
    cart_item.save()
    return 'item added to auto-order list!'


@shared_task
def reduce_days_to_expiry(self):
    ProductBulk.objects.filter(days_to_expiry__gt=0).update(days_to_expiry=F('days_to_expiry') - 1)
    date_updated.send(sender=self.reduce_days_to_expiry)
