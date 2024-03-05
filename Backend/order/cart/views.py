from rest_framework import viewsets
from .serializers import CartSerializer, CartItemSerializer
from .models import Cart, CartItem
from product.models import ProductCatalog
from django.views.decorators.csrf import csrf_exempt
from product.models import ProductCatalog
from product.serializers import ProductCatalogSerializer

from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.db.models import Sum


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def add_to_cart(request):

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
        cart_item.quantity = int(quantity)

        cart_item.save()
        cart_item_serializer = CartItemSerializer(instance=cart_item)
        message = 'Cart item updated'
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
        'cart_item': cart_item_serializer.data,
        'cart': cart_serializer.data,
    }

    return JsonResponse(response_data)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def remove_from_cart(request):
    user = request.user
    product_id = request.data.get('product_id')

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
    total_price = cart.cartitem_set.aggregate(total_price=Sum('subtotal'))['total_price']
    cart.total = total_price or 0
    cart.save()


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def view_cart(request):
    user = request.user

    cart = Cart.objects.filter(user=user).first()

    if not cart:
        return JsonResponse({'message': 'Your cart is empty :('})

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
            'unit_price': product.price,
            'quantity': cart_item.quantity,
            'image': product.product_img.url if product.product_img else None,
            'subtotal': cart_item.subtotal,
        }

        response_data['products'].append(item_data)

    return JsonResponse(response_data)


# Create your views here.
class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
