# E-commerce Application Testing Guide

## Overview

This guide covers the comprehensive testing framework implemented for the Django e-commerce application. The testing suite includes unit tests, integration tests, API tests, security tests, and performance tests.

## Test Structure

```
backend/tests/
├── __init__.py
├── unit/
│   ├── __init__.py
│   ├── test_models.py
│   └── test_views.py
├── integration/
│   ├── __init__.py
│   └── test_workflows.py
├── api/
│   ├── __init__.py
│   └── test_api_endpoints.py
├── security/
│   ├── __init__.py
│   └── test_security_vulnerabilities.py
└── performance/
    ├── __init__.py
    └── test_performance.py
```

## Running Tests

### Run All Tests
```bash
python manage.py test
```

### Run Specific Test Categories
```bash
# Unit tests only
python manage.py test tests.unit

# Integration tests only
python manage.py test tests.integration

# API tests only
python manage.py test tests.api

# Security tests only
python manage.py test tests.security

# Performance tests only
python manage.py test tests.performance
```

### Run with Coverage
```bash
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generates HTML report
```

### Custom Test Runner
```bash
python run_tests.py
```

## Test Categories

### 1. Unit Tests (`tests/unit/`)

Tests individual components in isolation:

- **Model Tests** (`test_models.py`):
  - Field validation
  - Model methods
  - Constraints and relationships
  - Custom validators

- **View Tests** (`test_views.py`):
  - Authentication and authorization
  - Request/response handling
  - Permission checks
  - Error handling

#### Example Unit Test:
```python
def test_product_creation(self):
    """Test creating a valid product"""
    product = Product.objects.create(
        name='Test Product',
        price=Decimal('99.99'),
        stock=True
    )
    self.assertEqual(str(product), 'Test Product')
    self.assertEqual(product.average_rating, 0)
```

### 2. Integration Tests (`tests/integration/`)

Tests complete user workflows:

- User registration and login
- Product browsing and searching
- Shopping cart operations
- Payment processing
- Review system
- Admin operations

#### Example Integration Test:
```python
def test_complete_cart_workflow(self):
    """Test complete shopping cart workflow"""
    # Add item to cart
    response = self.client.post('/api/cart/', {
        'product_id': self.product.id,
        'quantity': 2
    })
    self.assertEqual(response.status_code, 201)
    
    # Verify cart contents
    response = self.client.get('/api/cart/')
    self.assertEqual(response.data['total_items'], 1)
```

### 3. API Tests (`tests/api/`)

Tests REST API endpoints:

- Endpoint functionality
- Authentication requirements
- Input validation
- Error responses
- Content type handling
- Pagination and filtering

#### Example API Test:
```python
def test_products_list_endpoint(self):
    """Test products list endpoint"""
    response = self.client.get('/api/products/')
    self.assertEqual(response.status_code, 200)
    self.assertIn('results', response.data)
```

### 4. Security Tests (`tests/security/`)

Tests security vulnerabilities:

- Authentication bypass attempts
- SQL injection protection
- XSS prevention
- Authorization checks
- Input validation
- File upload security

#### Example Security Test:
```python
def test_sql_injection_attempts(self):
    """Test SQL injection protection"""
    malicious_query = "'; DROP TABLE auth_user; --"
    response = self.client.get(f'/api/products/?search={malicious_query}')
    self.assertNotEqual(response.status_code, 500)
```

### 5. Performance Tests (`tests/performance/`)

Tests application performance:

- Database query optimization
- API response times
- Concurrent request handling
- Memory usage
- Cache performance

#### Example Performance Test:
```python
def test_products_list_performance(self):
    """Test products list endpoint performance"""
    start_time = time.time()
    response = self.client.get('/api/products/')
    end_time = time.time()
    
    self.assertEqual(response.status_code, 200)
    self.assertLess(end_time - start_time, 2.0)  # Under 2 seconds
```

## Test Configuration

### Test Database
Tests use a separate test database that's created and destroyed for each test run.

### Test Settings
Key test configurations in `settings.py`:
```python
# Use in-memory database for faster tests
if 'test' in sys.argv:
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
    }
```

### Fixtures and Factories
Use Django fixtures or factory_boy for test data:

```python
# Using fixtures
@override_settings(FIXTURE_DIRS=['tests/fixtures/'])
class MyTestCase(TestCase):
    fixtures = ['test_users.json', 'test_products.json']

# Using factories (recommended)
import factory

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    
    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")
```

## Security Testing

### Automated Security Scans
```bash
# Install security tools
pip install bandit safety

# Run security scan
bandit -r . -f json -o security_report.json

# Check for known vulnerabilities
safety check
```

### Manual Security Testing
- SQL injection attempts
- XSS payload testing
- Authentication bypass
- Authorization escalation
- File upload attacks

## Performance Testing

### Load Testing
```bash
# Install locust for load testing
pip install locust

# Run load tests
locust -f tests/load_tests.py --host=http://localhost:8000
```

### Database Performance
- Query count monitoring
- N+1 query detection
- Index optimization
- Connection pooling

## Continuous Integration

### GitHub Actions Example
```yaml
name: Django Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
    - name: Run tests
      run: |
        python manage.py test
    - name: Run security checks
      run: |
        bandit -r .
```

## Test Best Practices

### 1. Test Naming
- Use descriptive test names
- Follow pattern: `test_what_when_expected`
- Example: `test_user_registration_with_valid_data_creates_user`

### 2. Test Structure
- Arrange: Set up test data
- Act: Execute the function/endpoint
- Assert: Verify the results

### 3. Test Isolation
- Each test should be independent
- Use `setUp()` and `tearDown()` methods
- Don't rely on test execution order

### 4. Mock External Services
```python
from unittest.mock import patch, Mock

@patch('payments.gateways.bkash.process_payment')
def test_payment_processing(self, mock_bkash):
    mock_bkash.return_value = {'status': 'success'}
    # Test payment logic without actual API call
```

### 5. Test Coverage Goals
- Aim for >90% code coverage
- Focus on critical business logic
- Test edge cases and error conditions

## Debugging Tests

### Running Specific Tests
```bash
# Run single test method
python manage.py test tests.unit.test_models.ProductModelTest.test_create_product

# Run with debugging
python manage.py test --debug-mode

# Run with verbose output
python manage.py test --verbosity=2
```

### Test Database Inspection
```python
# In test method, use this to inspect database
from django.db import connection
print(connection.queries)
```

## Manual Testing Checklist

### Functional Testing
- [ ] User registration and login
- [ ] Product browsing and filtering
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Payment processing
- [ ] Order management
- [ ] Admin functionality

### Security Testing
- [ ] Authentication bypass attempts
- [ ] SQL injection testing
- [ ] XSS payload testing
- [ ] File upload security
- [ ] Permission escalation attempts

### Performance Testing
- [ ] Page load times
- [ ] API response times
- [ ] Database query optimization
- [ ] Concurrent user handling

### Usability Testing
- [ ] User interface responsiveness
- [ ] Error message clarity
- [ ] Navigation flow
- [ ] Mobile compatibility

## Identified Issues and Fixes

### Critical Issues Fixed:
1. ✅ `status.status.HTTP_403_FORBIDDEN` typo
2. ✅ Missing authentication on address views
3. ✅ Database field type mismatch (delivered_at)
4. ✅ Missing database dependency (mysqlclient)

### Issues to Address:
1. ⚠️ Broad exception handling in views
2. ⚠️ PIN code validation regex mismatch
3. ⚠️ Missing rate limiting
4. ⚠️ Insufficient file upload validation
5. ⚠️ Missing input sanitization

See `fixes/security_fixes.py` for detailed solutions.

## Conclusion

This comprehensive testing framework ensures:
- Code quality and reliability
- Security vulnerability detection
- Performance optimization
- Regression prevention
- Confidence in deployments

Regular testing helps maintain a robust, secure, and performant e-commerce application. 