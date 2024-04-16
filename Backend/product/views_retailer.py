from rest_framework import viewsets
from .serializers import SupermarketProductSerializer, SupermarketSpecialSerializer
from .models import SupermarketProduct
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.http import JsonResponse


@api_view(['GET'])
@permission_classes([AllowAny])
def view_user_products(request, retailer_id):

    products = SupermarketProduct.objects.filter(retailer=retailer_id)
    response_data = []

    for product in products:
        product_serializer = SupermarketProductSerializer(instance=product)
        response_data.append(product_serializer.data)

    return JsonResponse(response_data, safe=False)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_simulation_list(request):
    retailer_id = 17
    products = SupermarketProduct.objects.filter(retailer=retailer_id)
    response_data = []

    for product in products:
        product_serializer = SupermarketSpecialSerializer(instance=product)
        response_data.append(product_serializer.data)

    return JsonResponse(response_data, safe=False)


@api_view(['GET'])
@permission_classes([AllowAny])
def reset_simulation(request):
    retailer_id = 17
    SupermarketProduct.objects.filter(retailer=retailer_id, tag_id="6281007026819").delete()
    SupermarketProduct.objects.filter(retailer=retailer_id, tag_id="4104220122057").delete()
    SupermarketProduct.objects.filter(retailer=retailer_id, tag_id="6281007036849").delete()
    added = ["6281011111457", "6281007036849"]
    removed = ["6281013151024", "6281007032131", "6281039701012"]
    added_products = SupermarketProduct.objects.filter(retailer=retailer_id, tag_id__in=added)
    removed_products = SupermarketProduct.objects.filter(retailer=retailer_id, tag_id__in=removed)

    for p in added_products:
        p.quantity = 3
        p.save()
    for p in removed_products:
        p.quantity = 7
        p.save()
    return JsonResponse({"message": "reset!"})



class SupermarketViewSet(viewsets.ModelViewSet):
    queryset = SupermarketProduct.objects.all()
    serializer_class = SupermarketProductSerializer
