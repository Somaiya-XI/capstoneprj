from product.models import ProductCatalog
from order.cart.models import Cart, CartItem

from celery import shared_task
import json

from .models import AutoOrderConfig
from product.models import SupermarketProduct


@shared_task
def add_to_auto_order_list_task(config_data, product_data):
    conf_data = json.loads(config_data)
    prod_data = json.loads(product_data)

    config = AutoOrderConfig.objects.get(pk=conf_data['id'])
    product = SupermarketProduct.objects.get(pk=prod_data['product_id'])

    catalog_prods = ProductCatalog.objects.filter(tag_id=product.tag_id)

    if not catalog_prods:
        return 'this product is not currently available for auto-orders'

    cart, _ = Cart.objects.get_or_create(user=product.retailer, type='SMART')
    prod = min(catalog_prods, key=lambda product: product.new_price)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=prod)

    if not created:
        return 'already in cart!'
    cart_item.quantity = config.ordering_amount if prod.quantity >= config.ordering_amount else prod.quantity
    cart_item.save()
    return 'item added to auto-order list!'
