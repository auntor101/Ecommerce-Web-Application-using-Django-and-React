# ShopEasy Backend API

A modern, feature-rich Django REST API for an e-commerce platform with advanced product management, cart functionality, wishlist, reviews, and integrated payment processing.

## 🚀 Features

### Core Features
- **Product Management**: CRUD operations with categories, filtering, search, and pagination
- **Shopping Cart**: Add, update, remove items with persistent storage
- **Wishlist**: Save favorite products for later
- **Product Reviews**: User reviews and ratings with verification
- **Advanced Search**: Filter by category, price range, stock status, ratings
- **User Authentication**: JWT-based authentication with secure endpoints

### Payment Integration
- **Multiple Payment Methods**: bKash, Visa, MasterCard, Cash on Delivery
- **Secure Processing**: Transaction logging and status tracking
- **Payment History**: Complete transaction records for users and admins
- **Mock Payment System**: Testing environment with simulated payments

### Admin Features
- **Enhanced Admin Panel**: Modern interface with detailed statistics
- **Order Management**: Track and update order statuses
- **User Management**: Comprehensive user and address management
- **Analytics Dashboard**: Payment and order analytics

## 🛠️ Technology Stack

- **Framework**: Django 4.2.7 + Django REST Framework 3.14.0
- **Database**: MySQL with optimized queries
- **Authentication**: JWT (Simple JWT)
- **File Storage**: Local media storage with organized structure
- **Payment Processing**: Integrated bKash and card payment systems (Mock)
- **Testing**: Comprehensive test suite with coverage

## 📋 Prerequisites

- Python 3.8+
- MySQL 8.0+
- pip (Python package manager)
- Virtual environment (recommended)

## ⚡ Quick Setup

### 1. Environment Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Configuration
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE shopeasy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON shopeasy_db.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Environment Variables
```bash
cp .env.example .env
# Edit .env with your DB credentials and secrets
```

### 4. Run Setup Command
```bash
python manage.py setup_shopeasy
```

### 5. Start Development Server
```bash
python manage.py runserver
```

API will be available at: `http://localhost:8000/`

## 📖 API Documentation

### Base URL
```
http://localhost:8000/api/
```

### Authentication
```bash
# Login to get JWT token
POST /account/login/
{
    "username": "your_username",
    "password": "your_password"
}

# Use token in requests
Authorization: Bearer <your_token>
```

### Core Endpoints

#### Products
```bash
GET    /api/products/                    # List products with filtering
GET    /api/product/{id}/                # Product details
POST   /api/product-create/              # Create product (admin)
PUT    /api/product-update/{id}/         # Update product (admin)
DELETE /api/product-delete/{id}/         # Delete product (admin)
```

#### Categories
```bash
GET    /api/categories/                  # List categories
POST   /api/category-create/             # Create category (admin)
```

#### Shopping Cart
```bash
GET    /api/cart/                        # Get cart items
POST   /api/cart/                        # Add to cart
PUT    /api/cart/item/{id}/              # Update cart item
DELETE /api/cart/item/{id}/              # Remove from cart
DELETE /api/cart/clear/                  # Clear entire cart
```

#### Wishlist
```bash
GET    /api/wishlist/                    # Get wishlist
POST   /api/wishlist/                    # Add to wishlist
DELETE /api/wishlist/item/{product_id}/  # Remove from wishlist
```

#### Reviews
```bash
GET    /api/product/{id}/reviews/        # Get product reviews
POST   /api/product/{id}/reviews/        # Add review
PUT    /api/review/{id}/                 # Update review
DELETE /api/review/{id}/                 # Delete review
```

#### Payments
```bash
GET    /payments/methods/                # Available payment methods
POST   /payments/process/                # Unified payment processing
POST   /payments/bkash/                  # bKash payment
POST   /payments/card/                   # Card payment
GET    /payments/history/                # Payment history
GET    /payments/status/{transaction_id}/# Payment status
```


#### Product Filtering
```bash
# Filter examples
/api/products/?category=1                # Filter by category
/api/products/?price_min=100&price_max=500  # Price range
/api/products/?stock=true                # In stock only
/api/products/?search=laptop             # Search products
/api/products/?ordering=price_low        # Sort by price
/api/products/?page=2                    # Pagination
```

#### Advanced Filtering
```bash
# Multiple filters
/api/products/?category=1&stock=true&price_max=1000&ordering=rating

# Search with filters
/api/products/?search=phone&category=1&stock=true
```

## 💳 Payment Integration

### Mock Payments (Development)
```bash
POST /payments/mock-payment/
{
    "payment_method": "bkash",
    "amount": 1000,
    "paid_status": true
}
```

### bKash Payment
```bash
POST /payments/bkash/
{
    "mobile_number": "01712345678",
    "amount": "500.00",
    "pin": "1234"
}
```

### Card Payment
```bash
POST /payments/card/
{
    "card_holder_name": "John Doe",
    "card_number": "4111111111111111",
    "expiry_date": "12/25",
    "cvv": "123",
    "card_type": "visa",
    "amount": "300.00"
}
```

## 🔧 Management Commands

### Setup Command
```bash
# Full application setup
python manage.py setup_shopeasy

# Setup with custom admin credentials
python manage.py setup_shopeasy --admin-username myuser --admin-password mypass123
```

### Data Cleanup
```bash
# Clean old cart items and logs
python manage.py cleanup_data --days 30 --cleanup-carts --cleanup-logs

# Dry run to see what would be deleted
python manage.py cleanup_data --dry-run
```

### Load Initial Data
```bash
# Load categories and payment methods separately
python manage.py loaddata initial_categories.json
python manage.py loaddata initial_payment_methods.json
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test product
python manage.py test payments

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generate HTML report
```

### Test Categories
- **Product Tests**: Model validation, API endpoints, filtering
- **Cart Tests**: CRUD operations, constraints, calculations
- **Wishlist Tests**: Add/remove functionality, user isolation
- **Payment Tests**: Processing, security, transaction logging
- **Authentication Tests**: JWT token handling, permissions

## 📊 Admin Interface

Access the admin panel at: `http://localhost:8000/admin/`

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

### Admin Features
- **Product Management**: Bulk editing, filtering, statistics
- **Order Tracking**: Status updates, delivery management
- **Payment Monitoring**: Transaction logs, refund handling
- **User Management**: User details, address management
- **Analytics**: Sales reports, popular products

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Permission Controls**: Role-based access (admin/user)
- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: Django ORM protection
- **CORS Configuration**: Controlled cross-origin requests
- **Rate Limiting**: API rate limiting (configurable)



## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check MySQL service
   sudo systemctl status mysql
   
   # Verify credentials in .env
   # Test connection manually
   mysql -u username -p database_name
   ```

2. **Migration Issues**
   ```bash
   # Reset migrations (development only)
   python manage.py migrate product zero
   python manage.py makemigrations product
   python manage.py migrate
   ```

3. **Permission Denied**
   ```bash
   # Check file permissions
   chmod 755 media/
   chmod 644 .env
   ```

4. **CORS Issues**
   ```bash
   # Update CORS settings in settings.py
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",  # Your frontend URL
   ]
   ```

## 📞 API Support

- **Health Check**: `GET /api/health/`
- **API Documentation**: `GET /api/docs/`
- **Error Handling**: Standardized JSON error responses
- **Logging**: Comprehensive request/error logging
