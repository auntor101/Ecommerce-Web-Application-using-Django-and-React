"""
Integration tests for complete user workflows
"""
from django.test import TestCase, TransactionTestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from decimal import Decimal
from datetime import datetime, timezone

from account.models import BillingAddress, OrderModel
from product.models import Category, Product, Cart, Wishlist, Review
from payments.models import PaymentMethod, Payment, BkashPayment


class UserRegistrationWorkflowTest(APITestCase):
    """Test complete user registration and login workflow"""
    
    def setUp(self):
        self.client = APIClient()
        
    def test_complete_user_registration_workflow(self):
        """Test complete user registration workflow"""
        # Step 1: Register new user
        registration_data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepass123'
        }
        
        response = self.client.post('/account/register/', registration_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        
        # Verify user was created
        user = User.objects.get(username='newuser')
        self.assertEqual(user.email, 'newuser@example.com')
        
        # Step 2: Login with new credentials
        login_data = {
            'username': 'newuser',
            'password': 'securepass123'
        }
        
        response = self.client.post('/account/login/', login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        
        # Step 3: Access protected endpoint
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.get(f'/account/user/{user.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'newuser')
        
    def test_user_profile_management_workflow(self):
        """Test complete user profile management workflow"""
        # Create user
        user = User.objects.create_user(
            'testuser', 'test@example.com', 'testpass123'
        )
        refresh = RefreshToken.for_user(user)
        token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Step 1: Create billing address
        address_data = {
            'name': 'John Doe',
            'phone_number': '+8801712345678',
            'pin_code': '123456',
            'house_no': '123 Main St',
            'landmark': 'Near Park',
            'city': 'Dhaka',
            'state': 'Dhaka Division'
        }
        
        response = self.client.post('/account/user/address/create/', address_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        address_id = response.data['id']
        
        # Step 2: Update address
        update_data = {
            'name': 'John Updated',
            'city': 'Chittagong'
        }
        
        response = self.client.put(f'/account/user/address/update/{address_id}/', update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'John Updated')
        self.assertEqual(response.data['city'], 'Chittagong')
        
        # Step 3: Get all addresses
        response = self.client.get('/account/user/addresses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Step 4: Update user profile
        profile_data = {
            'username': 'updateduser',
            'email': 'updated@example.com',
            'password': ''
        }
        
        response = self.client.put(f'/account/user/update/{user.id}/', profile_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify update
        updated_user = User.objects.get(id=user.id)
        self.assertEqual(updated_user.username, 'updateduser')


class ProductBrowsingWorkflowTest(APITestCase):
    """Test product browsing and searching workflow"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create test data
        self.electronics = Category.objects.create(
            name='Electronics',
            description='Electronic products'
        )
        self.clothing = Category.objects.create(
            name='Clothing',
            description='Clothing items'
        )
        
        # Create products
        self.laptop = Product.objects.create(
            name='Gaming Laptop',
            description='High-performance gaming laptop',
            price=Decimal('1299.99'),
            stock=True,
            category=self.electronics,
            is_featured=True
        )
        
        self.phone = Product.objects.create(
            name='Smartphone',
            description='Latest smartphone with advanced features',
            price=Decimal('799.99'),
            stock=True,
            category=self.electronics
        )
        
        self.shirt = Product.objects.create(
            name='Cotton T-Shirt',
            description='Comfortable cotton t-shirt',
            price=Decimal('29.99'),
            stock=False,
            category=self.clothing
        )
        
    def test_product_discovery_workflow(self):
        """Test complete product discovery workflow"""
        # Step 1: Browse all products
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(response.data['count'], 3)
        
        # Step 2: Filter by category
        response = self.client.get(f'/api/products/?category={self.electronics.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
        
        # Step 3: Filter by price range
        response = self.client.get('/api/products/?price_min=500&price_max=1000')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
        # Step 4: Search products
        response = self.client.get('/api/products/?search=gaming')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Gaming Laptop')
        
        # Step 5: Filter by availability
        response = self.client.get('/api/products/?stock=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
        
        # Step 6: Get featured products
        response = self.client.get('/api/products/?featured=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
        # Step 7: View product details
        response = self.client.get(f'/api/products/{self.laptop.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Gaming Laptop')
        
    def test_product_sorting_workflow(self):
        """Test product sorting workflow"""
        # Test price sorting (low to high)
        response = self.client.get('/api/products/?ordering=price_low')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        products = response.data['results']
        self.assertEqual(products[0]['name'], 'Cotton T-Shirt')
        
        # Test price sorting (high to low)
        response = self.client.get('/api/products/?ordering=price_high')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        products = response.data['results']
        self.assertEqual(products[0]['name'], 'Gaming Laptop')
        
        # Test name sorting
        response = self.client.get('/api/products/?ordering=name')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        products = response.data['results']
        self.assertEqual(products[0]['name'], 'Cotton T-Shirt')


class ShoppingCartWorkflowTest(APITestCase):
    """Test shopping cart workflow"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            'testuser', 'test@example.com', 'testpass123'
        )
        
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        # Create test products
        category = Category.objects.create(name='Electronics')
        self.product1 = Product.objects.create(
            name='Product 1',
            price=Decimal('99.99'),
            stock=True,
            category=category
        )
        self.product2 = Product.objects.create(
            name='Product 2',
            price=Decimal('149.99'),
            stock=True,
            category=category
        )
        
    def test_complete_cart_workflow(self):
        """Test complete shopping cart workflow"""
        # Step 1: Check empty cart
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_items'], 0)
        self.assertEqual(response.data['total_price'], 0)
        
        # Step 2: Add first item to cart
        response = self.client.post('/api/cart/', {
            'product_id': self.product1.id,
            'quantity': 2
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Step 3: Add second item to cart
        response = self.client.post('/api/cart/', {
            'product_id': self.product2.id,
            'quantity': 1
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Step 4: Check cart contents
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_items'], 2)
        expected_total = Decimal('99.99') * 2 + Decimal('149.99') * 1
        self.assertEqual(Decimal(str(response.data['total_price'])), expected_total)
        
        # Step 5: Update cart item quantity
        cart_item = Cart.objects.get(user=self.user, product=self.product1)
        response = self.client.put(f'/api/cart/item/{cart_item.id}/', {
            'quantity': 3
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Step 6: Verify updated cart
        response = self.client.get('/api/cart/')
        expected_total = Decimal('99.99') * 3 + Decimal('149.99') * 1
        self.assertEqual(Decimal(str(response.data['total_price'])), expected_total)
        
        # Step 7: Remove item from cart
        cart_item2 = Cart.objects.get(user=self.user, product=self.product2)
        response = self.client.delete(f'/api/cart/item/{cart_item2.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Step 8: Verify item removed
        response = self.client.get('/api/cart/')
        self.assertEqual(response.data['total_items'], 1)
        
        # Step 9: Clear entire cart
        response = self.client.delete('/api/cart/clear/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Step 10: Verify cart is empty
        response = self.client.get('/api/cart/')
        self.assertEqual(response.data['total_items'], 0)
        
    def test_cart_edge_cases_workflow(self):
        """Test cart edge cases workflow"""
        # Try to add out-of-stock item
        out_of_stock_product = Product.objects.create(
            name='Out of Stock',
            price=Decimal('99.99'),
            stock=False
        )
        
        response = self.client.post('/api/cart/', {
            'product_id': out_of_stock_product.id,
            'quantity': 1
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Try to add same item twice (should update quantity)
        response = self.client.post('/api/cart/', {
            'product_id': self.product1.id,
            'quantity': 1
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        response = self.client.post('/api/cart/', {
            'product_id': self.product1.id,
            'quantity': 2
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify quantity was updated, not duplicated
        cart_items = Cart.objects.filter(user=self.user, product=self.product1)
        self.assertEqual(cart_items.count(), 1)
        self.assertEqual(cart_items.first().quantity, 3)


class WishlistWorkflowTest(APITestCase):
    """Test wishlist workflow"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            'testuser', 'test@example.com', 'testpass123'
        )
        
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        # Create test products
        category = Category.objects.create(name='Electronics')
        self.product1 = Product.objects.create(
            name='Product 1',
            price=Decimal('99.99'),
            stock=True,
            category=category
        )
        self.product2 = Product.objects.create(
            name='Product 2',
            price=Decimal('149.99'),
            stock=True,
            category=category
        )
        
    def test_complete_wishlist_workflow(self):
        """Test complete wishlist workflow"""
        # Step 1: Check empty wishlist
        response = self.client.get('/api/wishlist/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
        
        # Step 2: Add items to wishlist
        response = self.client.post('/api/wishlist/', {
            'product_id': self.product1.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        response = self.client.post('/api/wishlist/', {
            'product_id': self.product2.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Step 3: Check wishlist contents
        response = self.client.get('/api/wishlist/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        # Step 4: Remove item from wishlist
        response = self.client.delete(f'/api/wishlist/item/{self.product1.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Step 5: Verify item removed
        response = self.client.get('/api/wishlist/')
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['product']['id'], self.product2.id)
        
        # Step 6: Move wishlist item to cart
        response = self.client.post('/api/cart/', {
            'product_id': self.product2.id,
            'quantity': 1
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify item is in cart
        response = self.client.get('/api/cart/')
        self.assertEqual(response.data['total_items'], 1)


class PaymentWorkflowTest(APITestCase):
    """Test payment workflow"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            'testuser', 'test@example.com', 'testpass123'
        )
        
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        # Create payment methods
        self.bkash_method = PaymentMethod.objects.create(
            name='bkash',
            display_name='bKash',
            is_active=True
        )
        
        self.visa_method = PaymentMethod.objects.create(
            name='visa',
            display_name='Visa',
            is_active=True
        )
        
    def test_bkash_payment_workflow(self):
        """Test complete bKash payment workflow"""
        # Step 1: Get available payment methods
        response = self.client.get('/payments/methods/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        # Step 2: Process bKash payment
        payment_data = {
            'mobile_number': '01712345678',
            'amount': '100.00',
            'pin': '1234'
        }
        
        response = self.client.post('/payments/bkash/', payment_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('payment', response.data)
        
        # Step 3: Verify payment was created
        payment = Payment.objects.get(user=self.user)
        self.assertEqual(payment.amount, Decimal('100.00'))
        self.assertEqual(payment.status, 'completed')
        self.assertEqual(payment.payment_method, self.bkash_method)
        
        # Step 4: Check bKash payment details
        bkash_payment = BkashPayment.objects.get(payment=payment)
        self.assertEqual(bkash_payment.mobile_number, '01712345678')
        
        # Step 5: Get payment history
        response = self.client.get('/payments/history/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
    def test_card_payment_workflow(self):
        """Test complete card payment workflow"""
        payment_data = {
            'card_number': '4111111111111111',
            'expiry_date': '12/25',
            'cvv': '123',
            'card_holder_name': 'John Doe',
            'card_type': 'visa',
            'amount': '200.00'
        }
        
        response = self.client.post('/payments/card/', payment_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        # Verify payment was created
        payment = Payment.objects.get(user=self.user, amount=Decimal('200.00'))
        self.assertEqual(payment.status, 'completed')
        self.assertEqual(payment.card_last_four, '1111')


class ReviewWorkflowTest(APITestCase):
    """Test product review workflow"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            'testuser', 'test@example.com', 'testpass123'
        )
        
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        # Create test product
        category = Category.objects.create(name='Electronics')
        self.product = Product.objects.create(
            name='Test Product',
            price=Decimal('99.99'),
            stock=True,
            category=category
        )
        
        # Create order to enable verified reviews
        self.order = OrderModel.objects.create(
            name='Test Order',
            ordered_item='Test Product',
            user=self.user,
            paid_status=True,
            total_price=Decimal('99.99')
        )
        
    def test_complete_review_workflow(self):
        """Test complete product review workflow"""
        # Step 1: Get product reviews (should be empty)
        response = self.client.get(f'/api/products/{self.product.id}/reviews/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
        
        # Step 2: Add product review
        review_data = {
            'rating': 5,
            'comment': 'Excellent product! Highly recommended.'
        }
        
        response = self.client.post(f'/api/products/{self.product.id}/reviews/', review_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Step 3: Verify review was created and auto-verified
        review = Review.objects.get(product=self.product, user=self.user)
        self.assertEqual(review.rating, 5)
        self.assertTrue(review.is_verified)  # Should be verified due to purchase
        
        # Step 4: Get product reviews (should show new review)
        response = self.client.get(f'/api/products/{self.product.id}/reviews/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['rating'], 5)
        
        # Step 5: Update review
        updated_review_data = {
            'rating': 4,
            'comment': 'Good product, but could be better.'
        }
        
        response = self.client.put(f'/api/reviews/{review.id}/', updated_review_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Step 6: Verify review was updated
        review.refresh_from_db()
        self.assertEqual(review.rating, 4)
        self.assertEqual(review.comment, 'Good product, but could be better.')
        
        # Step 7: Check product average rating
        response = self.client.get(f'/api/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['average_rating'], 4.0)
        self.assertEqual(response.data['review_count'], 1)
        
        # Step 8: Delete review
        response = self.client.delete(f'/api/reviews/{review.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Step 9: Verify review was deleted
        self.assertFalse(Review.objects.filter(id=review.id).exists())
        
    def test_review_restrictions_workflow(self):
        """Test review restrictions workflow"""
        # Try to review without authentication
        self.client.credentials()  # Remove authentication
        
        review_data = {
            'rating': 5,
            'comment': 'Test comment'
        }
        
        response = self.client.post(f'/api/products/{self.product.id}/reviews/', review_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Re-authenticate and add review
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        response = self.client.post(f'/api/products/{self.product.id}/reviews/', review_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Try to add second review for same product (should fail)
        response = self.client.post(f'/api/products/{self.product.id}/reviews/', review_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AdminWorkflowTest(APITestCase):
    """Test admin workflow"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create admin user
        self.admin = User.objects.create_user(
            'admin', 'admin@example.com', 'adminpass'
        )
        self.admin.is_staff = True
        self.admin.is_superuser = True
        self.admin.save()
        
        # Create regular user
        self.user = User.objects.create_user(
            'user', 'user@example.com', 'userpass'
        )
        
        # Get tokens
        admin_refresh = RefreshToken.for_user(self.admin)
        self.admin_token = str(admin_refresh.access_token)
        
        user_refresh = RefreshToken.for_user(self.user)
        self.user_token = str(user_refresh.access_token)
        
    def test_product_management_workflow(self):
        """Test complete product management workflow"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        
        # Step 1: Create category
        category_data = {
            'name': 'New Category',
            'description': 'A new product category'
        }
        
        response = self.client.post('/api/categories/create/', category_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        category_id = response.data['id']
        
        # Step 2: Create product
        product_data = {
            'name': 'New Product',
            'description': 'A fantastic new product',
            'price': '199.99',
            'stock': True,
            'category': category_id,
            'is_featured': True
        }
        
        response = self.client.post('/api/products/create/', product_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        product_id = response.data['id']
        
        # Step 3: Update product
        update_data = {
            'name': 'Updated Product Name',
            'price': '249.99'
        }
        
        response = self.client.put(f'/api/products/edit/{product_id}/', update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Step 4: Verify regular user cannot manage products
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        
        response = self.client.post('/api/products/create/', product_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        response = self.client.put(f'/api/products/edit/{product_id}/', update_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Step 5: Admin can delete product
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        
        response = self.client.delete(f'/api/products/delete/{product_id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify product was deleted
        self.assertFalse(Product.objects.filter(id=product_id).exists())
        
    def test_order_management_workflow(self):
        """Test order management workflow"""
        # Create test order
        order = OrderModel.objects.create(
            name='Test Order',
            user=self.user,
            total_price=Decimal('99.99'),
            paid_status=True,
            is_delivered=False
        )
        
        # Regular user can view their orders
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        response = self.client.get('/account/orders/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Regular user cannot update order status
        response = self.client.put(f'/account/orders/update/{order.id}/', {
            'is_delivered': True,
            'delivered_at': datetime.now(timezone.utc).isoformat()
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Admin can view all orders
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.get('/account/orders/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Admin can update order status
        delivery_time = datetime.now(timezone.utc).isoformat()
        response = self.client.put(f'/account/orders/update/{order.id}/', {
            'is_delivered': True,
            'delivered_at': delivery_time
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify order was updated
        order.refresh_from_db()
        self.assertTrue(order.is_delivered) 