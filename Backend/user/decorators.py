from django.http import HttpResponse
from django.shortcuts import redirect
from django.http import JsonResponse


# Registerd/Unregisterd users privilges for both sign up or login
def unauthenticated_user(view_func):
    def wrapper_func(request, *args, **kwargs):
        if request.is_authenticated:
            print('')
        else:
            return view_func(request, *args, **kwargs)

    return wrapper_func


def allowed_users(allowed_roles=[]):
    def decorator(view_func):
        def wrapper_func(request, *args, **kwargs):
            group = None
            if request.users.groups.exists():
                group = request.user.groups.all()[0].name

            if group in allowed_roles:
                return view_func(request, *args, **kwargs)
            else:
                return JsonResponse({'error': 'Not Authorized'})

        return wrapper_func

    return decorator
