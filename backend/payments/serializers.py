from rest_framework import serializers
from .models import PaymentMethod, Payment, BkashPayment, CardPayment, PaymentLog
from account.models import OrderModel
import uuid
from datetime import datetime


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['id', 'name', 'display_name', 'is_active', 'icon', 'description']


class PaymentSerializer(serializers.ModelSerializer):
    payment_method_name = serializers.CharField(source='payment_method.display_name', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'amount', 'currency', 'status', 'transaction_id',
            'payment_method', 'payment_method_name', 'mobile_number',
            'card_last_four', 'card_brand', 'created_at', 'updated_at',
            'processed_at', 'failure_reason'
        ]
        read_only_fields = [
            'transaction_id', 'created_at', 'updated_at', 'processed_at',
            'failure_reason', 'card_last_four', 'card_brand'
        ]


class BkashPaymentSerializer(serializers.ModelSerializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True)
    pin = serializers.CharField(write_only=True, min_length=4, max_length=6)
    
    class Meta:
        model = BkashPayment
        fields = ['mobile_number', 'amount', 'pin']
    
    def validate_mobile_number(self, value):
        # Basic Bangladesh mobile number validation
        if not value.startswith('01') or len(value) != 11:
            raise serializers.ValidationError("Invalid mobile number format. Use 01XXXXXXXXX")
        return value
    
    def create(self, validated_data):
        request = self.context['request']
        amount = validated_data.pop('amount')
        pin = validated_data.pop('pin')  # In real implementation, this would be used for API call
        
        # Create Payment record
        payment_method = PaymentMethod.objects.get(name='bkash')
        payment = Payment.objects.create(
            user=request.user,
            payment_method=payment_method,
            amount=amount,
            transaction_id=f"BKS{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:6].upper()}",
            mobile_number=validated_data['mobile_number'],
            status='processing'
        )
        
        # Create BkashPayment record
        bkash_payment = BkashPayment.objects.create(
            payment=payment,
            mobile_number=validated_data['mobile_number'],
            bkash_transaction_id=f"BKS{uuid.uuid4().hex[:8].upper()}"
        )
        
        # Simulate processing (in real implementation, make API call to bKash)
        # For now, mark as completed
        payment.status = 'completed'
        payment.processed_at = datetime.now()
        payment.save()
        
        # Log payment status change
        PaymentLog.objects.create(
            payment=payment,
            status_from='processing',
            status_to='completed',
            message='bKash payment processed successfully',
            created_by=request.user
        )
        
        return bkash_payment


class CardPaymentSerializer(serializers.ModelSerializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True)
    card_number = serializers.CharField(write_only=True, min_length=16, max_length=19)
    expiry_date = serializers.CharField(write_only=True, max_length=5)
    cvv = serializers.CharField(write_only=True, min_length=3, max_length=4)
    card_type = serializers.ChoiceField(choices=CardPayment.CARD_TYPES, write_only=True)
    
    class Meta:
        model = CardPayment
        fields = [
            'card_holder_name', 'card_number', 'expiry_date', 
            'cvv', 'card_type', 'amount'
        ]
    
    def validate_card_number(self, value):
        # Remove spaces and validate length
        card_number = value.replace(' ', '')
        if not card_number.isdigit() or len(card_number) < 16:
            raise serializers.ValidationError("Invalid card number")
        return card_number
    
    def validate_expiry_date(self, value):
        # Validate MM/YY format
        if '/' not in value or len(value) != 5:
            raise serializers.ValidationError("Invalid expiry date format. Use MM/YY")
        
        try:
            month, year = value.split('/')
            if not (1 <= int(month) <= 12):
                raise serializers.ValidationError("Invalid month")
        except ValueError:
            raise serializers.ValidationError("Invalid expiry date")
        
        return value
    
    def create(self, validated_data):
        request = self.context['request']
        amount = validated_data.pop('amount')
        card_number = validated_data.pop('card_number')
        expiry_date = validated_data.pop('expiry_date')
        cvv = validated_data.pop('cvv')
        card_type = validated_data.pop('card_type')
        
        # Get last 4 digits of card
        card_last_four = card_number[-4:]
        
        # Create Payment record
        payment_method = PaymentMethod.objects.get(name=card_type)
        payment = Payment.objects.create(
            user=request.user,
            payment_method=payment_method,
            amount=amount,
            transaction_id=f"{card_type.upper()}{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:6].upper()}",
            card_last_four=card_last_four,
            card_brand=card_type,
            status='processing'
        )
        
        # Create CardPayment record
        card_payment = CardPayment.objects.create(
            payment=payment,
            card_type=card_type,
            card_last_four=card_last_four,
            card_holder_name=validated_data['card_holder_name'],
            authorization_code=f"AUTH{uuid.uuid4().hex[:8].upper()}"
        )
        
        # Simulate processing (in real implementation, make API call to payment gateway)
        # For now, mark as completed
        payment.status = 'completed'
        payment.processed_at = datetime.now()
        payment.save()
        
        # Log payment status change
        PaymentLog.objects.create(
            payment=payment,
            status_from='processing',
            status_to='completed',
            message=f'{card_type} payment processed successfully',
            created_by=request.user
        )
        
        return card_payment


class PaymentLogSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = PaymentLog
        fields = [
            'id', 'status_from', 'status_to', 'message', 
            'created_at', 'created_by_name'
        ]


class PaymentDetailSerializer(serializers.ModelSerializer):
    payment_method_details = PaymentMethodSerializer(source='payment_method', read_only=True)
    bkash_details = serializers.SerializerMethodField()
    card_details = serializers.SerializerMethodField()
    logs = PaymentLogSerializer(many=True, read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'amount', 'currency', 'status', 'transaction_id',
            'payment_method_details', 'mobile_number', 'card_last_four',
            'card_brand', 'created_at', 'updated_at', 'processed_at',
            'failure_reason', 'refund_amount', 'bkash_details',
            'card_details', 'logs'
        ]
    
    def get_bkash_details(self, obj):
        if hasattr(obj, 'bkash_details'):
            return {
                'mobile_number': obj.bkash_details.mobile_number,
                'bkash_transaction_id': obj.bkash_details.bkash_transaction_id
            }
        return None
    
    def get_card_details(self, obj):
        if hasattr(obj, 'card_details'):
            return {
                'card_type': obj.card_details.card_type,
                'card_last_four': obj.card_details.card_last_four,
                'card_holder_name': obj.card_details.card_holder_name,
                'authorization_code': obj.card_details.authorization_code
            }
        return None