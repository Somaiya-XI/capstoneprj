from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()

router.register(r'', views.UserViewSet)

urlpatterns = [
    path('activation/', views.activate_user_account, name='activate.user'),
    path('users/', views.users_api, name='users'),
    # path('csrf/', views.get_csrf, name='api-csrf'),
    path('get-csrf/', views.get_csrf, name='csrf'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('session/', views.session_view, name='session'),
    path('get-user/', views.get_user, name='get-user'),
    path('update/<int:id>/', views.UpdateProfile.as_view(), name='update'),
    path('images/<path:image_path>', views.fetch_image, name='fetch.img'),
    path(
        'reset-password/',
        views.reset_password,
        name='reset_password',
    ),
    path(
        'reset-password/<uidb64>/<token>/',
        views.authorize_password_reset,
        name='reset_password',
    ),
    path('set-new-password/', views.set_new_password, name='set_new_password'),
    path('', include(router.urls)),
]
