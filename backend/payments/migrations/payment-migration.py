# Generated manually for enhanced payment system

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.core.validators


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('account', '0001_initial'),  # Assuming account app has initial migration
    ]

    operations = [
        migrations.CreateModel(
            name='PaymentMethod',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('bkash', 'bKash'), ('visa', 'Visa'), ('mastercard', 'MasterCard'), ('cash', 'Cash on Delivery')], max_length=20, unique=True)),
                ('display_name', models.CharField(max_length=50)),
                ('is_active', models.BooleanField(default=True)),
                ('icon', models.CharField(blank=True, max_length=50)),
                ('description', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('currency', models.CharField(default='BDT', max_length=3)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('processing', 'Processing'), ('completed', 'Completed'), ('failed', 'Failed'), ('cancelled', 'Cancelled'), ('refunded', 'Refunded')], default='pending', max_length=20)),
                ('transaction_id', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('mobile_number', models.CharField(blank=True, max_length=15, null=True)),
                ('card_last_four', models.CharField(blank=True, max_length=4, null=True)),
                ('card_brand', models.CharField(blank=True, max_length=20, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('processed_at', models.DateTimeField(blank=True, null=True)),
                ('gateway_response', models.JSONField(blank=True, default=dict)),
                ('failure_reason', models.TextField(blank=True, null=True)),
                ('refund_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('order', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='payment', to='account.ordermodel')),
                ('payment_method', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='payments.paymentmethod')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='PaymentLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status_from', models.CharField(max_length=20)),
                ('status_to', models.CharField(max_length=20)),
                ('message', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('payment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='payments.payment')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='CardPayment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('card_type', models.CharField(choices=[('visa', 'Visa'), ('mastercard', 'MasterCard'), ('amex', 'American Express')], max_length=20)),
                ('card_last_four', models.CharField(max_length=4)),
                ('card_holder_name', models.CharField(max_length=100)),
                ('authorization_code', models.CharField(blank=True, max_length=50, null=True)),
                ('payment', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='card_details', to='payments.payment')),
            ],
        ),
        migrations.CreateModel(
            name='BkashPayment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mobile_number', models.CharField(max_length=15, validators=[django.core.validators.MinLengthValidator(11), django.core.validators.MaxLengthValidator(15)])),
                ('bkash_transaction_id', models.CharField(blank=True, max_length=50, null=True)),
                ('sender_reference', models.CharField(blank=True, max_length=50, null=True)),
                ('customer_msisdn', models.CharField(blank=True, max_length=15, null=True)),
                ('payment', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='bkash_details', to='payments.payment')),
            ],
        ),
    ]