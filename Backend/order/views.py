from rest_framework import viewsets
from .serializers import OrderSerializer, OrderItemSerializer
from .models import Order, OrderItem

from .cart.models import Cart, CartItem
from .cart.serializers import CartItemSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .cart.views import calculate_cart_total

import stripe, os
from dotenv import load_dotenv
from django.shortcuts import redirect
from urllib.parse import urlencode


@csrf_exempt
# @api_view(['POST'])
@permission_classes([AllowAny])
def create_checkout_session(request):

    # access the authenticated user
    # if request.user.is_authenticated:
    #     user = request.user
    #     retailer = user.id
    # else:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    # collect the data from incoming request
    if request.POST:
        data = request.POST.dict()
        shipping_address = data.get("shipping_address")

    # check request data existance
    if not shipping_address:
        return JsonResponse({'message': 'please send a valid request'})

    user = '17'

    # check the user cart existance
    try:
        cart = Cart.objects.get(user=user)
    except:
        return JsonResponse({'message': 'You do not have cart'})

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
        'user': user,
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
    if checkout_session_id == '':
        return JsonResponse({'message': 'please send a valid request'})

    if user == '':
        return JsonResponse({'message': 'please send a valid request'})

    if payment_method == '':
        return JsonResponse({'message': 'please send a valid request'})

    if shipping_address == '':
        return JsonResponse({'message': 'please send a valid request'})

    # load stripe secret key from environment
    load_dotenv()
    stripe.api_key = os.environ['STRIPE_SECRET_KEY']

    # retrieve checkout session object
    checkout_session = stripe.checkout.Session.retrieve(
        checkout_session_id,
    )

    # check payment process status
    if checkout_session.payment_status == 'paid':

        # create new order
        order_id = make_order(user, payment_method, shipping_address)

        # construct the query parameters
        query_params = {
            'order_id': order_id,
        }

        # encode the query parameters
        encoded_params = urlencode(query_params)

        # redirect the user to order summary page
        load_dotenv()
        return redirect(os.environ['ORDER_SUMMARY_URL'] + '?' + encoded_params)

    return JsonResponse({'message': 'payment process failed'})


def make_order(user, payment_method, shipping_address):

    # check the cart existance
    try:
        cart = Cart.objects.get(user=user)
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
            # 'retailer': retailer,
            'retailer': user,
            'payment_method': payment_method,
            'total_price': cart.total,
            'shipping_address': shipping_address,
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


@csrf_exempt
@api_view(['PUT'])
# @permission_classes([IsAuthenticated])
@permission_classes([AllowAny])
def cancel_ordered_item(request):

    # access the authenticated user
    # if request.user.is_authenticated:
    #     user = request.user
    #     retailer = user.id
    # else:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

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
    # if order.retailer != user:
    #     return JsonResponse({'message': 'You are not authorized to cancel this item from the order'})

    # get the item needed to be cancelled in the order
    try:
        ordered_item = OrderItem.objects.get(order_id=order_id, product_id=product_id)
    except OrderItem.DoesNotExist:
        return JsonResponse({'message': 'The ordered item does not exist'})

    # check the item status is not shipped before cancelation
    if ordered_item.item_status == 'shipped':
        return JsonResponse({'message': 'Cannot cancel a shipped order'})

    # change item status
    ordered_item.item_status = 'cancelled'
    ordered_item.save()

    return JsonResponse({'message': 'Ordered item cancelled successfully'}, status=200)


@csrf_exempt
@api_view(['PUT'])
# @permission_classes([IsAuthenticated])
@permission_classes([AllowAny])
def update_ordered_item_status(request):

    # access the authenticated user
    # if request.user.is_authenticated:
    #     user = request.user
    #     supplier = user.id
    # else:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    user = 3

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
        if ordered_item.product_id.supplier.pk == user:
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


@csrf_exempt
@api_view(['GET'])
# @permission_classes([IsAuthenticated])
@permission_classes([AllowAny])
def view_order_summary(request, order_id):

    # access the authenticated user
    # if request.user.is_authenticated:
    #     user = request.user
    #     retailer = user.id
    # else:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    user = 17

    # check the order existance
    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return JsonResponse({'message': 'Invalid order ID'})

    # authorize the user
    if order.retailer.pk != user:
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


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def view_orders_history(request):

    # access the authenticated user
    # if request.user.is_authenticated:
    #     user = request.user
    #     retailer = user.id
    # else:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    id = 17

    # get all the orders associated with the user
    orders = Order.objects.filter(retailer=id)

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


# Create your views here.
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
