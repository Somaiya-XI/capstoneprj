from django.shortcuts import render
from rest_framework import viewsets
from .serializers import AutoOrderConfigSerializer, NotificationConfigSerializer
from .models import AutoOrderConfig, NotificationConfig
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from .models import AutoOrderConfig
from user.models import Retailer
from product.models import SupermarketProduct, ProductBulk
from django.views.decorators.csrf import csrf_exempt
from rest_framework.request import Request
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime
from rest_framework.exceptions import ValidationError


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def add_default_notification_config(request):
    if NotificationConfig.objects.exists():
        return JsonResponse(
            {'error': 'Default Notification config already exists.'}, status=400
        )

    data = request.data
    serializer = NotificationConfigSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'message': 'Notification config added successfully.'})
    else:
        return JsonResponse(serializer.errors, status=400)



@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def receive_notification_of_low_quantity_feature(request):
    products = SupermarketProduct.objects.all()
    expiry = ProductBulk.objects.all()
    notifications = []
    notification_configs = NotificationConfig.objects.all()

    retailer_configs = {config.retailer: config for config in notification_configs}

    for product in products:
        retailer_id = product.retailer
        if retailer_id in retailer_configs:
            config = retailer_configs[retailer_id]
            threshold = config.low_quantity_threshold
            near_expiry_days = config.near_expiry_days

            if ProductBulk.days_to_expiry == near_expiry_days:
                notification_message = f'Product {product.product_name} has near expiry days reaching. Near expiry days: {ProductBulk.days_to_expiry}'
                notifications.append(notification_message)

            if product.quantity == threshold:
                notification_message = f'Product {product.product_name} quantity has reached or fallen below threshold level. Current quantity: {product.quantity}'
                notifications.append(notification_message)
            elif product.quantity < threshold:
                notification_message = f'Product "{product.product_name}" quantity has fallen below the threshold level. Current quantity: {product.quantity}.'
                notifications.append(notification_message)

    if notifications:
        return JsonResponse({'notifications': notifications}, status=200)
    else:
        return JsonResponse(
            {'message': 'All product quantities are within threshold'}, status=200
        )


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny]) 
def view_default_notification_config(request: Request):
    try:
        retailer_id = request.data.get('user_id')
        retailer = Retailer.objects.get(id=retailer_id)
    except Retailer.DoesNotExist:
        response_data = {
            'error': 'Retailer not found for the given ID.',
        }
        return JsonResponse(response_data, status=404)

    try:
        default_notification_config = NotificationConfig.objects.get(retailer=retailer)
    except NotificationConfig.DoesNotExist:
        response_data = {
            'low_quantity_threshold': '',
            'near_expiry_days': '',
        }
        return JsonResponse(response_data, status=200)

    config_serialized = NotificationConfigSerializer(
        default_notification_config, context={'request': request}
    ).data
    response_data = {
        'low_quantity_threshold': config_serialized['low_quantity_threshold'],
        'near_expiry_days': config_serialized['near_expiry_days'],
    }

    return JsonResponse(response_data, status=200)


@csrf_exempt
@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_default_notification_config(request):
    try:
        retailer_id = request.data.get('user_id')
        retailer = Retailer.objects.get(id=retailer_id)
        default_notification_config = NotificationConfig.objects.get(retailer=retailer)
    except Retailer.DoesNotExist:
        return JsonResponse({'message': 'Retailer does not exist'}, status=404)
    except NotificationConfig.DoesNotExist:
        return JsonResponse(
            {'message': 'There is no default Notification configuration to be deleted'},
            status=404,
        )

    default_notification_config.delete()

    return JsonResponse(
        {'message': 'The default order configuration was deleted successfully'},
        status=204,
    )


@csrf_exempt
@api_view(['PUT'])
def update_default_notification_config(request):
    try:
        retailer_id = request.data.get('user_id')
        retailer = Retailer.objects.get(id=retailer_id)
    except Retailer.DoesNotExist:
        return JsonResponse({'message': 'Retailer not found'})

    data = request.data

    # activation_status = data.get('activation_status')
    near_expiry_days = data.get('near_expiry_days')
    low_quantity_threshold = data.get('low_quantity_threshold')

    if any in (near_expiry_days, low_quantity_threshold):
        return JsonResponse({'message': 'Notification is updated'})

    default_notification_config, created = NotificationConfig.objects.get_or_create(
        retailer=retailer
    )

    # default_notification_config.activation_status = activation_status
    default_notification_config.near_expiry_days = near_expiry_days
    default_notification_config.low_quantity_threshold = low_quantity_threshold
    default_notification_config.save()

    return JsonResponse(
        {
            'message': (
                'Default notification configuration created'
                if created
                else 'Default notification configuration updated'
            )
        },
        status=201 if created else 200,
    )


@csrf_protect
@api_view(['PUT'])
@permission_classes([AllowAny])
def update_default_order_config(request):

    # access the authenticated user
    if request.user.is_anonymous:
        return JsonResponse(
            {'error': 'You are not authenticated, log in then try again'}
        )

    user_id = request.user.id

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {'error': 'You are not authorized to create an auto order configuration'}
        )

    # collect the data from incoming request
    quantity_reach_level = request.data.get('quantity_reach_level')
    ordering_amount = request.data.get('ordering_amount')
    confirmation_status = request.data.get('confirmation_status')

    # check request data existance
    if not quantity_reach_level:
        return JsonResponse({'error': 'please enter a valid input'})

    if not ordering_amount:
        return JsonResponse({'error': 'please enter a valid input'})

    if ordering_amount == "0" or ordering_amount == "-0":
        return JsonResponse(
            {'error': 'ordering amount: please enter a value greater than 0'}
        )

    if confirmation_status == None:
        return JsonResponse({'error': 'please enter a valid input'})

    # get the user default auto order config or create a new one if it doesn't exist
    try:
        default_order_config = AutoOrderConfig.objects.get(
            retailer=retailer, type="DEFAULT"
        )

        # update the default auto order config to the new values using serializer
        config_serialized = AutoOrderConfigSerializer(
            default_order_config,
            data={
                'qunt_reach_level': quantity_reach_level,
                'ordering_amount': ordering_amount,
                'confirmation_status': confirmation_status,
            },
            partial=True,
        )
        message = 'The default auto ordering configuration updated successfully'

    # create default auto order config object using serializer
    except AutoOrderConfig.DoesNotExist:
        config_serialized = AutoOrderConfigSerializer(
            data={
                'retailer': retailer.pk,
                'type': 'DEFAULT',
                'qunt_reach_level': quantity_reach_level,
                'ordering_amount': ordering_amount,
                'confirmation_status': confirmation_status,
            },
        )
        message = 'The default auto ordering configuration created successfully'

    # validate input fields
    if config_serialized.is_valid():
        config_serialized.save()

        # prepare the response data
        data = {
            'quantity_reach_level': config_serialized.data['qunt_reach_level'],
            'ordering_amount': config_serialized.data['ordering_amount'],
            'confirmation_status': config_serialized.data['confirmation_status'],
        }

        return JsonResponse(
            {
                'message': message,
                'data': data,
            },
            status=200,
        )

    return JsonResponse({'error': config_serialized.errors})


@csrf_protect
@api_view(['GET'])
@permission_classes([AllowAny])
def view_default_order_config(request):

    # access the authenticated user
    if request.user.is_anonymous:
        return JsonResponse(
            {'error': 'You are not authenticated, log in then try again'}
        )

    user_id = request.user.id

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {'error': 'You are not authorized to view an auto order configuration'}
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
            'confirmation_status': False,
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


@csrf_protect
@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_default_order_config(request):

    # access the authenticated user
    if request.user.is_anonymous:
        return JsonResponse(
            {'error': 'You are not authenticated, log in then try again'}
        )

    user_id = request.user.id

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {'error': 'You are not authorized to delete an auto order configuration'}
        )

    # get the user default auto order config object
    try:
        default_order_config = AutoOrderConfig.objects.get(
            retailer=retailer, type='DEFAULT'
        )
    except AutoOrderConfig.DoesNotExist:
        return JsonResponse(
            {'error': 'There is no default order configuration to be deleted'}
        )

    # delete the user default auto order config object
    default_order_config.delete()

    data = {
        'quantity_reach_level': '',
        'ordering_amount': '',
        'confirmation_status': False,
    }

    return JsonResponse(
        {
            'message': 'The default order configuration deleted successfully',
            'data': data,
        },
        status=200,
    )


@csrf_protect
@api_view(['PUT'])
@permission_classes([AllowAny])
def apply_default_order_config_to_all_products(request):

    # access the authenticated user
    if request.user.is_anonymous:
        return JsonResponse(
            {'error': 'You are not authenticated, log in then try again'}
        )

    user_id = request.user.id

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {
                'error': 'You are not authorized to apply the auto order configuration to products'
            }
        )

    # get the user default auto order config object
    try:
        default_order_config = AutoOrderConfig.objects.get(
            retailer=retailer, type='DEFAULT'
        )
    except AutoOrderConfig.DoesNotExist:
        return JsonResponse(
            {'error': 'please create a default order configuration first'}
        )

    # get all products in the retailer's supermarket
    products = SupermarketProduct.objects.filter(retailer=retailer)

    # check the products existance
    if not products:
        return JsonResponse(
            {
                'error': 'You do not have products to apply the default auto order configuration to'
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


@csrf_protect
@api_view(['PUT'])
@permission_classes([AllowAny])
def delete_default_order_config_from_all_products(request):

    # access the authenticated user
    if request.user.is_anonymous:
        return JsonResponse(
            {'error': 'You are not authenticated, log in then try again'}
        )

    user_id = request.user.id

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {
                'error': 'You are not authorized to delete the auto order configuration from products'
            }
        )

    # get the user default auto order config object
    try:
        default_order_config = AutoOrderConfig.objects.get(
            retailer=retailer, type='DEFAULT'
        )
    except AutoOrderConfig.DoesNotExist:
        return JsonResponse(
            {
                'error': 'There is no default order configuration to be deleted from products'
            }
        )

    # get the all products in the retailer's supermarket
    products = SupermarketProduct.objects.filter(retailer=retailer)

    # check the products existance
    if not products:
        return JsonResponse(
            {
                'error': 'You do not have products to delete the default auto order configuration from'
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


@csrf_protect
@api_view(['PUT'])
@permission_classes([AllowAny])
def update_product_order_config(request):

    # access the authenticated user
    if request.user.is_anonymous:
        return JsonResponse(
            {'error': 'You are not authenticated, log in then try again'}
        )

    user_id = request.user.id

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {
                'error': 'You are not authorized to create or update the auto order configuration of this product'
            }
        )

    # collect the data from incoming request
    product_id = request.data.get('product_id')
    config_type = request.data.get('config_type')
    quantity_reach_level = request.data.get('quantity_reach_level')
    ordering_amount = request.data.get('ordering_amount')

    # check request data existance
    if not product_id:
        return JsonResponse({'error': 'please send a valid request'})

    if not config_type:
        return JsonResponse({'error': 'please send a valid request'})

    if config_type == 'special':

        if not quantity_reach_level:
            return JsonResponse({'error': 'please enter a valid input'})

        if not ordering_amount:
            return JsonResponse({'error': 'please enter a valid input'})

        if ordering_amount == "0" or ordering_amount == "-0":
            return JsonResponse(
                {'error': 'ordering amount: please enter a value greater than 0'}
            )

    # get the supermarket product object
    try:
        product = SupermarketProduct.objects.get(
            product_id=product_id, retailer=retailer
        )
    except SupermarketProduct.DoesNotExist:
        return JsonResponse(
            {'errror': 'This product does not exist in your supermarket'}
        )

    if config_type == "default":

        # get the user default auto order config object
        try:
            default_order_config = AutoOrderConfig.objects.get(
                retailer=retailer, type='DEFAULT'
            )
        except AutoOrderConfig.DoesNotExist:
            return JsonResponse(
                {'error': 'please create a default order configuration first'}
            )

        # add the default auto order config to the product
        product.order_config = default_order_config
        product.save()

        return JsonResponse(
            {
                'message': 'The auto ordering configuration for this product updated successfully'
            },
            status=200,
        )

    # create a new special order configuration object if the product does not have its own special order configuration
    if product.order_config == None or product.order_config.type == 'DEFAULT':

        # create special auto order config using serializer
        order_config_serialized = AutoOrderConfigSerializer(
            data={
                'retailer': retailer.pk,
                'type': 'SPECIAL',
                'qunt_reach_level': quantity_reach_level,
                'ordering_amount': ordering_amount,
                'confirmation_status': False,
            },
        )

        # validate input fields
        if order_config_serialized.is_valid():
            order_config_serialized.save()

            # get the created auto order config object
            try:
                order_config = AutoOrderConfig.objects.get(
                    id=order_config_serialized.data['id']
                )
            except:
                return JsonResponse(
                    {'error': 'The auto order configuration does not exist'}
                )

            # add the special auto order config to the product
            product.order_config = order_config
            product.save()

            # prepare the response data
            data = {
                'quantity_reach_level': order_config_serialized.data[
                    'qunt_reach_level'
                ],
                'ordering_amount': order_config_serialized.data['ordering_amount'],
            }

            return JsonResponse(
                {
                    'message': 'The auto ordering configuration for this product updated successfully',
                    'data': data,
                },
                status=200,
            )

        return JsonResponse({'error': order_config_serialized.errors})

    # update the values if the product has its own special order configuration
    try:
        order_config = AutoOrderConfig.objects.get(id=product.order_config.pk)
    except:
        return JsonResponse({'error': 'The auto order configuration does not exist'})

    # update the special auto order config values using serializer
    config_serialized = AutoOrderConfigSerializer(
        order_config,
        data={
            'qunt_reach_level': quantity_reach_level,
            'ordering_amount': ordering_amount,
        },
        partial=True,
    )
    # validate input fields
    if config_serialized.is_valid():
        config_serialized.save()

        # prepare the response data
        data = {
            'quantity_reach_level': config_serialized.data['qunt_reach_level'],
            'ordering_amount': config_serialized.data['ordering_amount'],
        }

        return JsonResponse(
            {
                'message': 'The auto ordering configuration for this product updated successfully',
                'data': data,
            },
            status=200,
        )

    return JsonResponse({'error': config_serialized.errors})


@csrf_protect
@api_view(['GET'])
@permission_classes([AllowAny])
def view_product_order_config(request, product_id):

    # access the authenticated user
    if request.user.is_anonymous:
        return JsonResponse(
            {'error': 'You are not authenticated, log in then try again'}
        )

    user_id = request.user.id

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {
                'error': 'You are not authorized to view the auto order configuration of this product'
            }
        )

    # get the supermarket product object
    try:
        product = SupermarketProduct.objects.get(
            product_id=product_id, retailer=retailer
        )
    except SupermarketProduct.DoesNotExist:
        return JsonResponse(
            {'error': 'This product does not exist in your supermarket'}
        )

    # check the product order configuration existence
    if product.order_config == None:

        # prepare the response_data
        response_data = {
            'quantity_reach_level': '',
            'ordering_amount': '',
        }

        return JsonResponse(response_data, status=200)

    # get the product order configuration object
    try:
        order_config = AutoOrderConfig.objects.get(id=product.order_config.pk)
    except AutoOrderConfig.DoesNotExist:
        return JsonResponse({'error': 'The product order configuration does not exist'})

    # serialize the product order configuration object
    order_config_serialized = AutoOrderConfigSerializer(order_config).data

    # prepare the response_data
    response_data = {
        'quantity_reach_level': order_config_serialized['qunt_reach_level'],
        'ordering_amount': order_config_serialized['ordering_amount'],
    }

    return JsonResponse(response_data, status=200)


@csrf_protect
@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_product_order_config(request):

    # access the authenticated user
    if request.user.is_anonymous:
        return JsonResponse(
            {'error': 'You are not authenticated, log in then try again'}
        )

    user_id = request.user.id

    # get the user object
    try:
        retailer = Retailer.objects.get(id=user_id)
    except Retailer.DoesNotExist:
        return JsonResponse(
            {
                'error': 'You are not authorized to delete the auto order configuration of this product'
            }
        )

    # collect the data from incoming request
    product_id = request.data.get('product_id')

    # check request data existance
    if not product_id:
        return JsonResponse({'error': 'please send a valid request'})

    # get the supermarket product object
    try:
        product = SupermarketProduct.objects.get(
            product_id=product_id, retailer=retailer
        )
    except SupermarketProduct.DoesNotExist:
        return JsonResponse(
            {'error': 'This product does not exist in your supermarket'}
        )
    # check the product auto order config existence
    if product.order_config == None:
        return JsonResponse(
            {
                'error': 'There is no auto order configuration for this product to be deleted'
            }
        )

    # get the product order configuration object
    try:
        order_config = AutoOrderConfig.objects.get(id=product.order_config.pk)
    except AutoOrderConfig.DoesNotExist:
        return JsonResponse(
            {'error': 'The product auto order configuration does not exist'}
        )

    # delete the order configuration object if the type is special
    if product.order_config.type == 'SPECIAL':
        order_config.delete()

    # update the order configuration attribute in the supermarket product object if the type is default
    else:
        product.order_config = None
        product.save()

    data = {
        'quantity_reach_level': '',
        'ordering_amount': '',
    }

    return JsonResponse(
        {
            'message': 'This product auto order configuration deleted successfully',
            'data': data,
        },
        status=200,
    )


class AutoOrderConfigViewSet(viewsets.ModelViewSet):
    queryset = AutoOrderConfig.objects.all()
    serializer_class = AutoOrderConfigSerializer


class NotificationConfigViewSet(viewsets.ModelViewSet):
    queryset = NotificationConfig.objects.all()
    serializer_class = NotificationConfigSerializer
