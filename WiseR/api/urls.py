from django.urls import path, include
from rest_framework.authtoken import views
#import the view of the api/
from .views import homepage


#handle the views of the api/
urlpatterns = [
    path('', homepage, name='api.homepage'),


]