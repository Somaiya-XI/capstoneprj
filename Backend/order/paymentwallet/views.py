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


# Create your views here.


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def view_wallet_balance(request, id):
    retailer = Retailer.objects.get(id=id)
    payment_wallet = PaymentWallet.objects.get_or_create(retailer=retailer)
    return JsonResponse({'payment_wallet': payment_wallet[0].balance})


@csrf_exempt
@api_view(['PUT'])
@permission_classes([AllowAny])
def charge_wallet(request):
    id = request.data.get('retailer')
    amount = request.data.get('amount')
    retailer = Retailer.objects.get(id=id)
    payment_wallet = PaymentWallet.objects.get_or_create(retailer=retailer)
    payment_wallet[0].balance = Decimal(payment_wallet[0].balance) + Decimal(amount)
    payment_wallet[0].save()
    return JsonResponse({'payment_wallet': payment_wallet[0].balance})


@csrf_exempt
@api_view(['PUT'])
@permission_classes([AllowAny])
def pay_by_wallet(request):
    id = request.data.get('retailer')
    cart = Cart.objects.get(user=id)
    amount = cart.total
    payment_wallet = PaymentWallet.objects.get(retailer=id)
    payment_wallet.balance = Decimal(payment_wallet.balance) - Decimal(amount)
    if payment_wallet.balance < 0:
        return JsonResponse(
            {'error': 'you do not have enough balance, please recharge your wallet', 'success': False}
        )
    payment_wallet.save()
    return JsonResponse({'payment_wallet': payment_wallet.balance, 'success': True})


class PaymentWalletViewSet(viewsets.ModelViewSet):
    queryset = PaymentWallet.objects.all()
    serializer_class = PaymetWalletSerializer
    permission_classes = [AllowAny]
