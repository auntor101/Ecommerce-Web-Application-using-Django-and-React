"""
Performance tests for the e-commerce application
"""
import time
import threading
from django.test import TestCase, TransactionTestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from decimal import Decimal
from django.db import connection
from django.test.utils import override_settings

from account.models import BillingAddress, OrderModel
from product.models import Category, Product, Cart, Wishlist, Review
from payments.models import PaymentMethod, Payment


class DatabasePerformanceTest(TransactionTestCase):
    """Test database performance"""
    
    def setUp(self):
        self.category = Category.objects.create(name='Electronics')
        
    def test_bulk_product_creation_performance(self):
        """Test bulk product creation performance"""
        start_time = time.time()
        
        # Create 1000 products
        products = []
        for i in range(1000):
            products.append(Product(
                name=f'Product {i}',
                description=f'Description {i}',
                price=Decimal('99.99'),
                stock=True,
                category=self.category
            ))
            
        Product.objects.bulk_create(products)
        
        end_time = time.time()
        creation_time = end_time - start_time
        
        # Should create 1000 products in under 5 seconds
        self.assertLess(creation_time, 5.0)
        self.assertEqual(Product.objects.count(), 1000)
        
    def test_query_performance_with_large_dataset(self):
        """Test query performance with large dataset"""
        # Create test data
        users = []
        for i in range(100):
            users.append(User(
                username=f'user{i}',
                email=f'user{i}@example.com'
            ))
        User.objects.bulk_create(users)
        
        products = []
        for i in range(500):
            products.append(Product(
                name=f'Product {i}',
                price=Decimal('99.99'),
                stock=True,
                category=self.category
            ))
        Product.objects.bulk_create(products)
        
        # Test query performance
        start_time = time.time()
        
        # Complex query with joins
        products_with_category = Product.objects.select_related('category').all()[:50]
        list(products_with_category)  # Force evaluation
        
        end_time = time.time()
        query_time = end_time - start_time
        
        # Query should complete in under 1 second
        self.assertLess(query_time, 1.0)
        
    def test_n_plus_one_query_prevention(self):
        """Test N+1 query prevention"""
        # Create test data
        user = User.objects.create_user('testuser', 'test@example.com')
        products = []
        for i in range(20):
            products.append(Product(
                name=f'Product {i}',
                price=Decimal('99.99'),
                stock=True,
                category=self.category
            ))
        Product.objects.bulk_create(products)
        
        # Create cart items
        for product in Product.objects.all():
            Cart.objects.create(user=user, product=product, quantity=1)
            
        # Test query count
        with self.assertNumQueries(2):  # Should be 2 queries max with proper optimization
            cart_items = Cart.objects.select_related('product').filter(user=user)
            for item in cart_items:
                _ = item.product.name  # Access related field
                
    def test_database_connection_pooling(self):
        """Test database connection handling"""
        def make_query():
            return Product.objects.count()
            
        # Make multiple concurrent queries
        threads = []
        results = []
        
        def query_worker():
            try:
                result = make_query()
                results.append(result)
            except Exception as e:
                results.append(f"Error: {e}")
                
        # Create 20 threads
        for i in range(20):
            thread = threading.Thread(target=query_worker)
            threads.append(thread)
            
        start_time = time.time()
        
        # Start all threads
        for thread in threads:
            thread.start()
            
        # Wait for completion
        for thread in threads:
            thread.join()
            
        end_time = time.time()
        total_time = end_time - start_time
        
        # All queries should complete without errors
        self.assertEqual(len(results), 20)
        for result in results:
            self.assertIsInstance(result, int)
            
        # Should complete in reasonable time
        self.assertLess(total_time, 10.0)


class APIPerformanceTest(APITestCase):
    """Test API endpoint performance"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            'testuser', 'test@example.com', 'testpass123'
        )
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        # Create test data
        self.category = Category.objects.create(name='Electronics')
        
        # Create multiple products for testing
        products = []
        for i in range(100):
            products.append(Product(
                name=f'Product {i}',
                description=f'Description for product {i}',
                price=Decimal('99.99'),
                stock=True,
                category=self.category,
                is_featured=(i % 10 == 0)
            ))
        Product.objects.bulk_create(products)
        
    def test_product_list_api_performance(self):
        """Test product list API performance"""
        start_time = time.time()
        
        response = self.client.get('/api/products/')
        
        end_time = time.time()
        response_time = end_time - start_time
        
        self.assertEqual(response.status_code, 200)
        # Should respond in under 2 seconds
        self.assertLess(response_time, 2.0)
        
    def test_product_search_performance(self):
        """Test product search performance"""
        search_queries = [
            'Product',
            'Electronics',
            'Description',
            '99.99',
            'NonExistent'
        ]
        
        for query in search_queries:
            start_time = time.time()
            
            response = self.client.get(f'/api/products/?search={query}')
            
            end_time = time.time()
            response_time = end_time - start_time
            
            self.assertEqual(response.status_code, 200)
            # Each search should complete in under 3 seconds
            self.assertLess(response_time, 3.0)
            
    def test_filtering_performance(self):
        """Test filtering performance"""
        filter_params = [
            f'?category={self.category.id}',
            '?price_min=50&price_max=150',
            '?stock=true',
            '?featured=true',
            '?ordering=price'
        ]
        
        for params in filter_params:
            start_time = time.time()
            
            response = self.client.get(f'/api/products/{params}')
            
            end_time = time.time()
            response_time = end_time - start_time
            
            self.assertEqual(response.status_code, 200)
            # Filtering should be fast
            self.assertLess(response_time, 2.0)
            
    def test_pagination_performance(self):
        """Test pagination performance"""
        page_sizes = [10, 20, 50]
        
        for page_size in page_sizes:
            start_time = time.time()
            
            response = self.client.get(f'/api/products/?page_size={page_size}')
            
            end_time = time.time()
            response_time = end_time - start_time
            
            self.assertEqual(response.status_code, 200)
            # Pagination should not significantly affect performance
            self.assertLess(response_time, 2.0)
            
    def test_cart_operations_performance(self):
        """Test cart operations performance"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        product = Product.objects.first()
        
        # Test adding to cart
        start_time = time.time()
        
        response = self.client.post('/api/cart/', {
            'product_id': product.id,
            'quantity': 1
        })
        
        end_time = time.time()
        add_time = end_time - start_time
        
        self.assertEqual(response.status_code, 201)
        self.assertLess(add_time, 1.0)
        
        # Test getting cart
        start_time = time.time()
        
        response = self.client.get('/api/cart/')
        
        end_time = time.time()
        get_time = end_time - start_time
        
        self.assertEqual(response.status_code, 200)
        self.assertLess(get_time, 1.0)
        
    def test_concurrent_api_requests(self):
        """Test handling of concurrent API requests"""
        results = []
        
        def make_request():
            start_time = time.time()
            response = self.client.get('/api/products/')
            end_time = time.time()
            
            results.append({
                'status_code': response.status_code,
                'response_time': end_time - start_time
            })
            
        # Create 20 concurrent threads
        threads = []
        for i in range(20):
            thread = threading.Thread(target=make_request)
            threads.append(thread)
            
        overall_start = time.time()
        
        # Start all threads
        for thread in threads:
            thread.start()
            
        # Wait for all to complete
        for thread in threads:
            thread.join()
            
        overall_end = time.time()
        total_time = overall_end - overall_start
        
        # All requests should succeed
        self.assertEqual(len(results), 20)
        for result in results:
            self.assertEqual(result['status_code'], 200)
            self.assertLess(result['response_time'], 5.0)
            
        # Total time should be reasonable
        self.assertLess(total_time, 30.0)


class MemoryPerformanceTest(TestCase):
    """Test memory usage performance"""
    
    def setUp(self):
        self.category = Category.objects.create(name='Electronics')
        
    def test_memory_usage_with_large_querysets(self):
        """Test memory usage with large querysets"""
        import psutil
        import os
        
        # Get initial memory usage
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss / 1024 / 1024  # MB
        
        # Create large dataset
        products = []
        for i in range(5000):
            products.append(Product(
                name=f'Product {i}',
                description=f'Long description for product {i} ' * 10,
                price=Decimal('99.99'),
                stock=True,
                category=self.category
            ))
        Product.objects.bulk_create(products)
        
        # Query large dataset using iterator to avoid loading all into memory
        product_count = 0
        for product in Product.objects.iterator():
            product_count += 1
            
        # Check memory usage after processing
        final_memory = process.memory_info().rss / 1024 / 1024  # MB
        memory_increase = final_memory - initial_memory
        
        self.assertEqual(product_count, 5000)
        # Memory increase should be reasonable (less than 500MB)
        self.assertLess(memory_increase, 500)
        
    def test_queryset_caching_behavior(self):
        """Test queryset caching to prevent excessive memory usage"""
        # Create test data
        products = []
        for i in range(1000):
            products.append(Product(
                name=f'Product {i}',
                price=Decimal('99.99'),
                stock=True,
                category=self.category
            ))
        Product.objects.bulk_create(products)
        
        # Test that querysets don't cache excessively
        queryset = Product.objects.all()
        
        # Multiple iterations should not exponentially increase memory
        for _ in range(3):
            count = sum(1 for _ in queryset.iterator())
            self.assertEqual(count, 1000)


class CachePerformanceTest(TestCase):
    """Test caching performance"""
    
    @override_settings(CACHES={
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        }
    })
    def test_cache_hit_performance(self):
        """Test cache hit performance"""
        from django.core.cache import cache
        
        # Test cache write performance
        start_time = time.time()
        
        for i in range(1000):
            cache.set(f'key_{i}', f'value_{i}', timeout=300)
            
        end_time = time.time()
        write_time = end_time - start_time
        
        # Cache writes should be fast
        self.assertLess(write_time, 2.0)
        
        # Test cache read performance
        start_time = time.time()
        
        for i in range(1000):
            value = cache.get(f'key_{i}')
            self.assertEqual(value, f'value_{i}')
            
        end_time = time.time()
        read_time = end_time - start_time
        
        # Cache reads should be very fast
        self.assertLess(read_time, 1.0)
        
    def test_cache_miss_handling(self):
        """Test cache miss handling performance"""
        from django.core.cache import cache
        
        # Clear cache
        cache.clear()
        
        start_time = time.time()
        
        # Try to get non-existent keys
        for i in range(1000):
            value = cache.get(f'nonexistent_key_{i}')
            self.assertIsNone(value)
            
        end_time = time.time()
        miss_time = end_time - start_time
        
        # Cache misses should still be fast
        self.assertLess(miss_time, 2.0)


class FileOperationPerformanceTest(TestCase):
    """Test file operation performance"""
    
    def test_image_upload_performance(self):
        """Test image upload performance"""
        from django.core.files.uploadedfile import SimpleUploadedFile
        from django.core.files.storage import default_storage
        
        # Create test image data
        image_data = b'x' * (1024 * 1024)  # 1MB of data
        
        start_time = time.time()
        
        # Simulate multiple image uploads
        for i in range(10):
            uploaded_file = SimpleUploadedFile(
                f'test_image_{i}.jpg',
                image_data,
                content_type='image/jpeg'
            )
            
            # Save file
            filename = default_storage.save(f'test/image_{i}.jpg', uploaded_file)
            self.assertTrue(default_storage.exists(filename))
            
        end_time = time.time()
        upload_time = end_time - start_time
        
        # 10 x 1MB uploads should complete in reasonable time
        self.assertLess(upload_time, 10.0)
        
        # Cleanup
        for i in range(10):
            filename = f'test/image_{i}.jpg'
            if default_storage.exists(filename):
                default_storage.delete(filename)


class LoadTestSimulation(APITestCase):
    """Simulate load testing scenarios"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create test users
        self.users = []
        for i in range(10):
            user = User.objects.create_user(
                f'user{i}', f'user{i}@example.com', 'pass123'
            )
            self.users.append(user)
            
        # Create test products
        category = Category.objects.create(name='Electronics')
        products = []
        for i in range(50):
            products.append(Product(
                name=f'Product {i}',
                price=Decimal('99.99'),
                stock=True,
                category=category
            ))
        Product.objects.bulk_create(products)
        
    def test_simulated_user_load(self):
        """Simulate multiple users browsing simultaneously"""
        results = []
        
        def simulate_user_session(user):
            # Get JWT token
            refresh = RefreshToken.for_user(user)
            token = str(refresh.access_token)
            
            client = APIClient()
            client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
            
            session_start = time.time()
            errors = 0
            
            try:
                # Simulate user browsing behavior
                # 1. View products
                response = client.get('/api/products/')
                if response.status_code != 200:
                    errors += 1
                    
                # 2. View product details
                response = client.get('/api/products/1/')
                if response.status_code != 200:
                    errors += 1
                    
                # 3. Add to cart
                response = client.post('/api/cart/', {
                    'product_id': 1,
                    'quantity': 1
                })
                if response.status_code not in [200, 201]:
                    errors += 1
                    
                # 4. View cart
                response = client.get('/api/cart/')
                if response.status_code != 200:
                    errors += 1
                    
            except Exception as e:
                errors += 1
                
            session_end = time.time()
            session_time = session_end - session_start
            
            results.append({
                'user': user.username,
                'session_time': session_time,
                'errors': errors
            })
            
        # Create threads for concurrent users
        threads = []
        for user in self.users:
            thread = threading.Thread(target=simulate_user_session, args=(user,))
            threads.append(thread)
            
        overall_start = time.time()
        
        # Start all user sessions
        for thread in threads:
            thread.start()
            
        # Wait for all sessions to complete
        for thread in threads:
            thread.join()
            
        overall_end = time.time()
        total_time = overall_end - overall_start
        
        # Analyze results
        self.assertEqual(len(results), len(self.users))
        
        total_errors = sum(result['errors'] for result in results)
        avg_session_time = sum(result['session_time'] for result in results) / len(results)
        
        # Performance assertions
        self.assertEqual(total_errors, 0)  # No errors should occur
        self.assertLess(avg_session_time, 10.0)  # Average session under 10 seconds
        self.assertLess(total_time, 30.0)  # All sessions complete in 30 seconds 