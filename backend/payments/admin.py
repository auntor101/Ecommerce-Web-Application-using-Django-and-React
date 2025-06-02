from django.contrib import admin
from .models import PaymentMethod, Payment, BkashPayment, CardPayment, PaymentLog


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ['name', 'display_name', 'is_active', 'icon']
    list_filter = ['is_active']
    search_fields = ['name', 'display_name']
    list_editable = ['is_active']
    ordering = ['name']


class PaymentLogInline(admin.TabularInline):
    model = PaymentLog
    extra = 0
    readonly_fields = ['status_from', 'status_to', 'message', 'created_at', 'created_by']
    can_delete = False


class BkashPaymentInline(admin.StackedInline):
    model = BkashPayment
    extra = 0
    readonly_fields = ['mobile_number', 'bkash_transaction_id', 'sender_reference']


class CardPaymentInline(admin.StackedInline):
    model = CardPayment
    extra = 0
    readonly_fields = ['card_type', 'card_last_four', 'card_holder_name', 'authorization_code']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'transaction_id', 'user', 'payment_method', 'amount', 
        'currency', 'status', 'created_at', 'processed_at'
    ]
    list_filter = ['status', 'payment_method', 'currency', 'created_at']
    search_fields = [
        'transaction_id', 'user__username', 'user__email',
        'mobile_number', 'card_last_four'
    ]
    readonly_fields = [
        'transaction_id', 'created_at', 'updated_at', 
        'processed_at', 'gateway_response'
    ]
    list_editable = ['status']
    ordering = ['-created_at']
    inlines = [BkashPaymentInline, CardPaymentInline, PaymentLogInline]
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('transaction_id', 'user', 'payment_method', 'amount', 'currency', 'status')
        }),
        ('Payment Details', {
            'fields': ('mobile_number', 'card_last_four', 'card_brand'),
            'classes': ('collapse',)
        }),
        ('Order Information', {
            'fields': ('order',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'processed_at'),
            'classes': ('collapse',)
        }),
        ('Additional Information', {
            'fields': ('failure_reason', 'refund_amount', 'gateway_response'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'payment_method', 'order')


@admin.register(BkashPayment)
class BkashPaymentAdmin(admin.ModelAdmin):
    list_display = ['payment', 'mobile_number', 'bkash_transaction_id']
    search_fields = ['mobile_number', 'bkash_transaction_id', 'payment__transaction_id']
    readonly_fields = ['payment', 'mobile_number', 'bkash_transaction_id']
    ordering = ['-payment__created_at']


@admin.register(CardPayment)
class CardPaymentAdmin(admin.ModelAdmin):
    list_display = ['payment', 'card_type', 'card_last_four', 'card_holder_name']
    list_filter = ['card_type']
    search_fields = ['card_last_four', 'card_holder_name', 'payment__transaction_id']
    readonly_fields = ['payment', 'card_type', 'card_last_four', 'authorization_code']
    ordering = ['-payment__created_at']


@admin.register(PaymentLog)
class PaymentLogAdmin(admin.ModelAdmin):
    list_display = ['payment', 'status_from', 'status_to', 'created_at', 'created_by']
    list_filter = ['status_from', 'status_to', 'created_at']
    search_fields = ['payment__transaction_id', 'message']
    readonly_fields = ['payment', 'status_from', 'status_to', 'message', 'created_at', 'created_by']
    ordering = ['-created_at']