from product.models import ProductCatalog
from order.cart.models import Cart, CartItem

from celery import shared_task
import json

from .models import AutoOrderConfig, NotificationConfig
from .serializers import AutoOrderConfigSerializer, NotificationConfigSerializer
from product.models import SupermarketProduct
from product.serializers import SupermarketProductSerializer
from WiseR.consumers import NotificationManager as notify


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


def quantity_order_config_manager(product, **kwargs):
    order_config = product.order_config

    if order_config and product.quantity <= order_config.qunt_reach_level:
        serialized_order_config = AutoOrderConfigSerializer(instance=order_config)
        serialized_product = SupermarketProductSerializer(instance=product)
        serialized_order_config = json.dumps(serialized_order_config.data)
        serialized_product = json.dumps(serialized_product.data)
        add_to_auto_order_list_task.delay(serialized_order_config, serialized_product)


def quantity_notification_config_manager(product, **kwargs):
    try:
        config = NotificationConfig.objects.get(retailer=product.retailer)
        print('found config', config.pk)
        if product.quantity <= config.low_quantity_threshold:
            print('raeched threshold will Notify ', product.retailer.pk)
            notify.send_notification(
                message=f'Product {product.product_name} quantity has reached or fallen below threshold level. Current quantity: {product.quantity}',
                user_id=product.retailer.pk,
            )
    except NotificationConfig.DoesNotExist:
        return None
