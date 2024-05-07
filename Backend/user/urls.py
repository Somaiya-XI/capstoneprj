from rest_framework import routers
from django.urls import path, include
from . import views
from .google_auth.views import GoogleOauthSignInview

router = routers.DefaultRouter()

router.register(r'', views.UserViewSet)

urlpatterns = [
    path('activation/', views.activate_user_account, name='activate.user'),
    path('users/', views.view_users, name='users'),
    # path('csrf/', views.get_csrf, name='api-csrf'),
    path('get-csrf/', views.get_csrf, name='csrf'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('session/', views.session_view, name='session'),
    path('update/<int:id>/', views.UpdateProfile.as_view(), name='update'),
    path('reset-password/', views.reset_password),
    path('reset-password/<uidb64>/<token>/', views.authorize_password_reset),
    path('set-new-password/', views.set_new_password),
    path('google/', GoogleOauthSignInview.as_view(), name='google'),
    path('', include(router.urls)),
]
