from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator, MaxLengthValidator
from account.models import OrderModel


class PaymentMethod(models.Model):
    PAYMENT_TYPES = [
        ('bkash', 'bKash'),
        ('visa', 'Visa'),
        ('mastercard', 'MasterCard'),
        ('cash', 'Cash on Delivery'),
    ]
    
    name = models.CharField(max_length=20, choices=PAYMENT_TYPES, unique=True)
    display_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    icon = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.display_name


class Payment(models.Model):
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    order = models.OneToOneField(OrderModel, on_delete=models.CASCADE, related_name='payment', null=True, blank=True)
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='BDT')
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    transaction_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    
    # Payment method specific data
    mobile_number = models.CharField(max_length=15, blank=True, null=True)  # For bKash
    card_last_four = models.CharField(max_length=4, blank=True, null=True)  # For cards
    card_brand = models.CharField(max_length=20, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    # Additional metadata
    gateway_response = models.JSONField(default=dict, blank=True)
    failure_reason = models.TextField(blank=True, null=True)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payment {self.transaction_id} - {self.user.username} - {self.amount} {self.currency}"
    
    @property
    def is_successful(self):
        return self.status == 'completed'
    
    @property
    def can_be_refunded(self):
        return self.status == 'completed' and self.refund_amount < self.amount


class BkashPayment(models.Model):
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='bkash_details')
    mobile_number = models.CharField(
        max_length=15, 
        validators=[MinLengthValidator(11), MaxLengthValidator(15)]
    )
    bkash_transaction_id = models.CharField(max_length=50, blank=True, null=True)
    sender_reference = models.CharField(max_length=50, blank=True, null=True)
    customer_msisdn = models.CharField(max_length=15, blank=True, null=True)
    
    def __str__(self):
        return f"bKash Payment - {self.mobile_number} - {self.payment.amount}"


class CardPayment(models.Model):
    CARD_TYPES = [
        ('visa', 'Visa'),
        ('mastercard', 'MasterCard'),
        ('amex', 'American Express'),
    ]
    
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='card_details')
    card_type = models.CharField(max_length=20, choices=CARD_TYPES)
    card_last_four = models.CharField(max_length=4)
    card_holder_name = models.CharField(max_length=100)
    authorization_code = models.CharField(max_length=50, blank=True, null=True)
    
    def __str__(self):
        return f"{self.card_type} ending in {self.card_last_four} - {self.payment.amount}"


class PaymentLog(models.Model):
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='logs')
    status_from = models.CharField(max_length=20)
    status_to = models.CharField(max_length=20)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payment {self.payment.transaction_id}: {self.status_from} → {self.status_to}"