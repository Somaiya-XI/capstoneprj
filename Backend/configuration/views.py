from django.shortcuts import render
from rest_framework import viewsets
from .serializers import AutoOrderConfigSerializer, NotificationConfigSerializer
from .models import AutoOrderConfig, NotificationConfig
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from .models import AutoOrderConfig
from user.models import Retailer
from product.models import SupermarketProduct


# Create your views here.
@csrf_exempt
@api_view(['PUT'])
@permission_classes([AllowAny])
def update_default_order_config(request):

    # access the authenticated user
    # if request.user.is_anonymous:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    # user = request.user

    user_id = 17

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {'message': 'You are not authorized to create an auto order configuration'}
        )

    # collect the data from incoming request
    quantity_reach_level = request.data.get('quantity_reach_level')
    ordering_amount = request.data.get('ordering_amount')
    confirmation_status = request.data.get('confirmation_status')

    # check request data existance
    if not quantity_reach_level:
        return JsonResponse({'message': 'please send a valid request'})

    if not ordering_amount:
        return JsonResponse({'message': 'please send a valid request'})

    if confirmation_status == None:
        return JsonResponse({'message': 'please send a valid request'})

    # get the user default auto order config or create a new one if it doesn't exist
    default_order_config = AutoOrderConfig.objects.get_or_create(
        retailer=retailer, type="DEFAULT"
    )

    # update the default auto order config to the new values
    default_order_config[0].qunt_reach_level = quantity_reach_level
    default_order_config[0].ordering_amount = ordering_amount
    default_order_config[0].confirmation_status = confirmation_status
    default_order_config[0].save()

    # check whether a new object created or not
    if default_order_config[1] == True:
        return JsonResponse(
            {'message': 'The default auto ordering configuration created successfully'},
            status=201,
        )

    return JsonResponse(
        {'message': 'The default auto ordering configuration updated successfully'},
        status=200,
    )


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def view_default_order_config(request):

    # access the authenticated user
    # if request.user.is_anonymous:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    # user = request.user

    user_id = 17

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {'message': 'You are not authorized to view an auto order configuration'}
        )

    # get the user default auto order config object
    try:
        default_order_config = AutoOrderConfig.objects.get(
            retailer=retailer, type='DEFAULT'
        )
    except AutoOrderConfig.DoesNotExist:

        # prepare the response_data
        response_data = {
            'quantity_reach_level': '',
            'ordering_amount': '',
            'confirmation_status': '',
        }

        return JsonResponse(response_data, status=200)

    # serialize the order object
    config_serialized = AutoOrderConfigSerializer(default_order_config).data

    # prepare the response data
    response_data = {
        'quantity_reach_level': config_serialized['qunt_reach_level'],
        'ordering_amount': config_serialized['ordering_amount'],
        'confirmation_status': config_serialized['confirmation_status'],
    }

    return JsonResponse(response_data, status=200)


@csrf_exempt
@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_default_order_config(request):

    # access the authenticated user
    # if request.user.is_anonymous:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    # user = request.user

    user_id = 17

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {'message': 'You are not authorized to delete an auto order configuration'}
        )

    # get the user default auto order config object
    try:
        default_order_config = AutoOrderConfig.objects.get(
            retailer=retailer, type='DEFAULT'
        )
    except AutoOrderConfig.DoesNotExist:
        return JsonResponse(
            {'message': 'There is no default order configuration to be deleted'}
        )

    # delete the user default auto order config object
    default_order_config.delete()

    return JsonResponse(
        {'message': 'The default order configuration deleted successfully'}, status=204
    )


@csrf_exempt
@api_view(['PUT'])
@permission_classes([AllowAny])
def apply_default_order_config_to_all_products(request):

    # access the authenticated user
    # if request.user.is_anonymous:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    # user = request.user

    user_id = 17

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {
                'message': 'You are not authorized to apply the auto order configuration to products'
            }
        )

    # get the user default auto order config object
    try:
        default_order_config = AutoOrderConfig.objects.get(
            retailer=retailer, type='DEFAULT'
        )
    except AutoOrderConfig.DoesNotExist:
        return JsonResponse(
            {'message': 'please create a default order configuration first'}
        )

    # get all products in the retailer's supermarket
    products = SupermarketProduct.objects.filter(retailer=retailer)

    # check the products existance
    if not products:
        return JsonResponse(
            {
                'message': 'You do not have products to apply the default auto order configuration to'
            }
        )

    # add the default auto order config to all products in retailer's supermarket
    for product in products:
        product.order_config = default_order_config
        product.save()

    return JsonResponse(
        {
            'message': 'The defualt auto order configuration applied to all products successfully'
        },
        status=200,
    )


@csrf_exempt
@api_view(['PUT'])
@permission_classes([AllowAny])
def delete_default_order_config_from_all_products(request):

    # access the authenticated user
    # if request.user.is_anonymous:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    # user = request.user

    user_id = 17

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {
                'message': 'You are not authorized to delete the auto order configuration from products'
            }
        )

    # get the all products in the retailer's supermarket
    products = SupermarketProduct.objects.filter(retailer=retailer)

    # check the products existance
    if not products:
        return JsonResponse(
            {
                'message': 'You do not have products to delete the default auto order configuration from'
            }
        )

    # delete the default auto order config from all products in retailer's supermarket
    for product in products:
        if product.order_config != None and product.order_config.type == 'DEFAULT':
            product.order_config = None
            product.save()

    return JsonResponse(
        {
            'message': 'The defualt auto order configuration deleted from all products successfully'
        },
        status=200,
    )


@csrf_exempt
@api_view(['PUT'])
@permission_classes([AllowAny])
def update_product_order_config(request):

    # access the authenticated user
    # if request.user.is_anonymous:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    # user = request.user

    user_id = 17

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {
                'message': 'You are not authorized to create or update the auto order configuration of this product'
            }
        )

    # collect the data from incoming request
    product_id = request.data.get('product_id')
    config_type = request.data.get('config_type')
    quantity_reach_level = request.data.get('quantity_reach_level')
    ordering_amount = request.data.get('ordering_amount')
    confirmation_status = request.data.get('confirmation_status')

    # check request data existance
    if not product_id:
        return JsonResponse({'message': 'please send a valid request'})

    if not config_type:
        return JsonResponse({'message': 'please send a valid request'})

    if config_type == 'special':

        if not quantity_reach_level:
            return JsonResponse({'message': 'please send a valid request'})

        if not ordering_amount:
            return JsonResponse({'message': 'please send a valid request'})

        if confirmation_status == None:
            return JsonResponse({'message': 'please send a valid request'})

    # get the supermarket product object
    try:
        product = SupermarketProduct.objects.get(
            product_id=product_id, retailer=retailer
        )
    except SupermarketProduct.DoesNotExist:
        return JsonResponse(
            {'message': 'This product does not exist in your supermarket'}
        )

    if config_type == "default":

        # get the user default auto order config object
        try:
            default_order_config = AutoOrderConfig.objects.get(
                retailer=retailer, type='DEFAULT'
            )
        except AutoOrderConfig.DoesNotExist:
            return JsonResponse(
                {'message': 'please create a default order configuration first'}
            )

        # add the default auto order config to the product
        product.order_config = default_order_config
        product.save()

        return JsonResponse(
            {'message': 'The auto ordering configuration updated successfully'},
            status=200,
        )

    # create a new special order configuration object if the product does not have its own special order configuration
    if product.order_config == None or product.order_config.type == 'DEFAULT':

        order_config = AutoOrderConfig(
            retailer=retailer,
            type='SPECIAL',
            qunt_reach_level=quantity_reach_level,
            ordering_amount=ordering_amount,
            confirmation_status=confirmation_status,
        )
        order_config.save()

        # add the special auto order config to the product
        product.order_config = order_config
        product.save()

        return JsonResponse(
            {'message': 'The auto ordering configuration updated successfully'},
            status=200,
        )

    # update the values if the product has its own special order configuration
    product.order_config.qunt_reach_level = quantity_reach_level
    product.order_config.ordering_amount = ordering_amount
    product.order_config.confirmation_status = confirmation_status
    product.order_config.save()

    return JsonResponse(
        {'message': 'The auto ordering configuration updated successfully'}, status=200
    )


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def view_product_order_config(request, product_id):

    # access the authenticated user
    # if request.user.is_anonymous:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    # user = request.user

    user_id = 17

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {
                'message': 'You are not authorized to view the auto order configuration of this product'
            }
        )

    # get the supermarket product object
    try:
        product = SupermarketProduct.objects.get(
            product_id=product_id, retailer=retailer
        )
    except SupermarketProduct.DoesNotExist:
        return JsonResponse(
            {'message': 'This product does not exist in your supermarket'}
        )

    # check the product order configuration existence
    if product.order_config == None:

        # prepare the response_data
        response_data = {
            'quantity_reach_level': '',
            'ordering_amount': '',
            'confirmation_status': '',
        }

        return JsonResponse(response_data, status=200)

    # get the product order configuration object
    try:
        order_config = AutoOrderConfig.objects.get(id=product.order_config.pk)
    except AutoOrderConfig.DoesNotExist:
        return JsonResponse(
            {'message': 'The product order configuration does not exist'}
        )

    # serialize the product order configuration object
    order_config_serialized = AutoOrderConfigSerializer(order_config).data

    # prepare the response_data
    response_data = {
        'quantity_reach_level': order_config_serialized['qunt_reach_level'],
        'ordering_amount': order_config_serialized['ordering_amount'],
        'confirmation_status': order_config_serialized['confirmation_status'],
    }

    return JsonResponse(response_data, status=200)


@csrf_exempt
@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_product_order_config(request):

    # access the authenticated user
    # if request.user.is_anonymous:
    #     return JsonResponse({'message': 'You are not authenticated, log in then try again'})

    # user = request.user

    user_id = 17

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {
                'message': 'You are not authorized to delete the auto order configuration of this product'
            }
        )

    # collect the data from incoming request
    product_id = request.data.get('product_id')

    # check request data existance
    if not product_id:
        return JsonResponse({'message': 'please send a valid request'})

    # get the supermarket product object
    try:
        product = SupermarketProduct.objects.get(
            product_id=product_id, retailer=retailer
        )
    except SupermarketProduct.DoesNotExist:
        return JsonResponse(
            {'message': 'This product does not exist in your supermarket'}
        )

    # get the product order configuration object
    try:
        order_config = AutoOrderConfig.objects.get(id=product.order_config.pk)
    except AutoOrderConfig.DoesNotExist:
        return JsonResponse(
            {'message': 'The product order configuration does not exist'}
        )

    # delete the order configuration object if the type is special
    if product.order_config.type == 'SPECIAL':
        order_config.delete()

        return JsonResponse(
            {'message': 'This product order configuration deleted successfully'},
            status=204,
        )

    # update the order configuration attribute in the supermarket product object if the type is default
    product.order_config = None
    product.save()

    return JsonResponse(
        {'message': 'This product order configuration deleted successfully'}, status=200
    )


class AutoOrderConfigViewSet(viewsets.ModelViewSet):
    queryset = AutoOrderConfig.objects.all()
    serializer_class = AutoOrderConfigSerializer


class NotificationConfigViewSet(viewsets.ModelViewSet):
    queryset = NotificationConfig.objects.all()
    serializer_class = NotificationConfigSerializer
