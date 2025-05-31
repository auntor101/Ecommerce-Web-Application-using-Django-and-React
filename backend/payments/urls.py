# All payment API endpoints removed as per instructions.
# File intentionally left blank after removing Stripe payment URLs.

from django.urls import path
from payments.views import MockPaymentView

urlpatterns = [
    path('mock-payment/', MockPaymentView.as_view(), name='mock-payment'),
]