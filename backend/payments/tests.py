from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal
from unittest.mock import patch

from .models import PaymentMethod, Payment, BkashPayment, CardPayment
from account.models import OrderModel


class PaymentMethodModelTest(TestCase):
    def setUp(self):
        self.payment_method = PaymentMethod.objects.create(
            name="bkash",
            display_name="bKash",
            is_active=True,
            icon="mobile-alt",
            description="Mobile wallet payment"
        )

    def test_payment_method_creation(self):
        self.assertEqual(self.payment_method.name, "bkash")
        self.assertEqual(str(self.payment_method), "bKash")
        self.assertTrue(self.payment_method.is_active)


class PaymentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.payment_method = PaymentMethod.objects.create(
            name="bkash",
            display_name="bKash",
            is_active=True
        )
        self.payment = Payment.objects.create(
            user=self.user,
            payment_method=self.payment_method,
            amount=Decimal('100.00'),
            transaction_id="TEST123456",
            status='completed'
        )

    def test_payment_creation(self):
        self.assertEqual(self.payment.amount, Decimal('100.00'))
        self.assertEqual(self.payment.status, 'completed')
        self.assertTrue(self.payment.is_successful)

    def test_payment_can_be_refunded(self):
        self.assertTrue(self.payment.can_be_refunded)
        
        # After partial refund
        self.payment.refund_amount = Decimal('50.00')
        self.assertTrue(self.payment.can_be_refunded)
        
        # After full refund
        self.payment.refund_amount = Decimal('100.00')
        self.assertFalse(self.payment.can_be_refunded)


class PaymentAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        
        # Create payment methods
        PaymentMethod.objects.create(
            name="bkash",
            display_name="bKash",
            is_active=True
        )
        PaymentMethod.objects.create(
            name="visa",
            display_name="Visa",
            is_active=True
        )
        
        self.client.force_authenticate(user=self.user)

    def test_get_payment_methods(self):
        url = '/payments/methods/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_bkash_payment_success(self):
        url = '/payments/bkash/'
        data = {
            'mobile_number': '01712345678',
            'amount': '150.00',
            'pin': '1234'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(Payment.objects.count(), 1)
        self.assertEqual(BkashPayment.objects.count(), 1)

    def test_bkash_payment_invalid_mobile(self):
        url = '/payments/bkash/'
        data = {
            'mobile_number': '123456789',  # Invalid format
            'amount': '150.00',
            'pin': '1234'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_card_payment_success(self):
        url = '/payments/card/'
        data = {
            'card_holder_name': 'John Doe',
            'card_number': '4111111111111111',
            'expiry_date': '12/25',
            'cvv': '123',
            'card_type': 'visa',
            'amount': '200.00'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(Payment.objects.count(), 1)
        self.assertEqual(CardPayment.objects.count(), 1)

    def test_card_payment_invalid_card_number(self):
        url = '/payments/card/'
        data = {
            'card_holder_name': 'John Doe',
            'card_number': '123',  # Too short
            'expiry_date': '12/25',
            'cvv': '123',
            'card_type': 'visa',
            'amount': '200.00'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_unified_payment_processing(self):
        url = '/payments/process/'
        data = {
            'payment_method': 'bkash',
            'mobile_number': '01712345678',
            'amount': '100.00',
            'pin': '1234'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

    def test_payment_history(self):
        # Create a payment first
        payment_method = PaymentMethod.objects.get(name='bkash')
        Payment.objects.create(
            user=self.user,
            payment_method=payment_method,
            amount=Decimal('50.00'),
            transaction_id='TEST123',
            status='completed'
        )
        
        url = '/payments/history/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_payment_status_check(self):
        # Create a payment
        payment_method = PaymentMethod.objects.get(name='bkash')
        payment = Payment.objects.create(
            user=self.user,
            payment_method=payment_method,
            amount=Decimal('75.00'),
            transaction_id='TEST456',
            status='completed'
        )
        
        url = f'/payments/status/{payment.transaction_id}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['transaction_id'], 'TEST456')

    def test_unauthorized_access(self):
        # Test without authentication
        self.client.force_authenticate(user=None)
        
        url = '/payments/bkash/'
        data = {
            'mobile_number': '01712345678',
            'amount': '100.00',
            'pin': '1234'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class MockPaymentTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

    def test_mock_payment_success(self):
        url = '/payments/mock-payment/'
        data = {
            'payment_method': 'bkash',
            'amount': 1000,
            'paid_status': True
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Mock payment processed', response.data['message'])
        self.assertTrue(response.data['paid_status'])


class PaymentSecurityTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.admin_user = User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="adminpass123"
        )
        
        PaymentMethod.objects.create(
            name="bkash",
            display_name="bKash",
            is_active=True
        )

    def test_regular_user_cannot_access_admin_payments(self):
        self.client.force_authenticate(user=self.user)
        
        url = '/payments/admin/all/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_user_can_access_admin_payments(self):
        self.client.force_authenticate(user=self.admin_user)
        
        url = '/payments/admin/all/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_only_see_own_payments(self):
        # Create payments for different users
        payment_method = PaymentMethod.objects.get(name='bkash')
        
        user2 = User.objects.create_user(
            username="user2",
            email="user2@example.com",
            password="pass123"
        )
        
        Payment.objects.create(
            user=self.user,
            payment_method=payment_method,
            amount=Decimal('100.00'),
            transaction_id='USER1_PAYMENT',
            status='completed'
        )
        
        Payment.objects.create(
            user=user2,
            payment_method=payment_method,
            amount=Decimal('200.00'),
            transaction_id='USER2_PAYMENT',
            status='completed'
        )
        
        # Authenticate as user1
        self.client.force_authenticate(user=self.user)
        
        url = '/payments/history/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['transaction_id'], 'USER1_PAYMENT')