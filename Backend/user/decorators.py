from django.http import HttpResponse
from django.shortcuts import redirect
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated

error_message = ('Error: You do not have permission to access this page.')
# Registerd/Unregisterd users privilges for both sign up or login
def unauthenticated_user(view_func):
    def wrapper_func(request, *args, **kwargs):
        if request.IsAuthenticated:
            redirect('Landing Page')
        else:
            return view_func(request, *args, **kwargs)
    return wrapper_func


def allowed_privileges(allowed_roles=[]):
    def decorator(view_func):
        def wrapper_func(request, *args, **kwargs):
            group = None
            if request.user.groups.exists():
               group = request.user.groups.all()[0].name

            if group == 'Admin' in allowed_roles:
                return redirect('Admin Dashboard')
            
            elif group == 'Retailer' in allowed_roles:
                return view_func(request, *args, **kwargs)
            elif group == 'Supplier' in allowed_roles:
                return view_func(request, *args, **kwargs)
            else:
                return HttpResponse(error_message)
        return wrapper_func
    return decorator

# Usage example
# @admin_only = dashboard_privileges('Admin')
# @retailer_only = dashboard_privileges('Retailer')
# @supplier_only = dashboard_privileges('Supplier')


# # Admin Dashborad Priviliges
# def admin_only(view_func):
#         def wrapper_func(request, *args, **kwargs):
#             group = None
#             if request.users.groups.exists():
#                group = request.user.groups.all()[0].name

#             if group == 'Retailer':
#                 return redirect('Retailer Dashboard')
            
#             if group == 'Supplier':
#                 return redirect('Supplier Dashboard')
            
#             if group == 'Admin':
#                 return view_func(request, *args, **kwargs)
#             else:
#                 return HttpResponse(error_message)
#         return wrapper_func 

# # Supplier Dashborad Priviliges
# def supplier_only(view_func):
#         def wrapper_func(request, *args, **kwargs):
#             group = None
#             if request.users.groups.exists():
#                group = request.user.groups.all()[0].name

#             if group == 'Admin':
#                 return redirect('Admin Dashboard')
            
#             if group == 'Retailer':
#                 return redirect('Retailer Dashboard')
            
#             if group == 'Supplier':
#                 return view_func(request, *args, **kwargs)
#             else:
#                 return HttpResponse(error_message)
#         return wrapper_func 

# # Retailer Dashborad Priviliges
# def supplier_only(view_func):
#         def wrapper_func(request, *args, **kwargs):
#             group = None
#             if request.users.groups.exists():
#                group = request.user.groups.all()[0].name

#             if group == 'Admin':
#                 return redirect('Admin Dashboard')
            
#             if group == 'Supplier':
#                 return redirect('Supplier Dashboard')
            
#             if group == 'Retailer':
#                 return view_func(request, *args, **kwargs)
#             else:
#                 return HttpResponse(error_message)
#         return wrapper_func 

# Solely Allowed Group of users to view these pages
# def allowed_users (allowed_roles=[]): 
#     def decorator (view_func):
#         def wrapper_func(request, *args, **kwargs):
#             group = None
#             if request.user.groups.exists():
#                group = request.user.groups.all()[0].name
#             if group in allowed_roles:
#                 return view_func(request, *args, **kwargs)
#             else:
#                 return HttpResponse(error_message)
#         return wrapper_func
#     return decorator
