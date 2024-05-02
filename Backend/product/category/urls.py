from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()
router.register(r'', views.CategoryViewSet)

urlpatterns = [
    path('get/', views.get_categories, name='categories'),
    path('', include(router.urls)),
]
