from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()

router.register(r'', views.UserViewSet)

urlpatterns = [
    path('login/', views.signin, name='signin'),
    path('logout/<int:id>/', views.signout, name='signout'),
    path('activation/', views.activate_user_account, name='activate.user'),
    path('users/', views.users_api, name='users'),
    path('images/<path:image_path>', views.fetch_image, name='fetch.img'),
    path('', include(router.urls)),
]
