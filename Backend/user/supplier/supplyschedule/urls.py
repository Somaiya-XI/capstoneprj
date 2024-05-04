from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()
router.register(r'', views.ScheduleViewSet)

urlpatterns = [
    path('create/', views.add_schedule_entry),
    path('delete/', views.remove_schedule_entry),
    path('update/', views.update_schedule_entry),
    path('view/<int:supplier_id>/', views.view_supplier_schedule),
    path('', include(router.urls)),
]
