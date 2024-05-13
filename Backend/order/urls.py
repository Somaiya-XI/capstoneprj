from rest_framework import routers
from django.urls import path, include
from . import views
from . import views_auto_order


router = routers.DefaultRouter()
router.register(r"", views.OrderViewSet)

urlpatterns = [
    path(
        'create-checkout-session/',
        views.create_checkout_session,
        name='create_checkout_session',
    ),
    path(
        'validate-checkout-session/',
        views.validate_checkout_session,
        name='validate_checkout_session',
    ),
    path('cancel-ordered-item/', views.cancel_ordered_item, name='cancel_ordered_item'),
    path(
        'update-order-item-status/',
        views.update_ordered_item_status,
        name='update_ordered_item_status',
    ),
    path(
        'view-order-summary/<str:order_id>/',
        views.view_order_summary,
        name='view_order_summary',
    ),
    path('view-orders-history/', views.view_orders_history, name='view_orders_history'),
    path('view-supplier-orders/', views.view_supplier_orders, name='view_supplier_orders'),
    path(
        'make-auto-order/',
        views_auto_order.confirm_auto_order,
        name='make_auto_order',
    ),
    path("", include(router.urls)),
]
