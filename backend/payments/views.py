from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from datetime import datetime
import uuid

from .models import PaymentMethod, Payment, BkashPayment, CardPayment
from .serializers import (
    PaymentMethodSerializer, PaymentSerializer, BkashPaymentSerializer,
    CardPaymentSerializer, PaymentDetailSerializer
)
from account.models import OrderModel


class PaymentMethodListView(APIView):
    """Get available payment methods"""
    
    def get(self, request):
        payment_methods = PaymentMethod.objects.filter(is_active=True)
        serializer = PaymentMethodSerializer(payment_methods, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BkashPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = BkashPaymentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            bkash_payment = serializer.save()
            
            # Return payment details
            payment_serializer = PaymentDetailSerializer(bkash_payment.payment)
            
            return Response({
                'message': 'bKash payment processed successfully',
                'payment': payment_serializer.data,
                'success': True
            }, status=status.HTTP_200_OK)
        
        return Response({
            'message': 'Payment failed',
            'errors': serializer.errors,
            'success': False
        }, status=status.HTTP_400_BAD_REQUEST)


class CardPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = CardPaymentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            card_payment = serializer.save()
            
            # Return payment details
            payment_serializer = PaymentDetailSerializer(card_payment.payment)
            
            return Response({
                'message': f'{card_payment.card_type.title()} payment processed successfully',
                'payment': payment_serializer.data,
                'success': True
            }, status=status.HTTP_200_OK)
        
        return Response({
            'message': 'Payment failed',
            'errors': serializer.errors,
            'success': False
        }, status=status.HTTP_400_BAD_REQUEST)


class ProcessPaymentView(APIView):
    """Unified payment processing endpoint"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        payment_method_name = request.data.get('payment_method')
        
        if not payment_method_name:
            return Response({
                'message': 'Payment method is required',
                'success': False
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            payment_method = PaymentMethod.objects.get(name=payment_method_name, is_active=True)
        except PaymentMethod.DoesNotExist:
            return Response({
                'message': 'Invalid payment method',
                'success': False
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Route to appropriate payment processor
        if payment_method_name == 'bkash':
            return self._process_bkash_payment(request)
        elif payment_method_name in ['visa', 'mastercard']:
            return self._process_card_payment(request, payment_method_name)
        else:
            return Response({
                'message': 'Payment method not implemented',
                'success': False
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def _process_bkash_payment(self, request):
        serializer = BkashPaymentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            bkash_payment = serializer.save()
            payment_serializer = PaymentDetailSerializer(bkash_payment.payment)
            
            return Response({
                'message': 'bKash payment processed successfully',
                'payment': payment_serializer.data,
                'success': True
            }, status=status.HTTP_200_OK)
        
        return Response({
            'message': 'bKash payment failed',
            'errors': serializer.errors,
            'success': False
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def _process_card_payment(self, request, card_type):
        data = request.data.copy()
        data['card_type'] = card_type
        
        serializer = CardPaymentSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            card_payment = serializer.save()
            payment_serializer = PaymentDetailSerializer(card_payment.payment)
            
            return Response({
                'message': f'{card_type.title()} payment processed successfully',
                'payment': payment_serializer.data,
                'success': True
            }, status=status.HTTP_200_OK)
        
        return Response({
            'message': f'{card_type.title()} payment failed',
            'errors': serializer.errors,
            'success': False
        }, status=status.HTTP_400_BAD_REQUEST)


class PaymentListView(APIView):
    """Get user's payment history"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        payments = Payment.objects.filter(user=request.user).select_related('payment_method')
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PaymentDetailView(APIView):
    """Get detailed payment information"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, payment_id):
        try:
            payment = Payment.objects.select_related('payment_method').prefetch_related('logs').get(
                id=payment_id, user=request.user
            )
        except Payment.DoesNotExist:
            return Response({
                'message': 'Payment not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PaymentDetailSerializer(payment)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PaymentStatusView(APIView):
    """Check payment status"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, transaction_id):
        try:
            payment = Payment.objects.get(transaction_id=transaction_id, user=request.user)
            serializer = PaymentDetailSerializer(payment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            return Response({
                'message': 'Payment not found'
            }, status=status.HTTP_404_NOT_FOUND)


# Legacy mock payment view for backward compatibility
class MockPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        payment_method_name = data.get('payment_method', 'cash')
        order_id = data.get('order_id')
        amount = data.get('amount', 0)
        paid_status = data.get('paid_status', True)
        
        # Update order if order_id provided
        if order_id:
            try:
                order = OrderModel.objects.get(id=order_id)
                order.paid_status = paid_status
                order.paid_at = datetime.now()
                order.save()
            except OrderModel.DoesNotExist:
                return Response({
                    'detail': 'Order not found.'
                }, status=status.HTTP_404_NOT_FOUND)
        
        # Create payment record
        try:
            payment_method = PaymentMethod.objects.get(name=payment_method_name)
        except PaymentMethod.DoesNotExist:
            # Create payment method if it doesn't exist
            payment_method = PaymentMethod.objects.create(
                name=payment_method_name,
                display_name=payment_method_name.title(),
                is_active=True
            )
        
        payment = Payment.objects.create(
            user=request.user,
            payment_method=payment_method,
            amount=amount,
            status='completed' if paid_status else 'failed',
            transaction_id=f"MOCK{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:6].upper()}",
            processed_at=datetime.now() if paid_status else None
        )
        
        return Response({
            'message': f'Mock payment processed for {payment_method_name}',
            'paid_status': paid_status,
            'amount': amount,
            'transaction_id': payment.transaction_id
        }, status=status.HTTP_200_OK)


class AdminPaymentListView(APIView):
    """Admin view to see all payments"""
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        payments = Payment.objects.all().select_related('payment_method', 'user')
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)