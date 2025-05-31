# All code in this file is related to Stripe payment API and should be removed as per instructions.
# File intentionally left blank after removing Stripe payment logic.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from account.models import OrderModel
from datetime import datetime

class MockPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        # Simulate payment processing
        payment_method = data.get('payment_method')
        order_id = data.get('order_id')
        amount = data.get('amount')
        paid_status = data.get('paid_status', True)
        # Mark order as paid in DB (if order_id provided)
        if order_id:
            try:
                order = OrderModel.objects.get(id=order_id)
                order.paid_status = paid_status
                order.paid_at = datetime.now()
                order.save()
            except OrderModel.DoesNotExist:
                return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'message': f'Mock payment processed for {payment_method}',
            'paid_status': paid_status,
            'amount': amount
        }, status=status.HTTP_200_OK)