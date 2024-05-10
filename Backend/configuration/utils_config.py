from product.models import ProductCatalog
from order.cart.models import Cart, CartItem

from celery import shared_task
import json
import re
from .models import AutoOrderConfig, NotificationConfig
from .serializers import AutoOrderConfigSerializer, NotificationConfigSerializer
from product.models import SupermarketProduct
from product.serializers import SupermarketProductSerializer
from WiseR.consumers import NotificationManager as notify


def beautify_product_name(product_name):
    match = re.search(r'\b\d', product_name)
    if match:
        index = match.start()
        return product_name[:index].strip()
    else:
        return product_name


@shared_task
def add_to_auto_order_list_task(product_data):

    prod_data = json.loads(product_data)

    config = AutoOrderConfig.objects.get(supermarketproduct=prod_data['product_id'])
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


def quantity_order_config_manager(product, **kwargs):
    order_config = product.order_config

    if order_config and product.quantity <= order_config.qunt_reach_level:
        serialized_product = SupermarketProductSerializer(instance=product)
        serialized_product = json.dumps(serialized_product.data)
        return add_to_auto_order_list_task.delay(serialized_product)


def quantity_notification_config_manager(product, **kwargs):
    try:
        config = NotificationConfig.objects.get(retailer=product.retailer)
        if product.quantity == config.low_quantity_threshold:
            notify.send_notification(
                message=f'''{beautify_product_name(product.product_name)} has reached or 
                fallen below quantity threshold''',
                user_id=product.retailer.pk,
            )
    except NotificationConfig.DoesNotExist:
        return None
