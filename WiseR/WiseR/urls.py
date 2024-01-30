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

urlpatterns = [
    path('admin/', admin.site.urls),
    
    #will be removed later - included for first use convenience
    path('', admin.site.urls),


    #rest api urls handled by:
    path('api-auth/', include('rest_framework.urls')),
    path('api/',  include('api.urls')),

    #custom apps urls:
    path('marketprod/',  include('product.marketurls')),
    path('catalogprod/',  include('product.catalogurls')),
    path('category/',  include('category.urls')),
    path('order/',  include('order.urls')),
    path('automateorderconfig/',  include('configuration.autorderurls')),
    path('notificationconfig/',  include('configuration.notificationurls')),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)