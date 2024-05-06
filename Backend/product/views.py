from rest_framework import viewsets
from .serializers import ProductCatalogSerializer, SupermarketProductSerializer
from .models import ProductCatalog, SupermarketProduct
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.http import JsonResponse
import stripe, os
from dotenv import load_dotenv
from user.models import Supplier
from decimal import Decimal

from order.models import Order
from order.serializers import OrderSerializer

# import stripe

# THIS IS THE MANAGER CLASS OF ANY MODEL

import json


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def create_product(request):

    if request.user.is_anonymous:
        return JsonResponse(
            {'message': 'You are not authenticated, log in then try again'}, status=400
        )

    data = request.data
    if request.user.is_authenticated:
        data['supplier'] = request.user.id
        print(data)

    serializer = ProductCatalogSerializer(data=data)

    if serializer.is_valid():
        serializer.save()

        load_dotenv()
        stripe.api_key = os.environ['STRIPE_SECRET_KEY']
        stripe.Product.create(
            id=serializer.data['product_id'],
            name=serializer.data['product_name'],
            default_price_data={
                "currency": 'usd',
                "unit_amount_decimal": serializer.data['new_price'] * 100,
            },
            images=[serializer.data['product_img']],
        )
        return JsonResponse({'message': 'Product created successfully.'}, status=201)
    else:
        return JsonResponse(serializer.errors, status=400)


def create_stripe_product():

    load_dotenv()
    stripe.api_key = os.environ['STRIPE_SECRET_KEY']
    stripe.Product.create(
        id="ac28640c-e087-41ba-b38b-0b6feeab21a1",
        name="Salted wrapped rice",
        default_price_data={
            "currency": 'usd',
            "unit_amount_decimal": 49.5 * 100,
        },
    )
    return JsonResponse({'message': 'product created successfully'})


@csrf_exempt
@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def update_product(request):
    if request.user.is_anonymous:
        return JsonResponse(
            {'message': 'You are not authenticated, log in then try again'}, status=400
        )

    print('the user updating is: ', request.user)
    data = json.loads(request.body)
    pk = data.get('id')
    print(pk)

    try:
        product = ProductCatalog.objects.get(pk=pk)
    except ProductCatalog.DoesNotExist:
        return JsonResponse({'error': 'This Product does not exist'}, status=404)

    if product.supplier_id != request.user.id:
        return JsonResponse(
            {'message': 'You are not authorized to update this product'}
        )

    if request.method == 'PUT':
        serializer = ProductCatalogSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            load_dotenv()
            stripe.api_key = os.environ['STRIPE_SECRET_KEY']
            new_price = stripe.Price.create(
                currency="usd",
                unit_amount_decimal=serializer.data['new_price'] * 100,
                product=serializer.data['product_id'],
            )
            stripe.Product.modify(
                serializer.data['product_id'],
                name=serializer.data['product_name'],
                images=[serializer.data['product_img']],
                default_price=new_price.id,
            )
            return JsonResponse({'message': f"Product {pk} updated"}, status=200)
            return JsonResponse({'message': 'Product updated'}, status=200)
        else:
            return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        product.delete()

        load_dotenv()
        stripe.api_key = os.environ['STRIPE_SECRET_KEY']
        stripe.Product.modify(
            product.product_id,
            active=False,
        )
        return JsonResponse({'message': 'Product deleted'}, status=204)


@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def get_categories(request):

    # get all categories for existing products
    categories = ProductCatalog.objects.select_related('category')

    # insert categories name into a list
    category_names = list({category.category.name for category in categories})
    return JsonResponse(category_names, safe=False)


@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def get_brands(request):

    # get a list of all existing brands
    brands = list(ProductCatalog.objects.values_list('brand', flat=True).distinct())
    return JsonResponse(brands, safe=False)


@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def view_catalog_products(request):

    # get each product object in the catalog
    products = ProductCatalog.objects.all()

    # prepare the products for serialization
    response_data = []
    for product in products:

        # get the company name for each product
        supplier = Supplier.objects.get(id=product.supplier.pk)

        # serialize each product object
        product_serialized = ProductCatalogSerializer(product)

        product_data = {
            'product_id': product_serialized.data['product_id'],
            'product_img': os.environ['BASE_URL']
            + product_serialized.data['product_img'],
            'product_name': product_serialized.data['product_name'],
            'category': product_serialized.data['category'],
            'brand': product_serialized.data['brand'],
            'company_name': supplier.company_name,
            'price': product_serialized.data['price'],
            'new_price': product_serialized.data['new_price'],
            'discount_percentage': product_serialized.data['discount_percentage'],
            'min_order_quantity': product_serialized.data['min_order_quantity'],
            'quantity': product_serialized.data['quantity'],
        }

        response_data.append(product_data)

    return JsonResponse(response_data, safe=False)


@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def view_product(request, product_id):

    # get the product object
    try:
        product = ProductCatalog.objects.get(product_id=product_id)
    except ProductCatalog.DoesNotExist:
        return JsonResponse({'message': 'The product does not exist'})

    # get the company name for the product
    supplier = Supplier.objects.get(id=product.supplier.pk)

    # serialize the product object
    product_serialized = ProductCatalogSerializer(product)

    product_data = {
        'product_id': product_serialized.data['product_id'],
        'product_img': os.environ['BASE_URL'] + product_serialized.data['product_img'],
        'product_name': product_serialized.data['product_name'],
        'category': product_serialized.data['category'],
        'brand': product_serialized.data['brand'],
        'company_name': supplier.company_name,
        'price': product_serialized.data['price'],
        'new_price': product_serialized.data['new_price'],
        'discount_percentage': product_serialized.data['discount_percentage'],
        'min_order_quantity': product_serialized.data['min_order_quantity'],
        'quantity': product_serialized.data['quantity'],
    }

    return JsonResponse(product_data)


@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def view_user_products(request, supplier_id):

    products = ProductCatalog.objects.filter(supplier=supplier_id)
    response_data = []

    for product in products:
        product_serializer = ProductCatalogSerializer(instance=product)
        response_data.append(product_serializer.data)

    return JsonResponse(response_data, safe=False)


# Create your views here.
class CatalogViewSet(viewsets.ModelViewSet):
    queryset = ProductCatalog.objects.all()
    serializer_class = ProductCatalogSerializer
    permission_classes = [AllowAny]


class SupermarketViewSet(viewsets.ModelViewSet):
    queryset = SupermarketProduct.objects.all()
    serializer_class = SupermarketProductSerializer
