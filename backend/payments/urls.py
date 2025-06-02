from django.urls import path
from payments.views import (
    PaymentMethodListView, BkashPaymentView, CardPaymentView, 
    ProcessPaymentView, PaymentListView, PaymentDetailView,
    PaymentStatusView, MockPaymentView, AdminPaymentListView
)

urlpatterns = [
    # Payment method endpoints
    path('methods/', PaymentMethodListView.as_view(), name='payment-methods'),
    
    # Payment processing endpoints
    path('process/', ProcessPaymentView.as_view(), name='process-payment'),
    path('bkash/', BkashPaymentView.as_view(), name='bkash-payment'),
    path('card/', CardPaymentView.as_view(), name='card-payment'),
    
    # Payment history and details
    path('history/', PaymentListView.as_view(), name='payment-history'),
    path('detail/<int:payment_id>/', PaymentDetailView.as_view(), name='payment-detail'),
    path('status/<str:transaction_id>/', PaymentStatusView.as_view(), name='payment-status'),
    
    # Admin endpoints
    path('admin/all/', AdminPaymentListView.as_view(), name='admin-payments'),
    
    # Legacy endpoint for backward compatibility
    path('mock-payment/', MockPaymentView.as_view(), name='mock-payment'),
]