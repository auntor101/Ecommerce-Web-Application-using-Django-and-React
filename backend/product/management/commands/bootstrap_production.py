import os

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from payments.models import PaymentMethod


class Command(BaseCommand):
    help = 'Seed required payment methods and create superuser for a fresh deployment.'

    def handle(self, *args, **options):
        self._create_superuser()
        payment_methods = [
            ('bkash', 'bKash', 'mobile-alt'),
            ('visa', 'Visa', 'credit-card'),
            ('mastercard', 'MasterCard', 'credit-card'),
            ('cash', 'Cash on Delivery', 'money-bill'),
        ]

        for name, display_name, icon in payment_methods:
            PaymentMethod.objects.get_or_create(
                name=name,
                defaults={
                    'display_name': display_name,
                    'icon': icon,
                    'is_active': True,
                },
            )

        self.stdout.write(self.style.SUCCESS('Bootstrap complete.'))

    def _create_superuser(self):
        username = os.getenv('DJANGO_SUPERUSER_USERNAME')
        email = os.getenv('DJANGO_SUPERUSER_EMAIL', '')
        password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

        if not username or not password:
            return

        if User.objects.filter(username=username).exists():
            return

        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f'Superuser "{username}" created.'))