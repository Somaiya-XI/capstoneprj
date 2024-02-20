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

from .serializers import UserSerializer
from .models import User
from json.decoder import JSONDecodeError
import re
import json

import mimetypes
from django.shortcuts import redirect

from django.views.decorators.http import require_POST
from django.middleware.csrf import get_token


def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    print(response['X-CSRFToken'])
    return response


@csrf_protect
@require_POST
def login_view(request):

    data = json.loads(request.body)
    headers = request.META

    print(data)
    email = data.get('email')
    password = data.pop('password')
    csrf_token = headers.get('HTTP_X_CSRFTOKEN')

    print(request.user, 'trying to logg in')
    UserModel = get_user_model()

    if not email and not password:
        return JsonResponse(
            {'error': 'please fill all the required feilds'}, status=400
        )
    if not email:
        return JsonResponse({'error': 'Email field is required'}, status=400)

    if not password:
        return JsonResponse({'error': 'Password field is required'}, status=400)

    if not re.match('^[\w\.\+\-]+@[\w]+\.[a-z]{2,3}$', email):
        return JsonResponse({'error': 'Please enter a valid email address'}, status=400)
    try:
        user = UserModel.objects.get(email=email)
        print(user)
        user_role = user.role
        print(user_role)
        if not user.is_active:
            return JsonResponse(
                {'error': 'your account has not been activated'}, status=400
            )

    except UserModel.DoesNotExist:
        return JsonResponse({'error': 'This email address does not exist'}, status=400)

    account = authenticate(email=email, password=password)

    if account:
        user = UserModel.objects.get(email=account)
        user.session_token = csrf_token
        user.save()
        login(request, user)
        return JsonResponse(
            {'message': 'Successfully logged in.', 'role': user_role},
            status=200,
        )
    return JsonResponse({'error': 'The password you entered is incorrect'}, status=400)


def logout_view(request):

    # print("user", request.user)
    # print('session before: ', request.user.session_token)
    if request.user:
        request.user.session_token = 0
        request.user.save()
        # print('session after: ', request.user.session_token)

    if not request.user.is_authenticated:
        return JsonResponse({'message': 'You\'re not logged in.'}, status=400)

    logout(request)
    return JsonResponse({'message': 'Successfully logged out.'})


@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    return JsonResponse({'isAuthenticated': True})


def get_user(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    return JsonResponse({'email': request.user.email})


def users_api(request):

    UserModel = get_user_model()

    inactive_users = UserModel.objects.filter(role__in=['SUPPLIER', 'RETAILER'])

    users_data = serialize(
        'json',
        inactive_users,
        fields=(
            'email',
            'commercial_reg',
            'role',
            "profile_picture",
            'is_active',
        ),
    )

    users_data = json.loads(users_data)
    for user_data in users_data:
        user_data['fields']['commercial_reg'] = user_data['fields']['commercial_reg']

    return JsonResponse(users_data, safe=False)


def fetch_image(request, image_path):
    UserModel = get_user_model()

    full_path = f"{settings.MEDIA_ROOT}/{image_path}"

    users = UserModel.objects.filter(profile_picture=image_path)

    if not users.exists():
        users = UserModel.objects.filter(commercial_reg=image_path)
        if not users.exists():
            raise Http404("User not found")

    # specify type based on the requested image
    content_type, _ = mimetypes.guess_type(full_path)
    if not content_type:
        content_type = "application/octet-stream"

    with open(full_path, "rb") as image_file:
        image_data = image_file.read()

    return HttpResponse(image_data, content_type=content_type)


@csrf_exempt
def activate_user_account(request):

    UserModel = get_user_model()

    if request.method == "POST":

        data = json.loads(request.body)
        user_email = data['user_email']
        activation_status = data['activation_status']

        try:
            user_account = UserModel.objects.get(email=user_email)
        except UserModel.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'})

        if user_account.role == 'ADMIN':
            return JsonResponse({'error': 'you cannot modify the admin account'})

        user_account.is_active = activation_status.capitalize()
        user_account.save()
        return JsonResponse({'success': 'User account activated successfully'})

    return JsonResponse({'error': 'Invalid request method'})


@csrf_exempt
def reset_password(request):

    UserModel = get_user_model()

    print('before request')
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        print(email)

        try:
            user = UserModel.objects.get(email=email)
            if user:
                token = PasswordResetTokenGenerator().make_token(user)
                uid = urlsafe_base64_encode(smart_bytes(user.pk))
                reset_link = f'http://localhost:8000/user/reset-password/{uid}/{token}/'
                send_mail(
                    'Password Reset New',
                    f'Click the following link to reset your password: {reset_link}',
                    'wiser.application@gmail.com',
                    [email],
                    fail_silently=False,
                )
                print('email sent')
                return JsonResponse(
                    {'message': 'Password reset link sent to your email'}
                )
        except UserModel.DoesNotExist:
            return JsonResponse({'error': 'User with this email does not exist'})
    else:
        return JsonResponse(
            {'error': 'Please send a POST request with valid parameters'}
        )


@csrf_exempt
def authorize_password_reset(request, uidb64, token):

    UserModel = get_user_model()

    try:
        uid = smart_str(urlsafe_base64_decode(uidb64))
        user = UserModel.objects.get(pk=uid)
        print(uid)
        print(user)
        if PasswordResetTokenGenerator().check_token(user, token):
            # return JsonResponse({'success': 'you can reset your password'})
            return redirect(
                f"http://localhost:5173/reset-password/form/{uidb64}/{token}/"
            )
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
            print("data", data)

            uidb64 = data.get('uidb64')
            token = data.get('token')
            new_password = data.get('new_password')
            print(uidb64, token, new_password)
            if uidb64 and token and new_password:
                try:
                    uid = smart_str(urlsafe_base64_decode(uidb64))
                    print(uid)
                    user = UserModel.objects.get(pk=uid)
                    print(user)
                    if PasswordResetTokenGenerator().check_token(user, token):
                        try:
                            validated_password = serializer.validate_password(
                                new_password
                            )
                        except ValidationError as e:
                            errors = e.detail
                            return JsonResponse({'error': errors})

                        user.set_password(validated_password)
                        user.save()
                        return JsonResponse({'message': 'Password reset successfully'})
                    else:
                        return JsonResponse(
                            {'error': 'Invalid or expired token'}, status=400
                        )
                except UserModel.DoesNotExist:
                    return JsonResponse({'error': 'Invalid user ID'}, status=400)
            else:
                return JsonResponse({'error': 'please enter a password!'})

        else:
            return JsonResponse(
                {'error': 'Please send a POST request with valid parameters'},
                status=400,
            )
    except JSONDecodeError:
        return JsonResponse({'error': 'pleas send a valid request'})


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


class UpdateProfile(APIView):
    permission_classes = (AllowAny,)

    @csrf_exempt
    def put(self, request, id, format=None):
        data = self.request.data

        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(id=id)
            serializer = UserSerializer(user, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors)
        except UserModel.DoesNotExist:
            return JsonResponse(
                {'error': 'Update failed, make sure you entered vaild information'}
            )
