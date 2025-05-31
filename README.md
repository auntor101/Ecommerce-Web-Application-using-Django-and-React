# Ecommerce Web Application (Django + React)

A modern ecommerce platform built with Django (backend) and React (frontend).

## Features
- User authentication (register, login, logout)
- Product listing and details
- Shopping cart and checkout
- Mock payment step (Bkash, Visa)
- Order management
- Responsive, modern UI

## Getting Started (Windows)

### Prerequisites
- Python 3.8+
- Node.js 14+
- MySQL Server

### Backend Setup

1. **Clone the repository:**
   ```sh
   git clone <https://github.com/auntor101/Ecommerce-Web-Application-using-Django-and-React.git>
   cd Ecommerce-Web-Application-using-Django-and-React
   ```

2. **Install Python dependencies:**
   ```sh
   pip install -r backend/requirements.txt
   ```

3. **Install MySQL client for Python:**
   - Recommended: `mysqlclient`
     ```sh
     pip install mysqlclient
     ```
   - Or: `PyMySQL` (add `import pymysql; pymysql.install_as_MySQLdb()` in `settings.py` if needed)

4. **Create a MySQL database and user.**
   - Example:
     ```sql
     CREATE DATABASE your_db_name CHARACTER SET UTF8;
     CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'your_db_password';
     GRANT ALL PRIVILEGES ON your_db_name.* TO 'your_db_user'@'localhost';
     FLUSH PRIVILEGES;
     ```

5. **Configure database settings:**
   - Update `backend/my_project/settings.py` or set these environment variables:
     - `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_HOST`, `MYSQL_PORT`

6. **Apply migrations:**
   ```sh
   cd backend
   python manage.py migrate
   ```

7. **Create a superuser:**
   ```sh
   python manage.py createsuperuser
   ```

8. **Run the backend server (localhost):**
   ```sh
   python manage.py runserver
   ```
   - The API will be available at: [http://localhost:8000/](http://localhost:8000/)

### Frontend Setup

1. **Install Node.js dependencies:**
   ```sh
   cd frontend
   npm install
   ```

2. **Run the frontend (localhost):**
   ```sh
   npm start
   ```
   - The app will be available at: [http://localhost:3000/](http://localhost:3000/)

## Usage

- Backend API: [http://localhost:8000/](http://localhost:8000/)
- Frontend: [http://localhost:3000/](http://localhost:3000/)

## Testing

- Backend: `python manage.py test`
- Frontend: `npm test`

## Additional Notes

- All configuration is for local development on Windows.
- No real payment gateway is integrated; payments are mocked for Bkash and Visa.
- All required dependencies are listed in `backend/requirements.txt` and `frontend/package.json`.

