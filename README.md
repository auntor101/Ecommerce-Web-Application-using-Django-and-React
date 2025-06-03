# Auntor Shopping Mall E-commerce Platform

A modern, full-stack e-commerce web application built with Django (backend) and React (frontend). Auntor Shopping Mall offers robust product management, secure authentication, advanced cart and wishlist features, and integrated payment processing (bKash, Visa, MasterCard, and Cash on Delivery).

---

## 🚀 Features

### 🛒 Core
- **Product Management**: CRUD, categories, filtering, search, and pagination
- **Shopping Cart**: Persistent, updatable cart
- **Wishlist**: Save favorite products
- **Product Reviews**: Verified user reviews and ratings
- **Advanced Search**: Filter by category, price, stock, and rating
- **User Authentication**: JWT-secured endpoints

### 💳 Payments
- **Multiple Methods**: bKash, Visa, MasterCard, Cash on Delivery
- **Secure Processing**: Transaction logging and status tracking
- **Payment History**: For users and admins
- **Mock Payment**: For development/testing

### 🛠️ Admin
- **Modern Admin Panel**: With analytics and statistics
- **Order Management**: Track and update order statuses
- **User Management**: Full user/address control
- **Analytics Dashboard**: Payment and order analytics

---

## 🧰 Tech Stack
- **Backend**: Django 4.2.7, Django REST Framework 3.14.0
- **Frontend**: React, Redux, Bootstrap
- **Database**: MySQL 8.0+
- **Auth**: JWT (Simple JWT)
- **File Storage**: Local media
- **Payments**: bKash, card (mocked for dev)
- **Testing**: Comprehensive test suite with coverage

---

## 📦 Prerequisites
- Python 3.9+
- MySQL 8.0+
- Node.js & npm (for frontend)
- pip (Python package manager)
- Virtual environment (recommended)

---

## ⚡ Quick Start

### 1. Clone & Backend Setup
```bash
git clone <your-repo-url>
cd Ecommerce-Web-Application-using-Django-and-React/backend
python -m venv venv
# Activate (Windows)
venv\Scripts\activate
# Activate (macOS/Linux)
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Database Setup
```bash
# Start MySQL and login
mysql -u root -p
CREATE DATABASE auntorshoppingmall_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON auntorshoppingmall_db.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Environment Variables
```bash
cp .env.example .env
# Edit .env with your DB credentials and secrets
```

### 4. Django Setup & Migrate
```bash
python manage.py setup_auntorshoppingmall
python manage.py migrate
```

### 5. Run Backend
```bash
python manage.py runserver
# API: http://localhost:8000/
```

### 6. Frontend Setup (in a new terminal)
```bash
cd ../frontend
npm install
npm start
# App: http://localhost:3000/
```

---

## 📖 API Overview

- **Base URL**: `http://localhost:8000/api/`
- **Auth**: JWT (obtain via `/account/login/`)
- **Docs**: `/api/docs/`

### Key Endpoints
- `/api/products/` — List/filter products
- `/api/product/{id}/` — Product details
- `/api/cart/` — Cart management
- `/api/wishlist/` — Wishlist management
- `/api/product/{id}/reviews/` — Product reviews
- `/payments/methods/` — Payment methods
- `/payments/process/` — Unified payment
- `/payments/bkash/` — bKash payment
- `/payments/card/` — Card payment
- `/payments/history/` — Payment history
- `/payments/status/{transaction_id}/` — Payment status

---

## 💳 Payment Integration

### Mock Payment (Development)
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

---

## 🧪 Testing

### Run Tests
```bash
# Backend tests
python manage.py test
# With coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

---

## 🛠️ Management Commands

- **Setup**: `python manage.py setup_auntorshoppingmall [--admin-username USER --admin-password PASS]`
- **Cleanup**: `python manage.py cleanup_data --days 30 --cleanup-carts --cleanup-logs`
- **Dry Run**: `python manage.py cleanup_data --dry-run`
- **Load Data**: `python manage.py loaddata initial_categories.json`

---

## 🛡️ Security
- JWT authentication
- Role-based permissions
- Input validation
- SQL injection protection (Django ORM)
- CORS configuration
- Rate limiting (configurable)

---

## 🐛 Troubleshooting

**Database Error?**
- Check MySQL is running
- Verify `.env` credentials
- Test DB connection manually

**Migrations?**
- Reset: `python manage.py migrate product zero`
- Re-make: `python manage.py makemigrations product && python manage.py migrate`

**CORS Issues?**
- Update `CORS_ALLOWED_ORIGINS` in `settings.py`

**Permissions?**
- Check file permissions for `.env` and `media/`

---

## 📊 Admin Panel
- URL: `http://localhost:8000/admin/`
- Default username: `admin` (password must be set during setup via `--admin-password`)

---


