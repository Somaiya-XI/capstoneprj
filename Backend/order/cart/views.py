from rest_framework import viewsets
from .serializers import CartSerializer, CartItemSerializer
from .models import Cart, CartItem
from product.models import ProductCatalog
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from product.models import ProductCatalog
from product.serializers import ProductCatalogSerializer

from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.db.models import Sum
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
import json
from django.middleware.csrf import get_token
from django.conf import settings
from django.shortcuts import redirect
import stripe, os
from dotenv import load_dotenv


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def add_to_cart(request):
    if request.user.is_anonymous:
        return JsonResponse({'message': 'You cannot add to cart'})
    user = request.user
    print('got user: ', user)
    product_id = request.data.get('product_id')
    print('got id: ', product_id)

    quantity = request.data.get('quantity')
    print('got quant: ', quantity)

    product = get_object_or_404(ProductCatalog, product_id=product_id)

    cart = Cart.objects.filter(user=user).first()

    cart_serializer = CartSerializer(data={'user': user})
    cart_serializer.is_valid(raise_exception=True)

    if not cart:
        cart = cart_serializer.save()
    else:
        cart_serializer.instance = cart
        cart_serializer.save()

    print('got cart: ', cart.cart_id)
    cart_item = CartItem.objects.filter(cart=cart, product=product).first()
    print('got ITEM,: ', cart_item)

    if cart_item:
        if int(quantity) <= product.quantity:
            cart_item.quantity = int(quantity)
            cart_item.save()
            cart_item_serializer = CartItemSerializer(instance=cart_item)
            message = 'Cart item updated'
        else:
            message = f'Over the stock, you cannot add more than  {product.quantity} piece of this item'
            cart_item_serializer = None
    else:
        cart_item_serializer = CartItemSerializer(
            data={
                'cart': cart.cart_id,
                'product': product.product_id,
                'quantity': quantity,
            }
        )
        cart_item_serializer.is_valid(raise_exception=True)
        cart_item = cart_item_serializer.save(product=product)
        message = 'Product added to cart'

    calculate_cart_total(cart)
    cart.save()

    response_data = {
        'message': message,
        'cart_item': cart_item_serializer.data if cart_item_serializer else [],
        'cart': cart_serializer.data,
    }

    return JsonResponse(response_data)


@csrf_protect
@require_POST
def remove_from_cart(request):
    data = json.loads(request.body)
    headers = request.META

    print(data)
    csrf_token = headers.get('HTTP_X_CSRFTOKEN')

    print(request.user, 'trying to logg in')
    print(csrf_token, 'is the current token')
    user = request.user
    print('got user: ', user)

    product_id = data.get('product_id')

    print('got id: ', product_id)

    product = get_object_or_404(ProductCatalog, product_id=product_id)

    cart = Cart.objects.filter(user=user).first()

    if cart:
        cart_item = CartItem.objects.filter(cart=cart, product=product).first()

        if cart_item:
            cart_item.delete()
            calculate_cart_total(cart)
            cart.save()
            return JsonResponse({'message': 'Product removed from cart'})
        else:
            return JsonResponse({'message': 'Product not found in cart'})
    else:
        return JsonResponse(
            {
                'message': 'Cart not found',
            }
        )


def calculate_cart_total(cart):
    total_price = sum(item.subtotal for item in cart.cartitem_set.all())
    cart.total = total_price or 0
    cart.save()


@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def view_cart(request):

    if request.user.is_anonymous:
        return JsonResponse({'message': 'You must be logged in to get a cart'})

    user = request.user

    cart = Cart.objects.filter(user=user).first()

    if not cart:
        return JsonResponse({'message': 'You have no cart'})

    cart_items = CartItem.objects.filter(cart=cart)

    response_data = {
        'cart': cart.cart_id,
        'products': [],
        'total': cart.total,
    }

    for cart_item in cart_items:
        product = cart_item.product
        product_serializer = ProductCatalogSerializer(instance=product)

        item_data = {
            'product_id': product.product_id,
            'name': product.product_name,
            'unit_price': product.new_price,
            'quantity': cart_item.quantity,
            'image': product.product_img.url if product.product_img else None,
            'subtotal': cart_item.subtotal,
            'stock': product.quantity,
            'min_qyt': product.min_order_quantity,
        }

        response_data['products'].append(item_data)
    resp = JsonResponse(response_data)
    resp['X-CSRFToken'] = get_token(request)
    print('csrf in cart method', resp['X-CSRFToken'])
    return resp


@csrf_protect
@require_POST
def clear_cart(request):
    headers = request.META

    csrf_token = headers.get('HTTP_X_CSRFTOKEN')

    user = request.user

    cart = Cart.objects.filter(user=user).first()

    if cart:
        cart_items = CartItem.objects.filter(cart=cart)
        cart_items.delete()
        calculate_cart_total(cart)
        cart.save()
        return JsonResponse({'message': 'Cart cleared'})
    else:
        return JsonResponse({'message': 'Cart not found'})


load_dotenv()
stripe.api_key = os.environ['STRIPE_SECRET_KEY']


@csrf_exempt
def create_checkout_session(request):
    # user = request.user.id
    # cart = Cart.objects.filter(user=user)
    # cart_items = CartItem.objects.filter(cart=cart.cart_id)
    # items_details = []
    # for cart_item in cart_items:
    #     items_details.append(
    #         {
    #             'price': cart_item.product.product_id,
    #             'quantity': cart_item.quantity,
    #         }
    #     )
    checkout_session = stripe.checkout.Session.create(
        # line_items=items_details,
        line_items=[
            {
                'price': 'price_1OsWPPHFxZqMmcOBoEwYzFmN',
                'quantity': 4,
            },
            {
                'price': 'price_1OswRSHFxZqMmcOBqoxrN7T4',
                'quantity': 3,
            },
        ],
        mode='payment',
        success_url=os.environ['URL'] + '?success=true',
        cancel_url=os.environ['URL'] + '?canceled=true',
    )
    return redirect(checkout_session.url, code=303)


load_dotenv()
stripe.api_key = os.environ['STRIPE_SECRET_KEY']


@csrf_exempt
def create_checkout_session(request):
    # user = request.user.id
    # cart = Cart.objects.filter(user=user)
    # cart_items = CartItem.objects.filter(cart=cart.cart_id)
    # items_details = []
    # for cart_item in cart_items:
    #     items_details.append(
    #         {
    #             'price': cart_item.product.product_id,
    #             'quantity': cart_item.quantity,
    #         }
    #     )
    checkout_session = stripe.checkout.Session.create(
        # line_items=items_details,
        line_items=[
            {
                'price': 'price_1OsWPPHFxZqMmcOBoEwYzFmN',
                'quantity': 4,
            },
            {
                'price': 'price_1OswRSHFxZqMmcOBqoxrN7T4',
                'quantity': 3,
            },
        ],
        mode='payment',
        success_url=os.environ['URL'] + '?success=true',
        cancel_url=os.environ['URL'] + '?canceled=true',
    )
    return redirect(checkout_session.url, code=303)


# Create your views here.
class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
