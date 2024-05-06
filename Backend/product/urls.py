from rest_framework import routers
from django.urls import path, include
from . import views, views_retailer, views_simulation

from .mqtt_subscriber import * ## running mqtt subscribe thread after fully running the server

router = routers.DefaultRouter()

router.register(r'supermarket-product', views_retailer.SupermarketViewSet)
router.register(r'catalog-product', views.CatalogViewSet)

urlpatterns = [
    path('catalog/create/', views.create_product, name='create_product'),
    path(
        'catalog/update/',
        views.update_product,
    ),
    path(
        'catalog-product/get-categories/', views.get_categories, name='get_categories'
    ),
    path('catalog-product/get-brands/', views.get_brands, name='get_brands'),
    path(
        'catalog-product/get-products/',
        views.view_catalog_products,
        name='get_products',
    ),
    path(
        'catalog-product/get-product/<str:product_id>/',
        views.view_product,
        name='get_product',
    ),
    path('get-user-products/<int:supplier_id>/', views.view_user_products),
    ### RETAILER CONTROLLER URLS ###
    path('get-ret-products/<int:retailer_id>/', views_retailer.view_user_products),
    path('view_bulk/<str:product_id>/', views_retailer.view_user_products_bulks),
    path('supermarket/create/', views_retailer.create_supermarket_product),
    path('supermarket/update/', views_retailer.update_supermarket_product),
    path('supermarket/delete/', views_retailer.delete_supermarket_product),

    path('get-simulation/', views_simulation.get_simulation_list),
    path('reset-simulation/', views_simulation.reset_simulation),
    path('', include(router.urls)),
]
