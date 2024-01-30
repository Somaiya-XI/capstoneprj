#from django.shortcuts import render
from django.http import JsonResponse

# Create your views here. -rather than html rendering, get a json response
def homepage(request):
    return JsonResponse({'info': 'In WiseR..'})
