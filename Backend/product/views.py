
from rest_framework import viewsets
from .serializers import ProductCatalogSerializer, SupermarketProductSerializer
from .models import ProductCatalog, SupermarketProduct

#THIS IS THE MANAGER CLASS OF ANY MODEL


# Create your views here.
class CatalogViewSet(viewsets.ModelViewSet) :
    queryset = ProductCatalog.objects.all()
    serializer_class = ProductCatalogSerializer


class SupermarketViewSet(viewsets.ModelViewSet) :
    queryset = SupermarketProduct.objects.all()
    serializer_class = SupermarketProductSerializer
