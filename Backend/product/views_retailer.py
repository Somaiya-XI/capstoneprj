from rest_framework import viewsets
from .serializers import SupermarketProductSerializer, SupermarketSpecialSerializer
from .models import SupermarketProduct
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.http import JsonResponse

from .utils import SupermarketProductManager
from user.models import User

manager = SupermarketProductManager()


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def create_product(request):

    if request.user.is_anonymous:
        return JsonResponse({'message': 'You are not authenticated, log in then try again'}, status=400)

    data = request.data
    retailer = request.user
    print('retailer is: ', retailer)
    if not isinstance(retailer, User):
        return 'not retailer'
    tag_id = data.get('tag_id')
    exp = data.get('expiry_date')

    prod = SupermarketProduct.objects.filter(retailer=retailer, tag_id=tag_id)
    if prod.exists():
        return JsonResponse({'error': 'This Item is already in inventory'}, status=400)

    product = manager.create_new(retailer, tag_id, exp)
    if isinstance(product, SupermarketProduct):
        return JsonResponse({'message': 'Product created successfully.'}, status=201)
    else:
        return JsonResponse({'error': 'Failed'}, status=400)


@api_view(['GET'])
def view_user_products(request, retailer_id):

    products = SupermarketProduct.objects.filter(retailer=retailer_id)
    response_data = []

    for product in products:
        product_serializer = SupermarketProductSerializer(instance=product)
        response_data.append(product_serializer.data)

    return JsonResponse(response_data, safe=False)


class SupermarketViewSet(viewsets.ModelViewSet):
    queryset = SupermarketProduct.objects.all()
    serializer_class = SupermarketProductSerializer
