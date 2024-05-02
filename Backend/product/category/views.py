from rest_framework import viewsets
from .serializers import CategorySerializer
from .models import Category
from django.http import JsonResponse


# Create your views here.
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


def get_categories(request):
    categories = Category.objects.all()
    category_names = [category.name for category in categories]
    return JsonResponse(category_names, safe=False)
