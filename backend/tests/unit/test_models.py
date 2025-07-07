"""
Unit tests for all models in the e-commerce application
"""
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from decimal import Decimal
from datetime import datetime, timezone

from account.models import BillingAddress, OrderModel
from product.models import Category, Product, Cart, Wishlist, Review
from payments.models import PaymentMethod, Payment, BkashPayment, CardPayment, PaymentLog


class BillingAddressModelTest(TestCase):
    """Test BillingAddress model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
    def test_create_billing_address(self):
        """Test creating a valid billing address"""
        address = BillingAddress.objects.create(
            name='Test User',
            user=self.user,
            phone_number='+8801712345678',
            pin_code='123456',
            house_no='123 Test Street',
            landmark='Near Test Mall',
            city='Dhaka',
            state='Dhaka Division'
        )
        self.assertEqual(str(address), 'Test User')
        self.assertEqual(address.user, self.user)
        
    def test_phone_number_validation(self):
        """Test phone number validation"""
        # Invalid phone number
        address = BillingAddress(
            name='Test User',
            user=self.user,
            phone_number='invalid',
            pin_code='123456',
            house_no='123',
            landmark='Test',
            city='Dhaka',
            state='Dhaka'
        )
        with self.assertRaises(ValidationError):
            address.full_clean()
            
    def test_pin_code_validation(self):
        """Test PIN code validation"""
        # PIN code with non-digits should fail
        address = BillingAddress(
            name='Test User',
            user=self.user,
            phone_number='+8801712345678',
            pin_code='ABC123',
            house_no='123',
            landmark='Test',
            city='Dhaka',
            state='Dhaka'
        )
        with self.assertRaises(ValidationError):
            address.full_clean()


class OrderModelTest(TestCase):
    """Test OrderModel"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
    def test_create_order(self):
        """Test creating an order"""
        order = OrderModel.objects.create(
            name='Test Order',
            ordered_item='Product 1, Product 2',
            address='123 Test Street',
            paid_status=True,
            paid_at=datetime.now(timezone.utc),
            total_price=Decimal('99.99'),
            is_delivered=False,
            user=self.user
        )
        self.assertEqual(str(order), f'Order {order.id} - Test Order')
        self.assertTrue(order.paid_status)
        self.assertFalse(order.is_delivered)
        
    def test_delivered_at_datetime_field(self):
        """Test that delivered_at is a DateTimeField"""
        order = OrderModel.objects.create(
            name='Test Order',
            user=self.user,
            delivered_at=datetime.now(timezone.utc)
        )
        self.assertIsInstance(order.delivered_at, datetime)


class CategoryModelTest(TestCase):
    """Test Category model"""
    
    def test_create_category(self):
        """Test creating a category"""
        category = Category.objects.create(
            name='Electronics',
            description='Electronic products'
        )
        self.assertEqual(str(category), 'Electronics')
        self.assertEqual(Category.objects.count(), 1)
        
    def test_category_unique_name(self):
        """Test category name uniqueness"""
        Category.objects.create(name='Electronics')
        with self.assertRaises(Exception):
            Category.objects.create(name='Electronics')


class ProductModelTest(TestCase):
    """Test Product model"""
    
    def setUp(self):
        self.category = Category.objects.create(name='Electronics')
        
    def test_create_product(self):
        """Test creating a product"""
        product = Product.objects.create(
            name='Test Product',
            description='Test description',
            price=Decimal('99.99'),
            stock=True,
            category=self.category
        )
        self.assertEqual(str(product), 'Test Product')
        self.assertEqual(product.average_rating, 0)
        self.assertEqual(product.review_count, 0)
        
    def test_product_image_validation(self):
        """Test product image size validation"""
        # Create a large image (>5MB)
        large_image = SimpleUploadedFile(
            name='large_image.jpg',
            content=b'x' * (6 * 1024 * 1024),  # 6MB
            content_type='image/jpeg'
        )
        
        product = Product(
            name='Test Product',
            price=Decimal('99.99'),
            stock=True,
            image=large_image
        )
        
        with self.assertRaises(ValidationError):
            product.full_clean()
            
    def test_average_rating_calculation(self):
        """Test average rating calculation"""
        product = Product.objects.create(
            name='Test Product',
            price=Decimal('99.99'),
            stock=True
        )
        
        user1 = User.objects.create_user('user1')
        user2 = User.objects.create_user('user2')
        
        Review.objects.create(product=product, user=user1, rating=5, comment='Great!')
        Review.objects.create(product=product, user=user2, rating=3, comment='OK')
        
        self.assertEqual(product.average_rating, 4.0)
        self.assertEqual(product.review_count, 2)


class CartModelTest(TestCase):
    """Test Cart model"""
    
    def setUp(self):
        self.user = User.objects.create_user('testuser')
        self.product = Product.objects.create(
            name='Test Product',
            price=Decimal('50.00'),
            stock=True
        )
        
    def test_create_cart_item(self):
        """Test creating a cart item"""
        cart_item = Cart.objects.create(
            user=self.user,
            product=self.product,
            quantity=2
        )
        self.assertEqual(cart_item.total_price, Decimal('100.00'))
        self.assertEqual(str(cart_item), 'testuser - Test Product (2)')
        
    def test_cart_unique_constraint(self):
        """Test unique constraint on user-product combination"""
        Cart.objects.create(user=self.user, product=self.product)
        with self.assertRaises(Exception):
            Cart.objects.create(user=self.user, product=self.product)


class WishlistModelTest(TestCase):
    """Test Wishlist model"""
    
    def setUp(self):
        self.user = User.objects.create_user('testuser')
        self.product = Product.objects.create(
            name='Test Product',
            price=Decimal('50.00'),
            stock=True
        )
        
    def test_create_wishlist_item(self):
        """Test creating a wishlist item"""
        wishlist_item = Wishlist.objects.create(
            user=self.user,
            product=self.product
        )
        self.assertEqual(str(wishlist_item), 'testuser - Test Product')
        
    def test_wishlist_unique_constraint(self):
        """Test unique constraint on user-product combination"""
        Wishlist.objects.create(user=self.user, product=self.product)
        with self.assertRaises(Exception):
            Wishlist.objects.create(user=self.user, product=self.product)


class ReviewModelTest(TestCase):
    """Test Review model"""
    
    def setUp(self):
        self.user = User.objects.create_user('testuser')
        self.product = Product.objects.create(
            name='Test Product',
            price=Decimal('50.00'),
            stock=True
        )
        
    def test_create_review(self):
        """Test creating a review"""
        review = Review.objects.create(
            product=self.product,
            user=self.user,
            rating=5,
            comment='Excellent product!'
        )
        self.assertEqual(str(review), 'testuser - Test Product (5★)')
        self.assertFalse(review.is_verified)
        
    def test_rating_validation(self):
        """Test rating validation (1-5)"""
        # Test rating < 1
        review = Review(
            product=self.product,
            user=self.user,
            rating=0,
            comment='Test'
        )
        with self.assertRaises(ValidationError):
            review.full_clean()
            
        # Test rating > 5
        review.rating = 6
        with self.assertRaises(ValidationError):
            review.full_clean()
            
    def test_review_unique_constraint(self):
        """Test unique constraint on product-user combination"""
        Review.objects.create(
            product=self.product,
            user=self.user,
            rating=5,
            comment='Test'
        )
        with self.assertRaises(Exception):
            Review.objects.create(
                product=self.product,
                user=self.user,
                rating=4,
                comment='Another review'
            )
            
    def test_auto_verification(self):
        """Test auto-verification when user has purchased product"""
        # Create an order with the product
        OrderModel.objects.create(
            name='Test Order',
            ordered_item='Test Product',
            user=self.user,
            paid_status=True
        )
        
        # Create review
        review = Review.objects.create(
            product=self.product,
            user=self.user,
            rating=5,
            comment='Great!'
        )
        
        self.assertTrue(review.is_verified)


class PaymentModelTest(TestCase):
    """Test Payment models"""
    
    def setUp(self):
        self.user = User.objects.create_user('testuser')
        self.payment_method = PaymentMethod.objects.create(
            name='bkash',
            display_name='bKash',
            is_active=True
        )
        
    def test_create_payment(self):
        """Test creating a payment"""
        payment = Payment.objects.create(
            user=self.user,
            payment_method=self.payment_method,
            amount=Decimal('100.00'),
            currency='BDT',
            status='pending',
            transaction_id='TEST123'
        )
        self.assertEqual(
            str(payment),
            f'Payment TEST123 - testuser - 100.00 BDT'
        )
        self.assertFalse(payment.is_successful)
        self.assertFalse(payment.can_be_refunded)
        
    def test_payment_status_properties(self):
        """Test payment status properties"""
        payment = Payment.objects.create(
            user=self.user,
            payment_method=self.payment_method,
            amount=Decimal('100.00'),
            status='completed'
        )
        self.assertTrue(payment.is_successful)
        self.assertTrue(payment.can_be_refunded)
        
        # Test with partial refund
        payment.refund_amount = Decimal('50.00')
        payment.save()
        self.assertTrue(payment.can_be_refunded)
        
        # Test with full refund
        payment.refund_amount = Decimal('100.00')
        payment.save()
        self.assertFalse(payment.can_be_refunded)


class BkashPaymentModelTest(TestCase):
    """Test BkashPayment model"""
    
    def setUp(self):
        self.user = User.objects.create_user('testuser')
        self.payment_method = PaymentMethod.objects.create(
            name='bkash',
            display_name='bKash'
        )
        self.payment = Payment.objects.create(
            user=self.user,
            payment_method=self.payment_method,
            amount=Decimal('100.00')
        )
        
    def test_create_bkash_payment(self):
        """Test creating a bKash payment"""
        bkash_payment = BkashPayment.objects.create(
            payment=self.payment,
            mobile_number='01712345678',
            bkash_transaction_id='BKS123456'
        )
        self.assertEqual(
            str(bkash_payment),
            'bKash Payment - 01712345678 - 100.00'
        )
        
    def test_mobile_number_validation(self):
        """Test mobile number length validation"""
        bkash_payment = BkashPayment(
            payment=self.payment,
            mobile_number='123'  # Too short
        )
        with self.assertRaises(ValidationError):
            bkash_payment.full_clean()


class CardPaymentModelTest(TestCase):
    """Test CardPayment model"""
    
    def setUp(self):
        self.user = User.objects.create_user('testuser')
        self.payment_method = PaymentMethod.objects.create(
            name='visa',
            display_name='Visa'
        )
        self.payment = Payment.objects.create(
            user=self.user,
            payment_method=self.payment_method,
            amount=Decimal('100.00')
        )
        
    def test_create_card_payment(self):
        """Test creating a card payment"""
        card_payment = CardPayment.objects.create(
            payment=self.payment,
            card_type='visa',
            card_last_four='1234',
            card_holder_name='Test User'
        )
        self.assertEqual(
            str(card_payment),
            'visa ending in 1234 - 100.00'
        ) 