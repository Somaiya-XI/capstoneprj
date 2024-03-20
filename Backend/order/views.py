from rest_framework import viewsets
from .serializers import OrderSerializer
from .models import Order

from .cart.models import Cart, CartItem
from .cart.serializers import CartItemSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_order(request):

    data = request.data
    if not data:
        return JsonResponse({'message': 'please send a valid request'}, status=400)

    if request.user.is_authenticated:
        user = request.user
        retailer = user.id
    else:
        return JsonResponse({'message': 'You are not authenticated, log in then try again'}, status=400)

    cart = Cart.objects.filter(user=user).first()

    if not cart:
        return JsonResponse({'message': 'Please fill your cart, then proceed to check out'})

    current_cart_items = CartItem.objects.filter(cart=cart)
    ordered_items = []

    for item in current_cart_items:
        item_serializer = CartItemSerializer(item)
        ordered_item_data = item_serializer.data
        ordered_item_data.pop('cart', None)
        ordered_items.append(ordered_item_data)

    order_serializer = OrderSerializer(
        data={
            'retailer': retailer,
            'payment_method': request.data['payment_method'],
            'total_price': cart.total,
            'order_status': 'processing',
            'shipping_address': request.data['shipping_address'],
            'ordered_items': ordered_items,
        }
    )
    order_serializer.is_valid(raise_exception=True)
    order_serializer.save(ordered_items=current_cart_items)
    response_data = {
        'message': 'Order created successfully.',
        'order': order_serializer.data['order_id'],
        'ordered_items': ordered_items,
        "order_total": order_serializer.data['total_price'],
    }
    return JsonResponse(response_data, status=201)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_order(request):

    order_id = request.data.get('order_id')
    if not order_id:
        return JsonResponse({'message': 'please send a valid request'}, status=400)

    if request.user.is_authenticated:
        user = request.user
    else:
        return JsonResponse({'message': 'You are not authenticated, log in then try again'}, status=400)
    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return JsonResponse({'message': 'Invalid order ID'}, status=400)

    if order.retailer != user:
        return JsonResponse({'message': 'You are not authorized to cancel this order'}, status=403)

    if order.order_status == 'shipped':
        return JsonResponse({'message': 'Cannot cancel a shipped order'}, status=400)

    order.order_status = 'cancelled'
    ##DO REFUND IF POSSIBLE
    order.save()

    return JsonResponse({'message': 'Order cancelled successfully'}, status=200)


# Create your views here.
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
