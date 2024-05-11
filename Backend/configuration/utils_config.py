import json
import re

from .models import NotificationConfig
from product.tasks import add_to_auto_order_list_task

from product.serializers import SupermarketProductSerializer
from WiseR.consumers import NotificationManager as notify


# a method to clean the names for the notification
def beautify_product_name(product_name):
    match = re.search(r'\b\d', product_name)
    if match:
        index = match.start()
        return product_name[:index].strip()
    else:
        return product_name


def quantity_order_config_manager(product, **kwargs):
    order_config = product.order_config
    # check if product has a configuration and reached threshold
    if order_config and product.quantity <= order_config.qunt_reach_level:
        # serialize the product for celery worker
        serialized_product = SupermarketProductSerializer(instance=product)
        serialized_product = json.dumps(serialized_product.data)
        # execute the 'add to list' using celery worker
        return add_to_auto_order_list_task.delay(serialized_product)


def quantity_notification_config_manager(product, **kwargs):
    try:
        # get the notification configuration of the retailer
        config = NotificationConfig.objects.get(retailer=product.retailer)
        # check if reached low quantity threshold
        if product.quantity == config.low_quantity_threshold:
            # notify the user
            notify.send_notification(
                message=f'''{beautify_product_name(product.product_name)} has reached or 
                fallen below quantity threshold''',
                user_id=product.retailer.pk,
            )
    except NotificationConfig.DoesNotExist:
        return None
