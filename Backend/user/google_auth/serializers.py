from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .utils import Google, manage_social_user
from rest_framework.exceptions import AuthenticationFailed
import os

GOOGLE_OAUTH2_CLIENT_ID = os.getenv('GOOGLE_OAUTH2_CLIENT_ID')


class GoogleSignInSerializer(serializers.Serializer):
    access_token = serializers.CharField(min_length=6)

    def validate_access_token(self, access_token):
        # validate the access token using google.auth library
        google_user_data = Google.validate(access_token)

        # check returned data validity
        try:
            google_user_data['sub']
        except:
            raise ValidationError('token expired!')

        # check returned aud is the same as google api client_id
        if google_user_data['aud'] != GOOGLE_OAUTH2_CLIENT_ID:
            raise AuthenticationFailed(detail=f"Failed to verify user!")

        # extract user data
        user_id = google_user_data['sub']
        email = google_user_data['email']
        company_name = google_user_data['name']
        provider = 'google'

        # manage registeration/login of the user
        return manage_social_user(provider, email, company_name)
