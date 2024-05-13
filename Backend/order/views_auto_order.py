from .tasks import make_auto_order
from .cart.models import Cart
from .cart.serializers import CartSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse
from user.models import Retailer, Supplier
import json


@csrf_protect
@api_view(['POST'])
@permission_classes([AllowAny])
def make_auto_order(request):

    # access the authenticated user
    if request.user.is_anonymous:
        return JsonResponse(
            {'error': 'You are not authenticated, log in then try again'}
        )

    user_id = request.user.id

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Supplier.DoesNotExist:
        return JsonResponse({'error': 'You are not authorized to confirm this order'})

    # get the smart cart object
    try:
        cart = Cart.objects.get(user=retailer, type='SMART')
    except Cart.DoesNotExist:
        return JsonResponse({'message': 'The items does not exist'})

    # serialize the cart object
    cart_serialized = CartSerializer(cart)
    cart_serialized = json.dumps(cart_serialized.data)

    confirmation = True
    confirmation = json.dumps(confirmation)

    make_auto_order.delay(cart_serialized, confirmation)
