from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()

router.register (r'SupermarketProduct',views.SupermarketViewSet)
router.register (r'CatalogProduct',views.CatalogViewSet)

urlpatterns = [
    path('', include(router.urls))]
