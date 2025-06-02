from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal
import json

from .models import Product, Category, Cart, Wishlist, Review


class CategoryModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name="Electronics",
            description="Electronic devices and gadgets"
        )

    def test_category_creation(self):
        self.assertEqual(self.category.name, "Electronics")
        self.assertEqual(str(self.category), "Electronics")

    def test_category_product_count(self):
        # Create products in category
        Product.objects.create(
            name="Test Product 1",
            price=Decimal('100.00'),
            stock=True,
            category=self.category
        )
        Product.objects.create(
            name="Test Product 2",
            price=Decimal('200.00'),
            stock=True,
            category=self.category
        )
        
        # Test product count through related manager
        self.assertEqual(self.category.products.count(), 2)


class ProductModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Test Category")
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.product = Product.objects.create(
            name="Test Product",
            description="A test product",
            price=Decimal('99.99'),
            stock=True,
            category=self.category
        )

    def test_product_creation(self):
        self.assertEqual(self.product.name, "Test Product")
        self.assertEqual(self.product.price, Decimal('99.99'))
        self.assertTrue(self.product.stock)
        self.assertEqual(self.product.category, self.category)

    def test_product_average_rating(self):
        # Create reviews
        Review.objects.create(
            product=self.product,
            user=self.user,
            rating=5,
            comment="Great product!"
        )
        
        user2 = User.objects.create_user(username="user2", email="user2@test.com", password="pass")
        Review.objects.create(
            product=self.product,
            user=user2,
            rating=3,
            comment="Okay product"
        )
        
        self.assertEqual(self.product.average_rating, 4.0)
        self.assertEqual(self.product.review_count, 2)


class CartModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.product = Product.objects.create(
            name="Test Product",
            price=Decimal('50.00'),
            stock=True
        )

    def test_cart_creation(self):
        cart_item = Cart.objects.create(
            user=self.user,
            product=self.product,
            quantity=2
        )
        
        self.assertEqual(cart_item.quantity, 2)
        self.assertEqual(cart_item.total_price, Decimal('100.00'))
        self.assertEqual(str(cart_item), f"{self.user.username} - {self.product.name} (2)")

    def test_cart_unique_constraint(self):
        # Create first cart item
        Cart.objects.create(
            user=self.user,
            product=self.product,
            quantity=1
        )
        
        # Try to create duplicate - should fail
        with self.assertRaises(Exception):
            Cart.objects.create(
                user=self.user,
                product=self.product,
                quantity=1
            )


class CartAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.product = Product.objects.create(
            name="Test Product",
            price=Decimal('25.00'),
            stock=True
        )
        self.client.force_authenticate(user=self.user)

    def test_add_to_cart(self):
        url = reverse('cart')
        data = {
            'product_id': self.product.id,
            'quantity': 2
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Cart.objects.count(), 1)
        cart_item = Cart.objects.first()
        self.assertEqual(cart_item.quantity, 2)

    def test_get_cart(self):
        # Add item to cart
        Cart.objects.create(
            user=self.user,
            product=self.product,
            quantity=3
        )
        
        url = reverse('cart')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_items'], 1)
        self.assertEqual(response.data['total_price'], '75.00')
        self.assertEqual(len(response.data['items']), 1)

    def test_update_cart_item(self):
        cart_item = Cart.objects.create(
            user=self.user,
            product=self.product,
            quantity=1
        )
        
        url = reverse('cart-item', kwargs={'pk': cart_item.id})
        data = {'quantity': 5}
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        cart_item.refresh_from_db()
        self.assertEqual(cart_item.quantity, 5)

    def test_remove_from_cart(self):
        cart_item = Cart.objects.create(
            user=self.user,
            product=self.product,
            quantity=1
        )
        
        url = reverse('cart-item', kwargs={'pk': cart_item.id})
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Cart.objects.count(), 0)


class WishlistAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.product = Product.objects.create(
            name="Test Product",
            price=Decimal('100.00'),
            stock=True
        )
        self.client.force_authenticate(user=self.user)

    def test_add_to_wishlist(self):
        url = reverse('wishlist')
        data = {'product_id': self.product.id}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Wishlist.objects.count(), 1)

    def test_get_wishlist(self):
        Wishlist.objects.create(user=self.user, product=self.product)
        
        url = reverse('wishlist')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_remove_from_wishlist(self):
        Wishlist.objects.create(user=self.user, product=self.product)
        
        url = reverse('wishlist-item', kwargs={'pk': self.product.id})
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Wishlist.objects.count(), 0)


class ReviewAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.product = Product.objects.create(
            name="Test Product",
            price=Decimal('100.00'),
            stock=True
        )
        self.client.force_authenticate(user=self.user)

    def test_create_review(self):
        url = reverse('product-reviews', kwargs={'product_id': self.product.id})
        data = {
            'rating': 5,
            'comment': 'Excellent product!'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)
        review = Review.objects.first()
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.comment, 'Excellent product!')

    def test_get_product_reviews(self):
        Review.objects.create(
            product=self.product,
            user=self.user,
            rating=4,
            comment="Good product"
        )
        
        url = reverse('product-reviews', kwargs={'product_id': self.product.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_duplicate_review_prevention(self):
        # Create first review
        Review.objects.create(
            product=self.product,
            user=self.user,
            rating=5,
            comment="First review"
        )
        
        # Try to create second review
        url = reverse('product-reviews', kwargs={'product_id': self.product.id})
        data = {
            'rating': 3,
            'comment': 'Second review'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Review.objects.count(), 1)


class ProductFilterTest(APITestCase):
    def setUp(self):
        self.category1 = Category.objects.create(name="Electronics")
        self.category2 = Category.objects.create(name="Books")
        
        Product.objects.create(
            name="Laptop",
            price=Decimal('1000.00'),
            stock=True,
            category=self.category1
        )
        Product.objects.create(
            name="Phone",
            price=Decimal('500.00'),
            stock=False,
            category=self.category1
        )
        Product.objects.create(
            name="Book",
            price=Decimal('20.00'),
            stock=True,
            category=self.category2
        )

    def test_filter_by_category(self):
        url = reverse('products-list')
        response = self.client.get(url, {'category': self.category1.id})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_filter_by_price_range(self):
        url = reverse('products-list')
        response = self.client.get(url, {'price_min': 100, 'price_max': 600})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_filter_by_stock(self):
        url = reverse('products-list')
        response = self.client.get(url, {'stock': 'true'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_search_products(self):
        url = reverse('products-list')
        response = self.client.get(url, {'search': 'laptop'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Laptop')