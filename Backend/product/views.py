from rest_framework import viewsets
from .serializers import ProductCatalogSerializer, SupermarketProductSerializer
from .models import ProductCatalog, SupermarketProduct
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.http import JsonResponse


# import stripe

# THIS IS THE MANAGER CLASS OF ANY MODEL

import json

# stripe.api_key = os.environ['STRIPE_SECRET_KEY']


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def create_product(request):

    if request.user.is_anonymous:
        return JsonResponse({'message': 'You are not authenticated, log in then try again'}, status=400)

    data = request.data
    if request.user.is_authenticated:
        data['supplier'] = request.user.id
        print(data)

    serializer = ProductCatalogSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        # stripe.Product.create(name=serializer.data.product_name, id=serializer.data.product_id)
        return JsonResponse({'message': 'Product created successfully.'}, status=201)
    else:
        return JsonResponse(serializer.errors, status=400)


@csrf_exempt
@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def update_product(request):
    if request.user.is_anonymous:
        return JsonResponse({'message': 'You are not authenticated, log in then try again'}, status=400)
    print('the user updating is: ', request.user)
    data = json.loads(request.body)
    pk = data.get('id')
    print(pk)
    try:
        product = ProductCatalog.objects.get(pk=pk)
    except ProductCatalog.DoesNotExist:
        return JsonResponse({'error': 'This Product does not exist'}, status=404)

    if product.supplier_id != request.user.id:
        return JsonResponse({'message': 'You are not authorized to update this product'})

    if request.method == 'PUT':
        serializer = ProductCatalogSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': f"Product {pk} updated"}, status=200)
            # stripe.Product.modify(
            #     serializer.data.product_id,
            #     default_price=serializer.data.new_price,
            # )
            return JsonResponse({'message': 'Product updated'}, status=200)
        else:
            return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        product.delete()
        # stripe.Product.delete(product.product_id)
        return JsonResponse({'message': 'Product deleted'}, status=204)


def get_categories(request):
    categories = ProductCatalog.objects.select_related('category')
    category_names = list({category.category.name for category in categories})
    return JsonResponse(category_names, safe=False)


def get_brands(request):
    brands = list(ProductCatalog.objects.values_list('brand', flat=True).distinct())
    return JsonResponse(brands, safe=False)


@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def view_user_products(request, supplier_id):

    tok = request.user.session_token
    print('csrf in saved of user Product method', tok)

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
