from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.contrib.auth.models import User
from django.db import transaction
from payments.models import PaymentMethod
from product.models import Category
import os


class Command(BaseCommand):
    help = 'Set up ShopEasy application with initial data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--skip-admin',
            action='store_true',
            help='Skip creating admin user',
        )
        parser.add_argument(
            '--admin-username',
            type=str,
            default='admin',
            help='Admin username (default: admin)',
        )
        parser.add_argument(
            '--admin-email',
            type=str,
            default='admin@shopeasy.com',
            help='Admin email (default: admin@shopeasy.com)',
        )
        parser.add_argument(
            '--admin-password',
            type=str,
            default='admin123',
            help='Admin password (default: admin123)',
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('Setting up ShopEasy application...')
        )

        try:
            with transaction.atomic():
                # Run migrations
                self.stdout.write('Running database migrations...')
                call_command('migrate', verbosity=0)
                
                # Load fixtures
                self.stdout.write('Loading initial data...')
                self._load_fixtures()
                
                # Create admin user
                if not options['skip_admin']:
                    self._create_admin_user(
                        options['admin_username'],
                        options['admin_email'],
                        options['admin_password']
                    )
                
                # Create media directories
                self._create_media_directories()
                
                # Collect static files if not in debug mode
                try:
                    call_command('collectstatic', verbosity=0, interactive=False)
                    self.stdout.write(
                        self.style.SUCCESS('Static files collected successfully')
                    )
                except Exception as e:
                    self.stdout.write(
                        self.style.WARNING(f'Static files collection skipped: {e}')
                    )

                self.stdout.write(
                    self.style.SUCCESS(
                        '\n✅ ShopEasy setup completed successfully!'
                    )
                )
                self._print_summary(options)

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Setup failed: {e}')
            )
            raise

    def _load_fixtures(self):
        """Load initial fixtures for categories and payment methods"""
        try:
            # Load categories
            call_command('loaddata', 'initial_categories.json', verbosity=0)
            self.stdout.write('  ✓ Categories loaded')
        except Exception as e:
            self.stdout.write(f'  ⚠ Categories fixture failed: {e}')
            self._create_default_categories()

        try:
            # Load payment methods
            call_command('loaddata', 'initial_payment_methods.json', verbosity=0)
            self.stdout.write('  ✓ Payment methods loaded')
        except Exception as e:
            self.stdout.write(f'  ⚠ Payment methods fixture failed: {e}')
            self._create_default_payment_methods()

    def _create_default_categories(self):
        """Create default categories if fixture loading fails"""
        categories = [
            ('Electronics', 'Electronic devices, gadgets, and accessories'),
            ('Clothing', 'Fashion clothing, shoes, and accessories'),
            ('Home & Garden', 'Home improvement, furniture, and garden supplies'),
            ('Books', 'Books, magazines, and educational materials'),
            ('Sports & Fitness', 'Sports equipment and fitness gear'),
            ('Health & Beauty', 'Health products and personal care'),
        ]
        
        for name, description in categories:
            Category.objects.get_or_create(
                name=name,
                defaults={'description': description}
            )
        self.stdout.write('  ✓ Default categories created')

    def _create_default_payment_methods(self):
        """Create default payment methods if fixture loading fails"""
        payment_methods = [
            ('bkash', 'bKash', 'mobile-alt', 'Pay with your bKash mobile wallet'),
            ('visa', 'Visa', 'credit-card', 'Pay securely with your Visa card'),
            ('mastercard', 'MasterCard', 'credit-card', 'Pay securely with your MasterCard'),
            ('cash', 'Cash on Delivery', 'money-bill', 'Pay with cash on delivery'),
        ]
        
        for name, display_name, icon, description in payment_methods:
            PaymentMethod.objects.get_or_create(
                name=name,
                defaults={
                    'display_name': display_name,
                    'icon': icon,
                    'description': description,
                    'is_active': True
                }
            )
        self.stdout.write('  ✓ Default payment methods created')

    def _create_admin_user(self, username, email, password):
        """Create admin user if it doesn't exist"""
        if User.objects.filter(username=username).exists():
            self.stdout.write(f'  ⚠ Admin user "{username}" already exists')
            return

        admin_user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        self.stdout.write(f'  ✓ Admin user "{username}" created')

    def _create_media_directories(self):
        """Create necessary media directories"""
        from django.conf import settings
        
        media_dirs = [
            'products',
            'users',
            'documents',
            'temp'
        ]
        
        for dir_name in media_dirs:
            dir_path = settings.MEDIA_ROOT / dir_name
            dir_path.mkdir(parents=True, exist_ok=True)
        
        self.stdout.write('  ✓ Media directories created')

    def _print_summary(self, options):
        """Print setup summary"""
        self.stdout.write('\n' + '='*50)
        self.stdout.write('SETUP SUMMARY')
        self.stdout.write('='*50)
        self.stdout.write(f"Categories: {Category.objects.count()}")
        self.stdout.write(f"Payment Methods: {PaymentMethod.objects.count()}")
        self.stdout.write(f"Admin Users: {User.objects.filter(is_superuser=True).count()}")
        
        if not options['skip_admin']:
            self.stdout.write('\n📋 Admin Access:')
            self.stdout.write(f"  Username: {options['admin_username']}")
            self.stdout.write(f"  Email: {options['admin_email']}")
            self.stdout.write(f"  Password: {options['admin_password']}")
            self.stdout.write(f"  Admin URL: http://localhost:8000/admin/")
        
        self.stdout.write('\n🚀 Your ShopEasy application is ready!')
        self.stdout.write('   Start the server with: python manage.py runserver')
        self.stdout.write('   API Documentation: http://localhost:8000/api/docs/')
        self.stdout.write('='*50)