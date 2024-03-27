from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()
router.register(r"", views.OrderViewSet)

urlpatterns = [
    path('make-order/', views.make_order),
    path('cancel-order/', views.cancel_order),
    path('view-orders-history/<int:id>/', views.view_orders_history),
    path("", include(router.urls)),
]
