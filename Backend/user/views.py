from rest_framework import viewsets, generics, status
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer
from .models import User
from django.http import JsonResponse
from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.models import Group
from django.views.decorators.csrf import csrf_exempt
from .decorators import unauthenticated_user
from rest_framework.permissions import IsAuthenticated

from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response 


import random
import re


def generate_token(length=10):
    token = ''.join(random.SystemRandom().choice([chr(i) for i in range(97, 123)]+ [str(i) for i in range(10)]) for _ in range(length))
    return token


@csrf_exempt
@action(detail=False)
@unauthenticated_user
# @allowed_users(allowed_roles=['admin'])
def signin(request):
    if not request.method == 'POST':
        return JsonResponse(
            {'error': 'Please send a POST request with valid parameter'}
        )

    email = request.POST['email']
    password = request.POST['password']

    if not email and not password:
        return JsonResponse({'error': 'please fill all the required feilds'})

    if not email:
        return JsonResponse({'error': 'Email field is required'})

    if not password:
        return JsonResponse({'error': 'Password field is required'})

    if not re.match('^[\w\.\+\-]+@[\w]+\.[a-z]{2,3}$', email):
        return JsonResponse({'error': 'Please enter a valid email address'})

    UserModel = get_user_model()

    try:
        user = UserModel.objects.get(email=email)

        if user.check_password(password):
            usr_dict = UserModel.objects.filter(email=email).values().first()
            usr_dict.pop('password')

            if not user.is_active:
                return JsonResponse({'error': 'your account has not been activated'})

            if user.session_token != "0":
                user.session_token = "0"
                user.save()
                return JsonResponse(
                    {'error': 'Leaving an ongoing session...\nPlease try again!'}
                )

            token = generate_token()
            user.session_token = token
            user.save()
            login(request, user)
            return JsonResponse({'token': token, 'user': usr_dict})
        else:
            return JsonResponse({'error': 'Invalid password'})
    except UserModel.DoesNotExist:
        return JsonResponse({'error': 'This email address does not exist'})


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
    # method to be used for checking the incoming requests from clients
    # e.g: if is_valid_session(): return JsonResponse..

    UserModel = get_user_model()
    try:
        user = UserModel.objects.get(pk=id)
        if user.session_token == token:
            return True
        return False
    except UserModel.DoesNotExist:
        return False


@csrf_exempt
def activate_user_account(request, id):

    UserModel = get_user_model()

    try:
        user = UserModel.objects.get(pk=id)
    except UserModel.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'})

    if not user.role == 'ADMIN':
        return JsonResponse({'error': 'cannot perform this action'})

    if request.method == "POST":
        user_id = request.POST['user_id']
        activation_status = request.POST['activation_status']

        try:
            user_account = UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'})

        if user_account.role == 'ADMIN':
            return JsonResponse({'error': 'you cannot modify the admin account'})

        user_account.is_active = activation_status.capitalize()
        user_account.save()
        return JsonResponse({'success': 'User account activated successfully'})

    return JsonResponse({'error': 'Invalid request method'})


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    permission_classes_by_action = {'create': [AllowAny]}

    queryset = User.objects.all()
    serializer_class = UserSerializer

# @api_view(['GET', 'POST'])
# @permission_classes([IsAuthenticated])
# def dashboard(request):
#     if request.method == "GET":
#         response = f"Hey {request.user}, you are screenig a GET"
#     elif request.method == "POST":
#         text = request.POST.get("text")
#         response = f"Hey {request.user}, your text is {text}"
#         return Response({'response':response}, status=status.HTTP_200_OK)

#     return Response({}, status=status.HTTP_400_BAD_REQUEST)
        

    

   
def get_permissions(self):
        try:
            return [
                permission()
                for permission in self.permission_classes_by_action[self.action]
            ]
        except KeyError:
            return [permission() for permission in self.permission_classes]
