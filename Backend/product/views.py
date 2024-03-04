from rest_framework import viewsets
from .serializers import ProductCatalogSerializer, SupermarketProductSerializer
from .models import ProductCatalog, SupermarketProduct
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

# THIS IS THE MANAGER CLASS OF ANY MODEL

import json


@csrf_exempt
@login_required
# @permission_classes([AllowAny])
def create_product(request):

    data = json.loads(request.body)

    if request.user.is_authenticated:
        data['supplier'] = request.user.id
        print(data)
    else:
        return JsonResponse(
            {'error': 'You are not authenticated, log in then try again'}
        )

    serializer = ProductCatalogSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'message': 'Product created successfully.'}, status=201)
    else:
        return JsonResponse(serializer.errors, status=400)


@csrf_exempt
@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def update_product(request):
    data = json.loads(request.body)
    pk = data.get('id')
    print(pk)
    try:
        product = ProductCatalog.objects.get(pk=pk)
    except ProductCatalog.DoesNotExist:
        return JsonResponse({'error': 'This Product does not exist'}, status=404)

    if request.method == 'PUT':
        serializer = ProductCatalogSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'Product updated'}, status=200)
        else:
            return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        product.delete()
        return JsonResponse({'message': 'Product deleted'}, status=204)


def get_categories(request):
    categories = ProductCatalog.objects.select_related('category')
    category_names = list({category.category.name for category in categories})
    return JsonResponse(category_names, safe=False)


def get_brands(request):
    brands = list(ProductCatalog.objects.values_list('brand', flat=True).distinct())
    return JsonResponse(brands, safe=False)


# Create your views here.
class CatalogViewSet(viewsets.ModelViewSet):
    queryset = ProductCatalog.objects.all()
    serializer_class = ProductCatalogSerializer
    permission_classes = [AllowAny]


class SupermarketViewSet(viewsets.ModelViewSet):
    queryset = SupermarketProduct.objects.all()
    serializer_class = SupermarketProductSerializer
