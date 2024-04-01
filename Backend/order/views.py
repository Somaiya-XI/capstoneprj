from rest_framework import viewsets
from .serializers import OrderSerializer
from .models import Order

from .cart.models import Cart, CartItem
from .cart.serializers import CartItemSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .cart.views import calculate_cart_total


@csrf_exempt
@api_view(['POST'])
# you can change it to AllowAny for testing, [IsAuthenticated] works even with postman
# @permission_classes([IsAuthenticated])
@permission_classes([AllowAny])
def make_order(request):
    # collect the data from incoming request
    # data = request.data
    # if not data:
    #     return JsonResponse({'message': 'please send a valid request'})
    # access the authenticated user
    # if request.user.is_authenticated:
    #     user = request.user
    #     retailer = user.id
    # else:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})
    # get the user's cart
    user= 17
    cart = Cart.objects.filter(user=user).first()

    # check the cart existance
    if not cart:
        return JsonResponse({'message': 'Please fill your cart, then proceed to check out'})

    # get the current items within the cart
    current_cart_items = CartItem.objects.filter(cart=cart)

    # check the items existance
    if not current_cart_items:
        return JsonResponse({'message': 'Please fill your cart, then proceed to check out'})

    ordered_items = []

    # prepare items for serialization
    for item in current_cart_items:
        item_serializer = CartItemSerializer(item)
        ordered_item_data = item_serializer.data
        ordered_item_data.pop('cart', None)
        ordered_items.append(ordered_item_data)

    # add the items and request data as the order fields
    order_serializer = OrderSerializer(
        data={
            # 'retailer': retailer,
            'retailer': user,
            'payment_method': request.data['payment_method'],
            'total_price': cart.total,
            'order_status': 'processing',
            'shipping_address': request.data['shipping_address'],
            # 'ordered_items': ordered_items,
            'ordered_items': current_cart_items,
        }
    )

    order_serializer.is_valid(raise_exception=True)
    # create order and pass the items to serializer to be added as ordered_items field
    # order_serializer.save(ordered_items=current_cart_items)
    order_serializer.save()
    response_data = {
        'message': 'Order created successfully.',
        'order': order_serializer.data['order_id'],
        'ordered_items': ordered_items,
        "order_total": order_serializer.data['total_price'],
    }
    # clear all items within the user's cart
    # cart_items = CartItem.objects.filter(cart=cart)
    # cart_items.delete()
    calculate_cart_total(cart)
    cart.save()
    return JsonResponse(response_data, status=201)


@csrf_exempt
@api_view(['POST'])
# @permission_classes([IsAuthenticated])
@permission_classes([AllowAny])
def cancel_order(request):

    # order_id = request.data.get('order_id')
    # if not order_id:
    #     return JsonResponse({'message': 'please send a valid request'})

    # if request.user.is_authenticated:
    #     user = request.user
    # else:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})
    order_id = "cff6e98d-629a-4cde-8c29-cd46965409e8"
    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return JsonResponse({'message': 'Invalid order ID'})

    # if order.retailer != user:
    #     return JsonResponse({'message': 'You are not authorized to cancel this order'})

    if order.order_status == 'shipped':
        return JsonResponse({'message': 'Cannot cancel a shipped order'})

    order.order_status = 'cancelled'
    order.save()

    return JsonResponse({'message': 'Order cancelled successfully'}, status=200)


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def view_orders_history(request, id):
    orders = Order.objects.filter(retailer=id)
    if not orders:
        return JsonResponse({'message': 'You do not have any orders'})
    orders_list = []
    for order in orders:
        order_serialized = OrderSerializer(order)
        orders_list.append(order_serialized.data)
    return JsonResponse(orders_list, safe=False, status=200)


# Create your views here.
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
