from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from product.models import Cart, Wishlist, Review
from payments.models import Payment, PaymentLog
from account.models import OrderModel


class Command(BaseCommand):
    help = 'Clean up old data and optimize database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=30,
            help='Number of days to keep data (default: 30)',
        )
        parser.add_argument(
            '--cleanup-carts',
            action='store_true',
            help='Clean up old cart items',
        )
        parser.add_argument(
            '--cleanup-logs',
            action='store_true',
            help='Clean up old payment logs',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting',
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('Starting data cleanup...')
        )

        cutoff_date = timezone.now() - timedelta(days=options['days'])
        dry_run = options['dry_run']

        if dry_run:
            self.stdout.write(
                self.style.WARNING('DRY RUN MODE - No data will be deleted')
            )

        try:
            with transaction.atomic():
                if options['cleanup_carts']:
                    self._cleanup_old_carts(cutoff_date, dry_run)
                
                if options['cleanup_logs']:
                    self._cleanup_old_logs(cutoff_date, dry_run)
                
                # General cleanup
                self._cleanup_orphaned_data(dry_run)
                
                if not dry_run:
                    self.stdout.write(
                        self.style.SUCCESS('✅ Data cleanup completed successfully!')
                    )
                else:
                    self.stdout.write(
                        self.style.SUCCESS('✅ Dry run completed!')
                    )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Cleanup failed: {e}')
            )
            raise

    def _cleanup_old_carts(self, cutoff_date, dry_run):
        """Clean up old cart items"""
        old_carts = Cart.objects.filter(updated_at__lt=cutoff_date)
        count = old_carts.count()
        
        if count > 0:
            if not dry_run:
                deleted_count = old_carts.delete()[0]
                self.stdout.write(f'  ✓ Deleted {deleted_count} old cart items')
            else:
                self.stdout.write(f'  🔍 Would delete {count} old cart items')
        else:
            self.stdout.write('  ✓ No old cart items to clean')

    def _cleanup_old_logs(self, cutoff_date, dry_run):
        """Clean up old payment logs"""
        old_logs = PaymentLog.objects.filter(created_at__lt=cutoff_date)
        count = old_logs.count()
        
        if count > 0:
            if not dry_run:
                deleted_count = old_logs.delete()[0]
                self.stdout.write(f'  ✓ Deleted {deleted_count} old payment logs')
            else:
                self.stdout.write(f'  🔍 Would delete {count} old payment logs')
        else:
            self.stdout.write('  ✓ No old payment logs to clean')

    def _cleanup_orphaned_data(self, dry_run):
        """Clean up orphaned data"""
        
        # Clean up wishlist items for deleted products
        orphaned_wishlists = Wishlist.objects.filter(product__isnull=True)
        count = orphaned_wishlists.count()
        
        if count > 0:
            if not dry_run:
                deleted_count = orphaned_wishlists.delete()[0]
                self.stdout.write(f'  ✓ Deleted {deleted_count} orphaned wishlist items')
            else:
                self.stdout.write(f'  🔍 Would delete {count} orphaned wishlist items')
        
        # Clean up reviews for deleted products
        orphaned_reviews = Review.objects.filter(product__isnull=True)
        count = orphaned_reviews.count()
        
        if count > 0:
            if not dry_run:
                deleted_count = orphaned_reviews.delete()[0]
                self.stdout.write(f'  ✓ Deleted {deleted_count} orphaned reviews')
            else:
                self.stdout.write(f'  🔍 Would delete {count} orphaned reviews')

        # Report summary
        self.stdout.write('\n📊 Database Statistics:')
        self.stdout.write(f'  Active Cart Items: {Cart.objects.count()}')
        self.stdout.write(f'  Wishlist Items: {Wishlist.objects.count()}')
        self.stdout.write(f'  Product Reviews: {Review.objects.count()}')
        self.stdout.write(f'  Payment Records: {Payment.objects.count()}')
        self.stdout.write(f'  Payment Logs: {PaymentLog.objects.count()}')