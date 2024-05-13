from celery import shared_task
from .cart.models import Cart, CartItem
from .cart.serializers import CartSerializer
from configuration.models import AutoOrderConfig
from product.models import SupermarketProduct, ProductBulk, ProductCatalog
from .paymentwallet.models import PaymentWallet
from WiseR.consumers import send_confirmation
from .views import make_order
import json


@shared_task
def make_auto_order(cart, **kwargs):

    # access data
    cart_id = cart.get('cart_id')

    # get the retailer's smart cart
    cart_data = Cart.objects.get(cart_id=cart_id)

    # get items associated with the cart
    cart_items = CartItem.objects.filter(cart=cart_data)

    if len(cart_items) > 0:

        # check the user confirmation
        confirmation = False

        if 'confirmation' not in kwargs or not kwargs['confirmation']:

            try:
                # get auto order configuration object
                default_config = AutoOrderConfig.objects.get(retailer=cart_data.user)

                # search for products that does not require confirmation from the user
                if default_config.confirmation_status == False:
                    confirmation = True

            except AutoOrderConfig.DoesNotExist:
                pass

        # create the auto order only if the user confirmed
        if confirmation == True or json.loads(kwargs['confirmation']) == True:
            try:
                # get payment wallet object
                payment_wallet = PaymentWallet.objects.get(retailer=cart_data.user)
            except PaymentWallet.DoesNotExist:
                return 'Insufficient Balance!'

            # check the wallet balance
            if payment_wallet.balance >= cart_data.total:

                # create the order
                total_cost = cart_data.total
                order_type = 'SMART'
                payment_method = 'wallet'
                payment_session_id = None
                shipping_address = cart_data.user.address if any else " "
                result = make_order(
                    cart_data.user.pk,
                    order_type,
                    payment_method,
                    shipping_address,
                    payment_session_id,
                )
                if result == 'success':
                    # update the payment wallet balance after order created successfuly
                    payment_wallet.balance -= total_cost
                    payment_wallet.save()

                    return 'auto order created successfuly'

        # ask the user for confirmation
        send_confirmation('confirmation required', cart_data.user.pk, 'confirm_auto_order')


@shared_task
def execute_make_auto_order():

    # get all smart carts
    carts = Cart.objects.filter(type='SMART')

    if not carts:
        return 'No auto order available Today'

    # iterate over all carts
    for cart in carts:

        # serialize the cart for celery worker
        cart_serialized = CartSerializer(cart)
        cart_serialized = json.dumps(cart_serialized.data)

        # execute the 'make auto order' using celery worker
        make_auto_order.delay(cart_serialized)

    return 'auto order done!'
