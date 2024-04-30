from rest_framework import viewsets
from .serializers import PaymetWalletSerializer
from .models import PaymentWallet
from user.models import Retailer
from order.cart.models import Cart
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_protect
from decimal import Decimal
from order.views import make_order


# Create your views here.


@csrf_protect
@api_view(['GET'])
@permission_classes([AllowAny])
def view_wallet_balance(request):

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
            {'message': 'You are not authorized to view the wallet balance'}
        )

    # get the user payment wallet or create a new one if it doesn't exist
    payment_wallet = PaymentWallet.objects.get_or_create(retailer=retailer)

    return JsonResponse({'payment_wallet': payment_wallet[0].balance}, status=200)


@csrf_protect
@api_view(['PUT'])
@permission_classes([AllowAny])
def charge_wallet(request):

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
            {'message': 'You are not authorized to charge the payment wallet'}
        )

    # collect the data from incoming request
    amount = request.data.get('amount')

    # check request data existance
    if not amount:
        return JsonResponse({'message': 'please send a valid request'})

    # get the user payment wallet or create a new one if it doesn't exist
    payment_wallet = PaymentWallet.objects.get_or_create(retailer=retailer)

    # update the wallet balance
    payment_wallet[0].balance = Decimal(payment_wallet[0].balance) + Decimal(amount)
    payment_wallet[0].save()

    return JsonResponse({'payment_wallet': payment_wallet[0].balance}, status=200)


@csrf_protect
@api_view(['PUT'])
@permission_classes([AllowAny])
def pay_by_wallet(request):

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
            {'message': 'You are not authorized to pay using the payment wallet'}
        )

    # collect the data from incoming request
    shipping_address = request.data.get('shipping_address')
    order_type = request.data.get('order_type')

    # check request data existance
    if not shipping_address:
        return JsonResponse({'message': 'please send a valid request'})

    if not order_type:
        return JsonResponse({'message': 'please send a valid request'})

    # check user cart existance
    try:
        cart = Cart.objects.get(user=retailer, type=order_type)
    except Retailer.DoesNotExist:
        return JsonResponse({'message': 'You do not have a cart'})

    # get the total price to pay
    amount = cart.total

    if amount == 0.00:
        return JsonResponse({'message': 'You do not have items in your cart'})

    # get the user payment wallet or create a new one if it doesn't exist
    payment_wallet = PaymentWallet.objects.get_or_create(retailer=retailer)

    # update the payment wallet balance
    payment_wallet[0].balance = Decimal(payment_wallet[0].balance) - Decimal(amount)
    if payment_wallet[0].balance < 0:
        return JsonResponse(
            {
                'error': 'You do not have enough balance, please recharge your wallet',
                'success': False,
            }
        )
    payment_wallet[0].save()

    # create new order
    payment_method = 'wallet'
    order_id = make_order(retailer.pk, order_type, payment_method, shipping_address)

    return JsonResponse(
        {
            'payment_wallet': payment_wallet[0].balance,
            'success': True,
            'order_id': order_id,
        }
    )


class PaymentWalletViewSet(viewsets.ModelViewSet):
    queryset = PaymentWallet.objects.all()
    serializer_class = PaymetWalletSerializer
    permission_classes = [AllowAny]
