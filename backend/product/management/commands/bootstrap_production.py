from django.core.management.base import BaseCommand

from payments.models import PaymentMethod


class Command(BaseCommand):
    help = 'Seed required payment methods for a fresh deployment.'

    def handle(self, *args, **options):
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