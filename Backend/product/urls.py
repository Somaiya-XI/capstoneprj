from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()

router.register(r'supermarket-product', views.SupermarketViewSet)
router.register(r'catalog-product', views.CatalogViewSet)

urlpatterns = [
    path('catalog-product/create/', views.create_product, name='create_product'),
    path(
        'catalog-product/update/',
        views.update_product,
        name='update-product',
    ),
    path('', include(router.urls)),
]
