from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()
router.register(r'', views.ScheduleViewSet)

urlpatterns = [
    path('create/', views.create_schedule),
    path('delete/', views.remove_schedule),
    path('', include(router.urls)),
]
