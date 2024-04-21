from rest_framework import viewsets
from .serializers import PaymetWalletSerializer
from .models import PaymentWallet
from user.models import Retailer
from order.cart.models import Cart
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from decimal import Decimal
import os
from dotenv import load_dotenv
from django.shortcuts import redirect
from urllib.parse import urlencode
from order.views import make_order

# Create your views here.


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def view_wallet_balance(request, id):

    # access the authenticated user
    # if request.user.is_authenticated:
    #     user = request.user
    #     retailer = user.id
    # else:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    # get the user object
    try:
        retailer = Retailer.objects.get(id=id)
    except Retailer.DoesNotExist:
        return JsonResponse({'message': 'please send a valid request'})

    # get the user payment wallet or create a new one if it doesn't exist
    payment_wallet = PaymentWallet.objects.get_or_create(retailer=retailer)

    return JsonResponse({'payment_wallet': payment_wallet[0].balance}, status=200)


@csrf_exempt
@api_view(['PUT'])
@permission_classes([AllowAny])
def charge_wallet(request):

    # access the authenticated user
    # if request.user.is_authenticated:
    #     user = request.user
    #     retailer = user.id
    # else:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    # collect the data from incoming request
    id = request.data.get('retailer')
    amount = request.data.get('amount')

    # check request data existance
    if not id:
        return JsonResponse({'message': 'please send a valid request'})

    if not amount:
        return JsonResponse({'message': 'please send a valid request'})

    # get the user object
    try:
        retailer = Retailer.objects.get(id=id)
    except Retailer.DoesNotExist:
        return JsonResponse({'message': 'please send a valid request'})

    # get the user payment wallet or create a new one if it doesn't exist
    payment_wallet = PaymentWallet.objects.get_or_create(retailer=retailer)

    # update the wallet balance
    payment_wallet[0].balance = Decimal(payment_wallet[0].balance) + Decimal(amount)
    payment_wallet[0].save()

    return JsonResponse({'payment_wallet': payment_wallet[0].balance}, status=200)


@csrf_exempt
@api_view(['PUT'])
@permission_classes([AllowAny])
def pay_by_wallet(request):

    # access the authenticated user
    # if request.user.is_authenticated:
    #     user = request.user
    #     retailer = user.id
    # else:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    # collect the data from incoming request
    user = request.data.get('retailer')
    shipping_address = request.data.get('shipping_address')

    # check request data existance
    if user == '':
        return JsonResponse({'message': 'please send a valid request'})

    if shipping_address == '':
        return JsonResponse({'message': 'please send a valid request'})

    # check user cart existance
    try:
        cart = Cart.objects.get(user=user)
    except Retailer.DoesNotExist:
        return JsonResponse({'message': 'You do not have a cart'})

    # get the total price to pay
    amount = cart.total

    # get the user payment wallet or create a new one if it doesn't exist
    payment_wallet = PaymentWallet.objects.get_or_create(retailer=user)

    # update the payment wallet balance
    payment_wallet[0].balance = Decimal(payment_wallet[0].balance) - Decimal(amount)
    if payment_wallet[0].balance < 0:
        return JsonResponse(
            {
                'error': 'you do not have enough balance, please recharge your wallet',
                'success': False,
            }
        )
    payment_wallet[0].save()

    # create new order
    payment_method = 'wallet'
    order_id = make_order(user, payment_method, shipping_address)

    # # construct the query parameters
    # query_params = {
    #     'order_id': order_id,
    # }

    # # encode the query parameters
    # encoded_params = urlencode(query_params)

    # # redirect the user to order summary page
    # load_dotenv()
    # return redirect(os.environ['ORDER_SUMMARY_URL'] + '?' + encoded_params)

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
