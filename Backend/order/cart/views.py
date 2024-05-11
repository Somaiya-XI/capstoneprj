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
import json
import uuid
from django.views.decorators.http import require_POST


def is_valid_uuid(string):
    try:
        uuid.UUID(string)
        return True
    except ValueError:
        return False


@api_view(['POST'])
def add_to_cart(request):
    try:
        if request.user.is_anonymous:
            return JsonResponse({'message': 'Unauthorized user! You cannot add to cart'})

        # access the required data
        user = request.user
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        # validate the data
        if not product_id or not is_valid_uuid(product_id):
            return JsonResponse({'message': 'Please enter a valid id'})

        if quantity:
            try:
                float(quantity)
                quantity = int(quantity)
            except (ValueError, TypeError):
                return JsonResponse({'message': 'Please enter a valid quantity'})
        else:
            return JsonResponse({'message': 'Please enter a quantity'})

        # find the given object
        product = get_object_or_404(ProductCatalog, product_id=product_id)

        # find user cart if exists, if not it will be created
        cart = Cart.objects.filter(user=user, type='BASIC').first()
        cart_serializer = CartSerializer()

        if not cart:
            cart_serializer = CartSerializer(data={'user': user, 'type': 'BASIC'})
            cart_serializer.is_valid(raise_exception=True)
            cart = cart_serializer.save()
        else:
            cart_serializer.instance = cart

        # find cart item of the given product
        cart_item = CartItem.objects.filter(cart=cart, product=product).first()

        # if cart item exists
        if cart_item:
            # add the given quantity if it not greater than available stock
            if int(quantity) <= product.quantity:
                cart_item.quantity = int(quantity)
                cart_item.save()
                cart_item_serializer = CartItemSerializer(instance=cart_item)
                message = 'Cart item updated'
                status = 200
            else:
                message = f'Over the stock, you cannot add more than {product.quantity}'
                cart_item_serializer = None
                status = 400
        else:
            # if produc is added for first time add the given
            # quantity if not less than minimum order limit
            cart_item_serializer = CartItemSerializer(
                data={
                    'cart': cart.cart_id,
                    'product': product.product_id,
                    'quantity': (
                        product.min_order_quantity if quantity < product.min_order_quantity else quantity
                    ),
                }
            )
            cart_item_serializer.is_valid(raise_exception=True)
            cart_item = cart_item_serializer.save(product=product)
            message = 'Product added to cart'
            status = 200

        cart.save()

        response_data = {
            'message': message,
            'cart_item': cart_item_serializer.data if cart_item_serializer else [],
            'cart': cart_serializer.data,
        }
        return JsonResponse(response_data, status=status)
    except Exception as e:
        return JsonResponse({'error': f'something went wrong, err: {e}'}, status=400)


@csrf_protect
@require_POST
def remove_from_cart(request):
    try:
        # access the data
        data = json.loads(request.body)

        # access the user
        user = request.user

        # get user id
        product_id = data.get('product_id')

        # find the given product
        product = get_object_or_404(ProductCatalog, product_id=product_id)

        # find the user's cart if it exists
        cart = Cart.objects.filter(user=user, type='BASIC').first()

        if cart:
            # find the product in cart
            cart_item = CartItem.objects.filter(cart=cart, product=product).first()

            # delete the product from cart if it exists
            if cart_item:
                cart_item.delete()
                cart.save()
                return JsonResponse({'message': 'Product removed from cart'})
            else:
                return JsonResponse({'message': 'Product not found in cart'}, status=404)
        else:
            return JsonResponse({'message': 'Cart not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': f'something went wrong, err: {e}'}, status=400)


def calculate_cart_total(cart):
    total_price = sum(item.subtotal for item in cart.cartitem_set.all())
    cart.total = total_price or 0
    cart.save()


@api_view(['GET'])
def view_cart(request):
    try:
        if request.user.is_anonymous:
            return JsonResponse({'message': 'You must be logged in to get a cart'}, status=400)

        # access the user
        user = request.user

        # get user cart if it exists
        cart = Cart.objects.filter(user=user, type='BASIC').first()

        if not cart:
            return JsonResponse({'message': 'You have no cart'}, status=404)

        # get cart items
        cart_items = CartItem.objects.filter(cart=cart)

        response_data = {
            'cart': cart.cart_id,
            'products': [],
            'total': cart.total,
        }

        # add all cart items data
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
        return JsonResponse(response_data)
    except Exception as e:
        return JsonResponse({'error': f'something went wrong, err: {e}'}, status=400)


@csrf_protect
@require_POST
def clear_cart(request):
    try:
        if request.user.is_anonymous:
            return JsonResponse({'message': 'You must be logged in to clear your cart'}, status=400)

        # access the user
        user = request.user

        # get user cart
        cart = Cart.objects.filter(user=user, type='BASIC').first()

        if cart:
            # get all cart items and delete them
            cart_items = CartItem.objects.filter(cart=cart)
            cart_items.delete()
            cart.save()
            return JsonResponse({'message': 'Cart cleared'})
        else:
            return JsonResponse({'message': 'Cart not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': f'something went wrong, err: {e}'}, status=400)


@api_view(['GET'])
def view_smart_cart(request):
    try:
        if request.user.is_anonymous:
            return JsonResponse({'message': 'You must be logged in to get a cart'}, status=400)

        # access the user
        user = request.user

        # get user cart if it exists
        cart = Cart.objects.filter(user=user, type='SMART').first()

        if not cart:
            return JsonResponse({'message': 'You have no cart'}, status=404)

        # get cart items
        cart_items = CartItem.objects.filter(cart=cart)

        response_data = {
            'cart': cart.cart_id,
            'products': [],
            'total': cart.total,
        }

        # add all cart items data
        for cart_item in cart_items:
            product = cart_item.product

            item_data = {
                'product_id': product.product_id,
                'name': product.product_name,
                'unit_price': product.new_price,
                'quantity': cart_item.quantity,
                'subtotal': cart_item.subtotal,
            }

            response_data['products'].append(item_data)
        return JsonResponse(response_data)
    except Exception as e:
        return JsonResponse({'error': f'something went wrong, err: {e}'}, status=400)


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
