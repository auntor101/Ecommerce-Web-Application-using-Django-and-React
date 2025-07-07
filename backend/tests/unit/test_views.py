"""
Unit tests for views in the e-commerce application
"""
from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from decimal import Decimal
import json

from account.models import BillingAddress, OrderModel
from product.models import Category, Product, Cart, Wishlist, Review
from payments.models import PaymentMethod, Payment


class UserRegistrationViewTest(APITestCase):
    """Test user registration view"""
    
    def setUp(self):
        self.client = APIClient()
        self.registration_url = '/account/register/'
        
    def test_successful_registration(self):
        """Test successful user registration"""
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(self.registration_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(User.objects.filter(username='testuser').exists())
        self.assertIn('token', response.data)
        
    def test_registration_with_empty_fields(self):
        """Test registration with empty username or email"""
        data = {
            'username': '',
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(self.registration_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)
        
    def test_registration_with_existing_username(self):
        """Test registration with existing username"""
        User.objects.create_user('testuser', 'test@example.com', 'pass')
        
        data = {
            'username': 'testuser',
            'email': 'new@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(self.registration_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_registration_with_existing_email(self):
        """Test registration with existing email"""
        User.objects.create_user('user1', 'test@example.com', 'pass')
        
        data = {
            'username': 'newuser',
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(self.registration_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class UserAccountViewTest(APITestCase):
    """Test user account views"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            'testuser', 'test@example.com', 'testpass123'
        )
        self.client = APIClient()
        
        # Get JWT token
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
    def test_get_user_details_authenticated(self):
        """Test getting user details when authenticated"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = f'/account/user/{self.user.id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        
    def test_get_user_details_unauthenticated(self):
        """Test getting user details when not authenticated"""
        url = f'/account/user/{self.user.id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_update_user_account_success(self):
        """Test successful user account update"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = f'/account/user/update/{self.user.id}/'
        data = {
            'username': 'updateduser',
            'email': 'updated@example.com',
            'password': ''
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify user was updated
        updated_user = User.objects.get(id=self.user.id)
        self.assertEqual(updated_user.username, 'updateduser')
        
    def test_update_other_user_account_denied(self):
        """Test updating another user's account is denied"""
        other_user = User.objects.create_user('otheruser', 'other@example.com')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = f'/account/user/update/{other_user.id}/'
        data = {
            'username': 'hacker',
            'email': 'hacker@example.com',
            'password': ''
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_delete_user_account_success(self):
        """Test successful user account deletion"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = f'/account/user/delete/{self.user.id}/'
        data = {'password': 'testpass123'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(id=self.user.id).exists())
        
    def test_delete_user_account_wrong_password(self):
        """Test user account deletion with wrong password"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = f'/account/user/delete/{self.user.id}/'
        data = {'password': 'wrongpassword'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue(User.objects.filter(id=self.user.id).exists())


class BillingAddressViewTest(APITestCase):
    """Test billing address views"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            'testuser', 'test@example.com', 'testpass123'
        )
        self.other_user = User.objects.create_user(
            'otheruser', 'other@example.com', 'pass123'
        )
        self.client = APIClient()
        
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        self.address = BillingAddress.objects.create(
            name='Test User',
            user=self.user,
            phone_number='+8801712345678',
            pin_code='123456',
            house_no='123 Test Street',
            landmark='Near Test Mall',
            city='Dhaka',
            state='Dhaka Division'
        )
        
    def test_get_user_addresses_authenticated(self):
        """Test getting user addresses when authenticated"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = '/account/user/addresses/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
    def test_get_user_addresses_unauthenticated(self):
        """Test getting user addresses when not authenticated"""
        url = '/account/user/addresses/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_get_address_details_owner(self):
        """Test getting address details as owner"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = f'/account/user/address/{self.address.id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test User')
        
    def test_get_address_details_non_owner(self):
        """Test getting address details as non-owner"""
        other_refresh = RefreshToken.for_user(self.other_user)
        other_token = str(other_refresh.access_token)
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {other_token}')
        url = f'/account/user/address/{self.address.id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_create_address_success(self):
        """Test successful address creation"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = '/account/user/address/create/'
        data = {
            'name': 'New Address',
            'phone_number': '+8801798765432',
            'pin_code': '654321',
            'house_no': '456 New Street',
            'landmark': 'Near New Mall',
            'city': 'Chittagong',
            'state': 'Chittagong Division'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(BillingAddress.objects.filter(user=self.user).count(), 2)
        
    def test_update_address_success(self):
        """Test successful address update"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = f'/account/user/address/update/{self.address.id}/'
        data = {
            'name': 'Updated Name',
            'city': 'Updated City'
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        updated_address = BillingAddress.objects.get(id=self.address.id)
        self.assertEqual(updated_address.name, 'Updated Name')
        self.assertEqual(updated_address.city, 'Updated City')
        
    def test_delete_address_success(self):
        """Test successful address deletion"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = f'/account/user/address/delete/{self.address.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(BillingAddress.objects.filter(id=self.address.id).exists())


class ProductViewTest(APITestCase):
    """Test product views"""
    
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Electronics')
        self.product = Product.objects.create(
            name='Test Product',
            description='Test description',
            price=Decimal('99.99'),
            stock=True,
            category=self.category,
            is_featured=True
        )
        
        # Create admin user
        self.admin_user = User.objects.create_user(
            'admin', 'admin@example.com', 'adminpass'
        )
        self.admin_user.is_staff = True
        self.admin_user.is_superuser = True
        self.admin_user.save()
        
        admin_refresh = RefreshToken.for_user(self.admin_user)
        self.admin_token = str(admin_refresh.access_token)
        
    def test_get_products_list(self):
        """Test getting products list"""
        url = '/api/products/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        
    def test_get_product_detail(self):
        """Test getting product detail"""
        url = f'/api/products/{self.product.id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Product')
        
    def test_filter_products_by_category(self):
        """Test filtering products by category"""
        url = f'/api/products/?category={self.category.id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_filter_products_by_price_range(self):
        """Test filtering products by price range"""
        url = '/api/products/?price_min=50&price_max=150'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_search_products(self):
        """Test searching products"""
        url = '/api/products/?search=Test'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_create_product_as_admin(self):
        """Test creating product as admin"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        url = '/api/products/create/'
        data = {
            'name': 'New Product',
            'description': 'New description',
            'price': '149.99',
            'stock': True,
            'category': self.category.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_create_product_as_non_admin(self):
        """Test creating product as non-admin (should fail)"""
        regular_user = User.objects.create_user('user', 'user@example.com')
        user_refresh = RefreshToken.for_user(regular_user)
        user_token = str(user_refresh.access_token)
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {user_token}')
        url = '/api/products/create/'
        data = {
            'name': 'New Product',
            'price': '149.99',
            'stock': True
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_update_product_as_admin(self):
        """Test updating product as admin"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        url = f'/api/products/edit/{self.product.id}/'
        data = {
            'name': 'Updated Product',
            'price': '199.99'
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_delete_product_as_admin(self):
        """Test deleting product as admin"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        url = f'/api/products/delete/{self.product.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(id=self.product.id).exists())


class CartViewTest(APITestCase):
    """Test cart views"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            'testuser', 'test@example.com', 'testpass123'
        )
        self.client = APIClient()
        
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        self.product = Product.objects.create(
            name='Test Product',
            price=Decimal('50.00'),
            stock=True
        )
        
    def test_get_cart_authenticated(self):
        """Test getting cart when authenticated"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = '/api/cart/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_items'], 0)
        
    def test_add_to_cart(self):
        """Test adding item to cart"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = '/api/cart/'
        data = {
            'product_id': self.product.id,
            'quantity': 2
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify cart item was created
        cart_item = Cart.objects.get(user=self.user, product=self.product)
        self.assertEqual(cart_item.quantity, 2)
        
    def test_add_out_of_stock_product(self):
        """Test adding out of stock product to cart"""
        self.product.stock = False
        self.product.save()
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = '/api/cart/'
        data = {
            'product_id': self.product.id,
            'quantity': 1
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_clear_cart(self):
        """Test clearing cart"""
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = '/api/cart/clear/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Cart.objects.filter(user=self.user).count(), 0)


class PaymentViewTest(APITestCase):
    """Test payment views"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            'testuser', 'test@example.com', 'testpass123'
        )
        self.client = APIClient()
        
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        self.payment_method = PaymentMethod.objects.create(
            name='bkash',
            display_name='bKash',
            is_active=True
        )
        
    def test_get_payment_methods(self):
        """Test getting available payment methods"""
        url = '/payments/methods/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
    def test_bkash_payment_success(self):
        """Test successful bKash payment"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = '/payments/bkash/'
        data = {
            'mobile_number': '01712345678',
            'amount': '100.00',
            'pin': '1234'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
    def test_bkash_payment_invalid_mobile(self):
        """Test bKash payment with invalid mobile number"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = '/payments/bkash/'
        data = {
            'mobile_number': 'invalid',
            'amount': '100.00',
            'pin': '1234'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_get_user_payments(self):
        """Test getting user payment history"""
        # Create a payment
        payment = Payment.objects.create(
            user=self.user,
            payment_method=self.payment_method,
            amount=Decimal('100.00'),
            status='completed'
        )
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = '/payments/history/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class OrderViewTest(APITestCase):
    """Test order views"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            'testuser', 'test@example.com', 'testpass123'
        )
        self.admin_user = User.objects.create_user(
            'admin', 'admin@example.com', 'adminpass'
        )
        self.admin_user.is_staff = True
        self.admin_user.save()
        
        self.client = APIClient()
        
        user_refresh = RefreshToken.for_user(self.user)
        self.user_token = str(user_refresh.access_token)
        
        admin_refresh = RefreshToken.for_user(self.admin_user)
        self.admin_token = str(admin_refresh.access_token)
        
        self.order = OrderModel.objects.create(
            name='Test Order',
            user=self.user,
            total_price=Decimal('99.99'),
            paid_status=True
        )
        
    def test_get_user_orders(self):
        """Test getting user's orders"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        url = '/account/orders/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
    def test_admin_get_all_orders(self):
        """Test admin getting all orders"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        url = '/account/orders/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_update_order_status_as_admin(self):
        """Test updating order delivery status as admin"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        url = f'/account/orders/update/{self.order.id}/'
        data = {
            'is_delivered': True,
            'delivered_at': '2023-12-01T10:00:00Z'
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        updated_order = OrderModel.objects.get(id=self.order.id)
        self.assertTrue(updated_order.is_delivered)
        
    def test_update_order_status_as_non_admin(self):
        """Test updating order status as non-admin (should fail)"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        url = f'/account/orders/update/{self.order.id}/'
        data = {
            'is_delivered': True,
            'delivered_at': '2023-12-01T10:00:00Z'
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) 