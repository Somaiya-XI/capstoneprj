from .serializers import GoogleSignInSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


class GoogleOauthSignInview(APIView):
    serializer_class = GoogleSignInSerializer

    # access posted user data and validate the token using the serializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = (serializer.validated_data)['access_token']
        return Response(data, status=status.HTTP_200_OK)
