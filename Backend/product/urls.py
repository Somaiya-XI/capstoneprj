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
    path('catalog-product/get-categories/', views.get_categories, name='get_categories'),
    path('catalog-product/get-brands/', views.get_brands, name='get_brands'),
    path('', include(router.urls)),
]
