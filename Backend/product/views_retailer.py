from rest_framework import viewsets
from .serializers import SupermarketProductSerializer, ProductBulkSerializer
from .models import SupermarketProduct, ProductBulk
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.http import JsonResponse

from .utils import SupermarketProductManager


manager = SupermarketProductManager()


@api_view(['POST'])
@permission_classes([AllowAny])
def manage_product(request):

    if request.user.is_anonymous:
        return JsonResponse({'message': 'You are not authenticated, log in then try again'}, status=400)

    retailer = request.user
    received = request.data

    data = {key: value for key, value in received.items() if value}

    tag_id = data.pop('tag_id')
    exp = data.pop('expiry_date')
    product_name = data.get('product_name')

    prod = SupermarketProduct.objects.filter(retailer=retailer, tag_id=tag_id)

    if prod.exists():
        bulk = ProductBulk.objects.filter(product=prod.first(), expiry_date=exp).first()
        if not bulk:
            manager.create_new_bulk(product=prod.first(), exp=exp)
        serializer = SupermarketProductSerializer(prod.first(), data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
        return JsonResponse({'message': 'This product already exists, updated successfully!'}, status=201)

    product = manager.create_new_product(retailer, tag_id, exp, product_name=product_name)

    if isinstance(product, SupermarketProduct):
        serializer = SupermarketProductSerializer(product, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
        return JsonResponse({'message': 'Product created successfully.'}, status=201)
    elif 'error' in product:
        return JsonResponse(product, status=400)
    else:
        return JsonResponse({'error': 'please enter all required values'}, status=400)


@api_view(['GET'])
def view_user_products(request, retailer_id):

    products = SupermarketProduct.objects.filter(retailer=retailer_id)
    response_data = []

    for product in products:
        product_serializer = SupermarketProductSerializer(instance=product)
        product_data = product_serializer.data

        bulk_count = ProductBulk.objects.filter(product=product).count()

        product_data['bulks'] = bulk_count

        response_data.append(product_data)

    return JsonResponse(response_data, safe=False)


@api_view(['GET'])
def view_user_products_bulks(request, product_id):

    bulks = ProductBulk.objects.filter(product=product_id)
    response_data = []

    for bulk in bulks:
        bulk_serializer = ProductBulkSerializer(instance=bulk)
        bulk_data = bulk_serializer.data
        product_data = bulk_data.pop('product')
        print(product_data)
        response_data.append(bulk_data)
    if product_data:
        response_data.insert(0, product_data)
    return JsonResponse(response_data, safe=False)


class SupermarketViewSet(viewsets.ModelViewSet):
    queryset = SupermarketProduct.objects.all()
    serializer_class = SupermarketProductSerializer
