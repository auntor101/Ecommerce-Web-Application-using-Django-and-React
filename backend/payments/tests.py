from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from account.models import OrderModel

# Create your tests here.

class MockPaymentApiTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='testuser@gmail.com', password='testpass1234')
        self.order = OrderModel.objects.create(
            name='testuser',
            ordered_item='Test Product',
            card_number='1234567890123456',
            address='Test Address',
            paid_status=False,
            total_price=1000,
            user=self.user
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_mock_payment_bkash(self):
        response = self.client.post('/payments/mock-payment/', {
            'payment_method': 'bkash',
            'order_id': self.order.id,
            'amount': 1000,
            'paid_status': True
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Mock payment processed for bkash', response.data['message'])

    def test_mock_payment_visa(self):
        response = self.client.post('/payments/mock-payment/', {
            'payment_method': 'visa',
            'order_id': self.order.id,
            'amount': 1000,
            'paid_status': True
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Mock payment processed for visa', response.data['message'])

    def test_mock_payment_mastercard(self):
        response = self.client.post('/payments/mock-payment/', {
            'payment_method': 'mastercard',
            'order_id': self.order.id,
            'amount': 1000,
            'paid_status': True
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Mock payment processed for mastercard', response.data['message'])

    def test_mock_payment_invalid_order(self):
        response = self.client.post('/payments/mock-payment/', {
            'payment_method': 'bkash',
            'order_id': 99999,
            'amount': 1000,
            'paid_status': True
        }, format='json')
        self.assertEqual(response.status_code, 404)
        self.assertIn('Order not found', response.data['detail'])
