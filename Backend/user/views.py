from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from django.http import JsonResponse, Http404, HttpResponse
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.core.serializers import serialize
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import smart_bytes, smart_str
from django.core.mail import send_mail
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from .models import User
from json.decoder import JSONDecodeError
import re
import json

import mimetypes
from django.shortcuts import redirect

from django.middleware.csrf import get_token
import os

SOCIAL_AUTH_PWD = os.getenv('SOCIAL_AUTH_PWD')
BASE_URL = os.getenv('BASE_URL')
FRONTEND_URL = os.getenv('FRONTEND_URL')


def get_csrf(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})


@csrf_protect
def login_view(request):

    UserModel = get_user_model()
    data = json.loads(request.body)

    email = data.get('email')

    try:
        user = UserModel.objects.get(email=email)
    except UserModel.DoesNotExist:
        return JsonResponse({'error': 'This email address does not exist'}, status=400)

    if not email and not password:
        return JsonResponse({'error': 'please fill all the required feilds'}, status=400)
    if not email:
        return JsonResponse({'error': 'Email field is required'}, status=400)
    if not re.match('^[\w\.\+\-]+@[\w]+\.[a-z]{2,3}$', email):
        return JsonResponse({'error': 'Please enter a valid email address'}, status=400)

    try:
        password = data.pop('password')
        if user.auth_provider != 'email':
            return JsonResponse({'error': 'Please use the correct method to login!'}, status=400)

        if not user.is_active:
            return JsonResponse({'error': 'your account has not been activated'}, status=400)
    except KeyError as e:
        print('except entered!')
        password = SOCIAL_AUTH_PWD

    account = authenticate(email=email, password=password)

    if account:
        user_ = UserSerializer(instance=user).data
        user_data = {
            'id': user.id,
            'email': user.email,
            'company_name': user.company_name,
            'role': user.role,
            'profile_picture': user_.get('profile_picture'),
        }
        login(request, user)
        resp = JsonResponse(
            {'message': 'Successfully logged in.', 'user': user_data},
            status=200,
        )
        resp['X-CSRFToken'] = get_token(request)
        user.session_token = resp['X-CSRFToken']
        user.save()
        return resp
    return JsonResponse({'error': 'The password you entered is incorrect'}, status=400)


def logout_view(request):

    if request.user.is_anonymous:
        return JsonResponse({'message': 'You\'re not logged in.'}, status=400)

    request.user.session_token = 0
    request.user.save()

    logout(request)
    return JsonResponse({'message': 'Successfully logged out.'})


@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})
    return JsonResponse({'isAuthenticated': True})


def view_users(request):
    if request.user.is_anonymous or not request.user.role == 'ADMIN':
        return JsonResponse({'error': 'Unauthorized access! Login as admin then try again..'}, status=400)

    inactive_users = User.objects.filter(role__in=['SUPPLIER', 'RETAILER'])

    response_data = []

    for user in inactive_users:
        users_data = UserSerializer(user)
        response_data.append(users_data.data)

    return JsonResponse(response_data, safe=False)


def activate_user_account(request):
    if request.user.is_anonymous or not request.user.role == 'ADMIN':
        return JsonResponse({'error': 'Unauthorized access! Login then try again..'}, status=400)

    UserModel = get_user_model()

    if request.method == "POST":

        data = json.loads(request.body)
        user_email = data['user_email']
        activation_status = str(data['activation_status']).capitalize()

        if not activation_status or not (activation_status in ['True', 'False']):
            return JsonResponse({'error': 'please enter valid activation status'}, status=400)

        try:
            user_account = UserModel.objects.get(email=user_email)
        except UserModel.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=400)

        if user_account.role == 'ADMIN':
            return JsonResponse({'error': 'you cannot modify the admin account'}, status=400)

        user_account.is_active = activation_status
        user_account.save()

        message = "deactivated" if not activation_status == "True" else "activated"

        return JsonResponse({'success': f'User account {message} successfully'})

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@api_view(['POST'])
@csrf_exempt
def reset_password(request):
    try:
        UserModel = get_user_model()

        data = request.data
        email = data['email']

        if not email:
            return JsonResponse({'error': 'email field is required'})

        try:
            user = UserModel.objects.get(email=email)
            if user:
                token = PasswordResetTokenGenerator().make_token(user)
                uid = urlsafe_base64_encode(smart_bytes(user.pk))
                reset_link = f'{BASE_URL}/user/reset-password/{uid}/{token}/'
                send_mail(
                    'Password Reset New',
                    f'Click the following link to reset your password: {reset_link}',
                    'wiser.application@gmail.com',
                    [email],
                    fail_silently=False,
                )
                return JsonResponse({'message': 'Password reset link sent to your email'})
        except UserModel.DoesNotExist:
            return JsonResponse({'error': 'User with this email does not exist'})
    except Exception as e:
        return JsonResponse({'error': f'something went wrong, err: {e}'})


@csrf_exempt
def authorize_password_reset(request, uidb64, token):

    UserModel = get_user_model()

    try:
        uid = smart_str(urlsafe_base64_decode(uidb64))
        user = UserModel.objects.get(pk=uid)
        if PasswordResetTokenGenerator().check_token(user, token):
            # return JsonResponse({'success': 'you can reset your password'})
            return redirect(f"{FRONTEND_URL}/reset-password/form/{uidb64}/{token}/")
        else:
            return JsonResponse({'error': 'Invalid or expired token'})
            # redirect(f"http://localhost:5173/reset-password/expired-token/")
    except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
        return JsonResponse({'error': 'Invalid user ID'}, status=400)


@csrf_exempt
def set_new_password(request):
    UserModel = get_user_model()
    serializer = UserSerializer()

    try:

        if request.method == 'POST':
            data = json.loads(request.body)

            uidb64 = data.get('uidb64')
            token = data.get('token')
            new_password = data.get('new_password')

            if uidb64 and token and new_password:
                try:
                    uid = smart_str(urlsafe_base64_decode(uidb64))
                    user = UserModel.objects.get(pk=uid)
                    if PasswordResetTokenGenerator().check_token(user, token):
                        try:
                            validated_password = serializer.validate_password(new_password)
                        except ValidationError as e:
                            errors = e.detail
                            return JsonResponse({'error': errors})

                        user.set_password(validated_password)
                        user.save()
                        return JsonResponse({'message': 'Password reset successfully'})
                    else:
                        return JsonResponse({'error': 'Invalid or expired token'}, status=400)
                except UserModel.DoesNotExist:
                    return JsonResponse({'error': 'Invalid user ID'}, status=400)
                except Exception as e:
                    return JsonResponse({'error': 'Invalid request data'}, status=400)

            else:
                return JsonResponse({'error': 'please enter a password!'})

        else:
            return JsonResponse(
                {'error': 'Please send a POST request with valid parameters'},
                status=400,
            )
    except JSONDecodeError:
        return JsonResponse({'error': 'pleas send a valid request'})


@csrf_exempt
def change_password(request):
    UserModel = get_user_model()
    serializer = UserSerializer()

    data = json.loads(request.body)
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')


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
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]


class UpdateProfile(APIView):
    permission_classes = (AllowAny,)

    @csrf_exempt
    def put(self, request, id, format=None):
        data = request.data

        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(id=id)
            serializer = UserSerializer(user, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors)
        except UserModel.DoesNotExist:
            return JsonResponse({'error': 'Update failed, make sure you entered vaild information'})
