from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer
from .models import User
from django.http import JsonResponse
from django.contrib.auth import get_user_model, login, logout
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError

import random
import re



def generate_token(length=10):
    token = ''.join(random.SystemRandom().choice([chr(i) for i in range(97, 123)]+ [str(i) for i in range(10)]) for _ in range(length))
    return token



@csrf_exempt
@action(detail=False)
def signin(request):
    if not request.method == 'POST':
        return JsonResponse({'error': 'Please send a POST request with valid parameter'})
    
    email = request.POST['email']
    password = request.POST['password']

    if not re.match('^[\w\.\+\-]+@[\w]+\.[a-z]{2,}$', email):
        return JsonResponse({'error': 'Please enter a valid email address'})
        
    UserModel = get_user_model()

    try:
        user = UserModel.objects.get(email=email)
        
        if user.check_password(password):
            usr_dict = UserModel.objects.filter(email=email).values().first()
            usr_dict.pop('password')
            
            if user.session_token != "0":
                user.session_token = "0"
                user.save()
                return JsonResponse({'error': 'Leaving an ongoing session...\nPlease try again!'})
            
            token = generate_token()
            user.session_token = token
            user.save()
            login(request, user)
            return JsonResponse({'token': token, 'user': usr_dict})
        else:
            return JsonResponse({'error': 'Invalid password'} )
    except UserModel.DoesNotExist:
        return JsonResponse({'error': 'Invalid email address'})
    

def signout(request, id):
    logout(request)

    UserModel = get_user_model()

    try:
        user = UserModel.objects.get(pk=id)
        user.session_token = '0'
        user.save()
    except UserModel.DoesNotExist:
        return JsonResponse({'error': 'Invalid user id'})
    
    return JsonResponse({'success': 'Logged out successfully'})
    
def is_valid_session(id, token):
    #method to be used for checking the incoming requests from clients 
    #e.g: if is_valid_session(): return JsonResponse..

    UserModel = get_user_model()
    try:
        user = UserModel.objects.get(pk=id)
        if user.session_token == token:
            return True
        return False
    except UserModel.DoesNotExist:
        return False
    

# Create your views here.
class UserViewSet(viewsets.ModelViewSet) :
    permission_classes_by_action = {'create': [AllowAny]}

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        try:
            return [permission () for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]