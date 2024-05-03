from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()

router.register(r'', views.HardwareSetViewSet)

urlpatterns = [
    path('device-register/', views.create),
    path('get-user-device/', views.get_device),
    path('', include(router.urls)),
]
