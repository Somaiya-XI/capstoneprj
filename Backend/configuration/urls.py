from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()

router.register (r'NotificationConfiguration',views.NotificationConfigViewSet)
router.register (r'AutoOrderConfiguration',views.AutoOrderConfigViewSet)

urlpatterns = [
    path('', include(router.urls))]
