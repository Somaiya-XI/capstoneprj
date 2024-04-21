from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()
router.register(r"", views.OrderViewSet)

urlpatterns = [
    path('create-checkout-session/', views.create_checkout_session),
    path('validate-checkout-session/', views.validate_checkout_session),
    path('cancel-ordered-item/', views.cancel_ordered_item),
    path('update-order-item-status/', views.update_ordered_item_status),
    path('view-order-summary/<str:order_id>/', views.view_order_summary),
    path('view-orders-history/', views.view_orders_history),
    path("", include(router.urls)),
]
