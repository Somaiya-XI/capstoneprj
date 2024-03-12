from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()
router.register(r"cart", views.CartViewSet)
router.register(r"cartitem", views.CartItemViewSet)

urlpatterns = [
    path('add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('remove-from-cart/', views.remove_from_cart, name='remove_from_cart'),
    path('view-cart/', views.view_cart, name='view_cart'),
    path('clear-cart/', views.clear_cart, name='clear_cart'),
    path("", include(router.urls)),
]
