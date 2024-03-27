"""
URL configuration for WiseR project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include

from django.conf.urls.static import static
from django.conf import settings
from product.mqtt_subscribe import mqtt_subscribe

urlpatterns = [
    path('admin/', admin.site.urls),
    # rest api urls handled by:
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include('api.urls')),
    path('api2/', include('user.urls')),
    path('mqtt/subscribe/', mqtt_subscribe, name='mqtt_subscribe'),
    # custom apps urls:
    path('product/', include('product.urls')),
    path('category/', include('category.urls')),
    path('order/', include('order.urls')),
    path('config/', include('configuration.urls')),
    path('user/', include('user.urls')),
    path('schedule/', include('supplyschedule.urls')),
    path('cart/', include('order.cart.urls')),
    path('payment/', include('order.paymentwallet.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
