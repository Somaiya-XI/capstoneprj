from rest_framework import viewsets
from .serializers import OrderSerializer, OrderItemSerializer
from .models import Order, OrderItem
from .cart.models import Cart, CartItem
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse
from .cart.views import calculate_cart_total
from user.models import Retailer, Supplier
import stripe, os
from dotenv import load_dotenv
from django.shortcuts import redirect
from urllib.parse import urlencode
from decimal import *


@csrf_exempt
@permission_classes([AllowAny])
def create_checkout_session(request):

    # collect the data from incoming request
    if request.POST:
        data = request.POST.dict()
        user_id = data.get("user_id")
        shipping_address = data.get("shipping_address")

    # check request data existance
    if not user_id:
        return JsonResponse({'message': 'please send a valid request'})

    if not shipping_address:
        return JsonResponse({'message': 'please send a valid request'})

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse({'message': 'You are not authorized to create an order'})

    # check the user cart existance
    try:
        cart = Cart.objects.get(user=retailer, type='BASIC')
    except:
        return JsonResponse({'message': 'You do not have a cart'})

    # get the current items within the cart
    cart_items = CartItem.objects.filter(cart=cart.cart_id)

    # check the items existance
    if not cart_items:
        return JsonResponse({'message': 'You do not have items in your cart'})

    # load stripe secret key from environment
    load_dotenv()
    stripe.api_key = os.environ['STRIPE_SECRET_KEY']

    # collect each item details needed for processing payments
    items_details = []
    for cart_item in cart_items:
        stripe_product = stripe.Product.retrieve(str(cart_item.product.product_id))
        items_details.append(
            {
                'price': stripe_product.default_price,
                'quantity': cart_item.quantity,
            }
        )

    # construct the query parameters
    query_params = {
        'user': retailer.pk,
        'payment_method': "credit_card",
        'shipping_address': shipping_address,
    }

    # encode the query parameters
    encoded_params = urlencode(query_params)

    # create checkout session object
    checkout_session = stripe.checkout.Session.create(
        line_items=items_details,
        mode='payment',
        success_url=os.environ['SUCCESS_URL']
        + '?session_id={CHECKOUT_SESSION_ID}&'
        + encoded_params,
        cancel_url=os.environ['CANCEL_URL'] + '?canceled=true',
    )

    # redirect the user to stripe payment gateway
    return redirect(checkout_session.url, code=303)


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def validate_checkout_session(request):

    # collect the data from incoming request
    checkout_session_id = request.GET.get('session_id', '')
    user = request.GET.get('user', '')
    payment_method = request.GET.get('payment_method', '')
    shipping_address = request.GET.get('shipping_address', '')

    # check request data existance
    if not checkout_session_id:
        return JsonResponse({'message': 'please send a valid request'})

    if not user:
        return JsonResponse({'message': 'please send a valid request'})

    if not payment_method:
        return JsonResponse({'message': 'please send a valid request'})

    if not shipping_address:
        return JsonResponse({'message': 'please send a valid request'})

    # check whether the checkout session id is used before
    orders = Order.objects.filter(payment_session_id=checkout_session_id)

    if not orders:

        # load stripe secret key from environment
        load_dotenv()
        stripe.api_key = os.environ['STRIPE_SECRET_KEY']

        # retrieve checkout session object
        checkout_session = stripe.checkout.Session.retrieve(
            checkout_session_id,
        )

        # check the cart existance
        try:
            cart = Cart.objects.get(user=user, type='BASIC')
        except Cart.DoesNotExist:
            return JsonResponse({'message': 'You do not have a cart'})

        # check payment process status
        if checkout_session.payment_status == 'paid':

            if (Decimal(checkout_session.amount_total) / Decimal(100)) == Decimal(
                cart.total
            ):

                # create new order
                order_type = 'BASIC'
                order_id = make_order(
                    user,
                    order_type,
                    payment_method,
                    shipping_address,
                    checkout_session_id,
                )

                # construct the query parameters
                query_params = {
                    'order_id': order_id,
                }

                # encode the query parameters
                encoded_params = urlencode(query_params)

                # redirect the user to order summary page
                return redirect(os.environ['ORDER_SUMMARY_URL'] + '?' + encoded_params)

    return JsonResponse({'message': 'payment process failed'})


def make_order(user, order_type, payment_method, shipping_address, payment_session_id):

    # check the cart existance
    try:
        cart = Cart.objects.get(user=user, type=order_type)
    except Cart.DoesNotExist:
        return JsonResponse({'message': 'You do not have a cart'})

    # get the current items within the cart
    current_cart_items = CartItem.objects.filter(cart=cart)

    # check the items existance
    if not current_cart_items:
        return JsonResponse(
            {'message': 'Please fill your cart, then proceed to check out'}
        )

    # create new order using serializer
    order_serializer = OrderSerializer(
        data={
            'retailer': user,
            'payment_method': payment_method,
            'total_price': cart.total,
            'shipping_address': shipping_address,
            'payment_session_id': payment_session_id,
        }
    )

    order_serializer.is_valid(raise_exception=True)
    order_serializer.save()

    # create items using serializer
    for item in current_cart_items:
        item_serializer = OrderItemSerializer(
            data={
                'order_id': order_serializer.data['order_id'],
                'ordered_quantity': item.quantity,
                'item_status': 'processing',
            },
        )
        item_serializer.is_valid(raise_exception=True)
        item_serializer.save(product_id=item.product)

    # clear all items within the user's cart
    cart_items = CartItem.objects.filter(cart=cart)
    cart_items.delete()
    calculate_cart_total(cart)
    cart.save()

    return order_serializer.data['order_id']


@csrf_protect
@api_view(['PUT'])
@permission_classes([AllowAny])
def cancel_ordered_item(request):

    # access the authenticated user
    if request.user.is_anonymous:
        return JsonResponse(
            {'message': 'You are not authenticated, log in then try again'}
        )

    user_id = request.user.id

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse({'message': 'You are not authorized to cancel an order'})

    # collect the data from incoming request
    order_id = request.data.get('order_id')
    product_id = request.data.get('product_id')

    # check request data existance
    if not order_id:
        return JsonResponse({'message': 'please send a valid request'})

    if not product_id:
        return JsonResponse({'message': 'please send a valid request'})

    # check the order existance
    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return JsonResponse({'message': 'Invalid order ID'})

    # authorize the user
    if order.retailer != retailer:
        return JsonResponse(
            {'message': 'You are not authorized to cancel this item from the order'}
        )

    # get the item needed to be cancelled in the order
    try:
        ordered_item = OrderItem.objects.get(order_id=order_id, product_id=product_id)
    except OrderItem.DoesNotExist:
        return JsonResponse({'message': 'The ordered item does not exist'})

    # check the item status is not shipped before cancelation
    if ordered_item.item_status == 'shipped':
        return JsonResponse({'message': 'You can not cancel a shipped order'})

    # change item status
    ordered_item.item_status = 'cancelled'
    ordered_item.save()

    return JsonResponse({'message': 'Ordered item cancelled successfully'}, status=200)


@csrf_protect
@api_view(['PUT'])
@permission_classes([AllowAny])
def update_ordered_item_status(request):

    # access the authenticated user
    if request.user.is_anonymous:
        return JsonResponse(
            {'message': 'You are not authenticated, log in then try again'}
        )

    user_id = request.user.id

    # get the user object
    try:
        supplier = Supplier.objects.get(id=user_id)
    except Supplier.DoesNotExist:
        return JsonResponse(
            {'message': 'You are not authorized to update the item status'}
        )

    # collect the data from incoming request
    order_id = request.data.get('order_id')
    item_status = request.data.get('item_status')

    # check request data existance
    if not order_id:
        return JsonResponse({'message': 'please send a valid request'})

    if not item_status:
        return JsonResponse({'message': 'please send a valid request'})

    # check the order existance
    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return JsonResponse({'message': 'Invalid order ID'})

    # get the items of the order
    ordered_items = OrderItem.objects.filter(order_id=order_id)

    # check the items existance
    if not ordered_items:
        return JsonResponse({'message': 'There are no items to update'})

    # search for the supllier's items and update the status
    supplier_items = []
    for ordered_item in ordered_items:
        if ordered_item.product_id.supplier.pk == supplier.pk:
            ordered_item.item_status = item_status
            ordered_item.save()
            supplier_items.append(ordered_item)

    # authorize the user
    if len(supplier_items) == 0:
        return JsonResponse(
            {'message': 'You are not authorized to update items status of this order'}
        )

    return JsonResponse(
        {'message': 'items status of this order updated successfully'}, status=200
    )


@csrf_protect
@api_view(['GET'])
@permission_classes([AllowAny])
def view_order_summary(request, order_id):

    # access the authenticated user
    if request.user.is_anonymous:
        return JsonResponse(
            {'message': 'You are not authenticated, log in then try again'}
        )

    user_id = request.user.id

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {'message': 'You are not authorized to view the order summary'}
        )

    # check the order existance
    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return JsonResponse({'message': 'Invalid order ID'})

    # authorize the user
    if order.retailer.pk != retailer.pk:
        return JsonResponse(
            {'message': 'You are not authorized to view this order summary'}
        )

    # serialize the order object
    order_serialized = OrderSerializer(order).data

    # get the items of the order
    ordered_items = OrderItem.objects.filter(order_id=order.order_id)

    # check the items existance
    if not ordered_items:
        return JsonResponse({'message': 'The order does not have items'})

    # serialize each item in the order
    ordered_items_serialized = []

    for item in ordered_items:
        item_serialized = OrderItemSerializer(item).data
        item_serialized.pop('order_id', None)
        ordered_items_serialized.append(item_serialized)

    # prepare the response data
    response_data = {
        'order_data': order_serialized,
        'ordered_items': ordered_items_serialized,
    }

    return JsonResponse(response_data, status=200)


@csrf_protect
@api_view(['GET'])
@permission_classes([AllowAny])
def view_orders_history(request):

    # access the authenticated user
    if request.user.is_anonymous:
        return JsonResponse(
            {'message': 'You are not authenticated, log in then try again'}
        )

    user_id = request.user.id

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {'message': 'You are not authorized to view orders history'}
        )

    # get all the orders associated with the user
    orders = Order.objects.filter(retailer=retailer)

    # check the orders existance
    if not orders:
        return JsonResponse({'message': 'You do not have any orders'})

    # serialize each order object
    orders_list = []

    for order in orders:
        order_serialized = OrderSerializer(order).data

        # get the items of the order
        ordered_items = OrderItem.objects.filter(order_id=order.order_id)

        # check the items existance
        if not ordered_items:
            return JsonResponse(
                {'message': 'order ' + order.order_id + ' does not have items'}
            )

        # serialize each item in the order
        ordered_items_serialized = []
        for item in ordered_items:
            item_serialized = OrderItemSerializer(item).data
            item_serialized.pop('order_id', None)
            ordered_items_serialized.append(item_serialized)

        data = {
            'order_data': order_serialized,
            'ordered_items': ordered_items_serialized,
        }

        orders_list.append(data)

    return JsonResponse(orders_list, safe=False, status=200)


@csrf_protect
@api_view(['GET'])
@permission_classes([AllowAny])
def view_supplier_orders(request):

    # access the authenticated user
    if request.user.is_anonymous:
        return JsonResponse(
            {'message': 'You are not authenticated, log in then try again'}
        )

    user_id = request.user.id

    # get the user object
    try:
        supplier = Supplier.objects.get(id=user_id)
    except Supplier.DoesNotExist:
        return JsonResponse({'message': 'You are not authorized to view these orders'})

    # get all the orders objects
    orders = Order.objects.all()

    # prepare orders for serialization
    supplier_orders = []
    for order in orders:
        ordered_items_serialized = []

        # get the items of the order
        ordered_items = OrderItem.objects.filter(order_id=order.order_id)

        # serialize each item in the order
        for ordered_item in ordered_items:

            # search for the supllier's items
            if ordered_item.product_id.supplier.pk == supplier.pk:
                item_serialized = OrderItemSerializer(ordered_item).data
                item_serialized.pop('order_id', None)
                ordered_items_serialized.append(item_serialized)

        # add the order details to the list only if ordered items for the supplier exist
        if len(ordered_items_serialized) != 0:
            order_serialized = OrderSerializer(order).data

            #  get the retailer object
            try:
                retailer = Retailer.objects.get(id=order_serialized['retailer'])
            except Retailer.DoesNotExist:
                return JsonResponse({'message': 'This retailer does not exist'})

            order_data = {
                'order_id': order_serialized['order_id'],
                'retailer': retailer.company_name,
                'order_date': order_serialized['order_date'],
                'total_price': order_serialized['total_price'],
                'shipping_address': order_serialized['shipping_address'],
            }

            data = {
                'order_data': order_data,
                'ordered_items': ordered_items_serialized,
            }

            supplier_orders.append(data)

    return JsonResponse(supplier_orders, safe=False, status=200)


# Create your views here.
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
