from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()

router.register(r'NotificationConfiguration', views.NotificationConfigViewSet)
router.register(r'AutoOrderConfiguration', views.AutoOrderConfigViewSet)

urlpatterns = [
    path(
        'auto-order-config/update-default-config/',
        views.update_default_order_config,
        name='update_default_order_config',
    ),
    path(
        'auto-order-config/view-default-config/',
        views.view_default_order_config,
        name='view_default_order_config',
    ),
    path(
        'auto-order-config/delete-default-config/',
        views.delete_default_order_config,
        name='delete_default_order_config',
    ),
    path(
        'auto-order-config/default-config/apply-to-all/',
        views.apply_default_order_config_to_all_products,
        name='apply_default_order_config_to_all_products',
    ),
    path(
        'auto-order-config/default-config/delete-from-all/',
        views.delete_default_order_config_from_all_products,
        name='delete_default_order_config_from_all_products',
    ),
    path(
        'auto-order-config/update-product-config/',
        views.update_product_order_config,
        name='update_product_order_config',
    ),
    path(
        'auto-order-config/view-product-config/<str:product_id>/',
        views.view_product_order_config,
        name='view_product_order_config',
    ),
    path(
        'auto-order-config/delete-product-config/',
        views.delete_product_order_config,
        name='delete_product_order_config',
    ),
    path('', include(router.urls)),
]
