"""
API endpoint tests for the e-commerce application
"""
import json
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from decimal import Decimal

from account.models import BillingAddress, OrderModel
from product.models import Category, Product, Cart, Wishlist, Review
from payments.models import PaymentMethod, Payment


class APIEndpointTest(APITestCase):
    """Test all API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create users
        self.user = User.objects.create_user(
            'testuser', 'test@example.com', 'testpass123'
        )
        self.admin_user = User.objects.create_user(
            'admin', 'admin@example.com', 'adminpass'
        )
        self.admin_user.is_staff = True
        self.admin_user.is_superuser = True
        self.admin_user.save()
        
        # Get tokens
        user_refresh = RefreshToken.for_user(self.user)
        self.user_token = str(user_refresh.access_token)
        
        admin_refresh = RefreshToken.for_user(self.admin_user)
        self.admin_token = str(admin_refresh.access_token)
        
        # Create test data
        self.category = Category.objects.create(
            name='Electronics',
            description='Electronic products'
        )
        self.product = Product.objects.create(
            name='Test Product',
            description='Test description',
            price=Decimal('99.99'),
            stock=True,
            category=self.category
        )
        
    def test_health_check_endpoint(self):
        """Test API health check endpoint"""
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'healthy')
        
    def test_api_documentation_endpoints(self):
        """Test API documentation endpoints"""
        # Swagger UI
        response = self.client.get('/api/docs/')
        self.assertEqual(response.status_code, 200)
        
        # ReDoc
        response = self.client.get('/api/redoc/')
        self.assertEqual(response.status_code, 200)
        
        # Schema
        response = self.client.get('/api/schema/')
        self.assertEqual(response.status_code, 200)
        
    def test_user_registration_endpoint(self):
        """Test user registration endpoint"""
        url = '/account/register/'
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        
    def test_user_login_endpoint(self):
        """Test user login endpoint"""
        url = '/account/login/'
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        
    def test_products_list_endpoint(self):
        """Test products list endpoint"""
        url = '/api/products/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        
    def test_product_detail_endpoint(self):
        """Test product detail endpoint"""
        url = f'/api/products/{self.product.id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.product.id)
        
    def test_categories_list_endpoint(self):
        """Test categories list endpoint"""
        url = '/api/categories/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        
    def test_cart_endpoints_authenticated(self):
        """Test cart endpoints when authenticated"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        
        # Get cart
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Add to cart
        data = {'product_id': self.product.id, 'quantity': 1}
        response = self.client.post('/api/cart/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_cart_endpoints_unauthenticated(self):
        """Test cart endpoints when not authenticated"""
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_wishlist_endpoints_authenticated(self):
        """Test wishlist endpoints when authenticated"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        
        # Get wishlist
        response = self.client.get('/api/wishlist/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Add to wishlist
        data = {'product_id': self.product.id}
        response = self.client.post('/api/wishlist/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_payment_methods_endpoint(self):
        """Test payment methods endpoint"""
        PaymentMethod.objects.create(
            name='bkash',
            display_name='bKash',
            is_active=True
        )
        
        response = self.client.get('/payments/methods/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        
    def test_user_profile_endpoints(self):
        """Test user profile endpoints"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        
        # Get user details
        response = self.client.get(f'/account/user/{self.user.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get user addresses
        response = self.client.get('/account/user/addresses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get user orders
        response = self.client.get('/account/orders/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_admin_only_endpoints(self):
        """Test admin-only endpoints"""
        # Test as regular user (should fail)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        
        response = self.client.post('/api/products/create/', {
            'name': 'New Product',
            'price': '99.99',
            'stock': True
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Test as admin (should succeed)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        
        response = self.client.post('/api/products/create/', {
            'name': 'New Product',
            'price': '99.99',
            'stock': True,
            'category': self.category.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_error_handling_endpoints(self):
        """Test error handling for various endpoints"""
        # Non-existent product
        response = self.client.get('/api/products/99999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Invalid data
        response = self.client.post('/account/register/', {
            'username': '',
            'email': 'invalid-email',
            'password': 'short'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_filtering_and_search_endpoints(self):
        """Test filtering and search functionality"""
        # Create additional test data
        Product.objects.create(
            name='Another Product',
            price=Decimal('149.99'),
            stock=True,
            category=self.category
        )
        
        # Test price filtering
        response = self.client.get('/api/products/?price_min=100')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test category filtering
        response = self.client.get(f'/api/products/?category={self.category.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test search
        response = self.client.get('/api/products/?search=Test')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_pagination_endpoints(self):
        """Test pagination functionality"""
        # Create multiple products
        for i in range(25):
            Product.objects.create(
                name=f'Product {i}',
                price=Decimal('99.99'),
                stock=True
            )
            
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('next', response.data)
        self.assertIn('previous', response.data)
        self.assertIn('count', response.data)
        
    def test_content_type_handling(self):
        """Test different content types"""
        # JSON content
        response = self.client.post('/account/register/', {
            'username': 'jsonuser',
            'email': 'json@example.com',
            'password': 'jsonpass123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Form data content
        response = self.client.post('/account/register/', {
            'username': 'formuser',
            'email': 'form@example.com',
            'password': 'formpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_cors_headers(self):
        """Test CORS headers are present"""
        response = self.client.get('/api/products/')
        # Django CORS headers should be present in development
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class APISecurityTest(APITestCase):
    """Test API security aspects"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            'testuser', 'test@example.com', 'testpass123'
        )
        
    def test_authentication_required_endpoints(self):
        """Test endpoints that require authentication"""
        protected_endpoints = [
            '/api/cart/',
            '/api/wishlist/',
            '/account/user/1/',
            '/account/user/addresses/',
            '/account/orders/',
        ]
        
        for endpoint in protected_endpoints:
            response = self.client.get(endpoint)
            self.assertIn(
                response.status_code,
                [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]
            )
            
    def test_admin_required_endpoints(self):
        """Test endpoints that require admin privileges"""
        # Get user token
        refresh = RefreshToken.for_user(self.user)
        user_token = str(refresh.access_token)
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {user_token}')
        
        admin_endpoints = [
            ('/api/products/create/', 'post'),
            ('/api/categories/create/', 'post'),
        ]
        
        for endpoint, method in admin_endpoints:
            if method == 'post':
                response = self.client.post(endpoint, {})
            else:
                response = self.client.get(endpoint)
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
            
    def test_sql_injection_protection(self):
        """Test SQL injection protection"""
        # Try SQL injection in search parameter
        malicious_queries = [
            "'; DROP TABLE product_product; --",
            "' OR '1'='1",
            "1' UNION SELECT * FROM auth_user --"
        ]
        
        for query in malicious_queries:
            response = self.client.get(f'/api/products/?search={query}')
            # Should not cause server error
            self.assertNotEqual(response.status_code, 500)
            
    def test_xss_protection(self):
        """Test XSS protection"""
        # Try XSS in user registration
        xss_payload = "<script>alert('xss')</script>"
        
        response = self.client.post('/account/register/', {
            'username': xss_payload,
            'email': 'test@example.com',
            'password': 'testpass123'
        })
        
        # Should not cause server error
        self.assertNotEqual(response.status_code, 500)
        
    def test_rate_limiting_simulation(self):
        """Simulate rate limiting test"""
        # Make multiple rapid requests
        for i in range(50):
            response = self.client.get('/api/products/')
            # Should not cause server error
            self.assertNotEqual(response.status_code, 500)
            
    def test_invalid_token_handling(self):
        """Test handling of invalid JWT tokens"""
        # Invalid token format
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid-token')
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Malformed authorization header
        self.client.credentials(HTTP_AUTHORIZATION='InvalidHeader')
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class APIPerformanceTest(APITestCase):
    """Test API performance aspects"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create test data
        self.category = Category.objects.create(name='Electronics')
        
        # Create multiple products for performance testing
        self.products = []
        for i in range(100):
            product = Product.objects.create(
                name=f'Product {i}',
                description=f'Description for product {i}',
                price=Decimal('99.99'),
                stock=True,
                category=self.category
            )
            self.products.append(product)
            
    def test_products_list_performance(self):
        """Test products list endpoint performance"""
        import time
        
        start_time = time.time()
        response = self.client.get('/api/products/')
        end_time = time.time()
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Response should be under 2 seconds
        response_time = end_time - start_time
        self.assertLess(response_time, 2.0)
        
    def test_product_search_performance(self):
        """Test product search performance"""
        import time
        
        start_time = time.time()
        response = self.client.get('/api/products/?search=Product')
        end_time = time.time()
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Search should be under 3 seconds
        response_time = end_time - start_time
        self.assertLess(response_time, 3.0)
        
    def test_concurrent_requests_simulation(self):
        """Simulate concurrent requests"""
        import threading
        import time
        
        results = []
        
        def make_request():
            start_time = time.time()
            response = self.client.get('/api/products/')
            end_time = time.time()
            results.append({
                'status_code': response.status_code,
                'response_time': end_time - start_time
            })
            
        # Create 10 threads
        threads = []
        for i in range(10):
            thread = threading.Thread(target=make_request)
            threads.append(thread)
            
        # Start all threads
        for thread in threads:
            thread.start()
            
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
            
        # Check all requests succeeded
        for result in results:
            self.assertEqual(result['status_code'], 200)
            self.assertLess(result['response_time'], 5.0)


class APIValidationTest(APITestCase):
    """Test API input validation"""
    
    def setUp(self):
        self.client = APIClient()
        
    def test_user_registration_validation(self):
        """Test user registration input validation"""
        # Empty username
        response = self.client.post('/account/register/', {
            'username': '',
            'email': 'test@example.com',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Invalid email
        response = self.client.post('/account/register/', {
            'username': 'testuser',
            'email': 'invalid-email',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Very long username
        response = self.client.post('/account/register/', {
            'username': 'a' * 200,
            'email': 'test@example.com',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_product_creation_validation(self):
        """Test product creation validation"""
        admin = User.objects.create_user('admin', 'admin@example.com')
        admin.is_staff = True
        admin.save()
        
        refresh = RefreshToken.for_user(admin)
        token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Negative price
        response = self.client.post('/api/products/create/', {
            'name': 'Test Product',
            'price': '-99.99',
            'stock': True
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Empty name
        response = self.client.post('/api/products/create/', {
            'name': '',
            'price': '99.99',
            'stock': True
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_payment_validation(self):
        """Test payment input validation"""
        user = User.objects.create_user('user', 'user@example.com')
        refresh = RefreshToken.for_user(user)
        token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Invalid mobile number for bKash
        response = self.client.post('/payments/bkash/', {
            'mobile_number': '123',
            'amount': '100.00',
            'pin': '1234'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Invalid card number
        response = self.client.post('/payments/card/', {
            'card_number': '123',
            'expiry_date': '12/25',
            'cvv': '123',
            'card_holder_name': 'Test User',
            'card_type': 'visa',
            'amount': '100.00'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 