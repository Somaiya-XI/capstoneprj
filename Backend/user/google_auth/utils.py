from google.auth.transport import requests
from google.oauth2 import id_token
from user.models import User
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
import json
import os

SOCIAL_AUTH_PWD = os.getenv('SOCIAL_AUTH_PWD')


class Google:

    @staticmethod
    def validate(access_token):
        try:
            id_info = id_token.verify_oauth2_token(access_token, requests.Request())
            if 'accounts.google.com' in id_info['iss']:
                return id_info
        except Exception as e:
            return 'token is invalid or has expired'


def log_social_user_in(email, password):
    user = authenticate(email=email, password=password)
    return user


def manage_social_user(
    provider,
    email,
    company_name,
):
    import requests

    url = "http://127.0.0.1:8000/"
    headers = {'Content-Type': 'application/json'}

    login_data = {'email': email, 'password': SOCIAL_AUTH_PWD}

    user = User.objects.filter(email=email)
    if user.exists():
        user = user[0]
        if provider == user.auth_provider:
            user_data = {
                'id': user.id,
                'email': user.email,
                'company_name': user.company_name,
                'role': user.role,
            }
            log_social_user_in(email, SOCIAL_AUTH_PWD)
            if not user.is_active:
                return {'error': 'your account has not been activated'}
            return {'email': email}
        else:
            raise AuthenticationFailed(
                detail=f"this email isn't authenticated using {provider} please try another way!"
            )
    # CREATE THE NEW USER USING THE SERIALIZER:
    new_user = {
        'email': email,
        'company_name': company_name,
        'role': 'UNDEFIEND',
        'auth_provider': provider,
        "password": SOCIAL_AUTH_PWD,
    }
    payload = json.dumps(new_user)
    response = requests.request("POST", f'{url}user/', headers=headers, data=payload)
    user = response.json()
    user_data = {
        'id': user.get('id'),
        'email': user.get('email'),
        'company_name': user.get('company_name'),
        'role': user.get('role'),
    }
    log_social_user_in(email, SOCIAL_AUTH_PWD)
    return {'email': email}
