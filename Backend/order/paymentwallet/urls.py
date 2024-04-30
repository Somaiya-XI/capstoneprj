from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()
router.register(r"", views.PaymentWalletViewSet)

urlpatterns = [
    path(
        'view-wallet-balance/',
        views.view_wallet_balance,
        name='view-wallet-balance',
    ),
    path('charge-wallet/', views.charge_wallet, name='charge-wallet'),
    path('pay-by-wallet/', views.pay_by_wallet, name='pay-by-wallet'),
    path("", include(router.urls)),
]
