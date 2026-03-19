from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models import Avg


def validate_image_size(image):
    if image.size > 5 * 1024 * 1024:
        raise ValidationError("Maximum file size is 5MB")


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class SiteSettings(models.Model):
    site_name = models.CharField(max_length=120, default='Auntor Shopping Mall')
    hero_eyebrow = models.CharField(max_length=120, default='Fresh & Local')
    hero_title = models.CharField(max_length=255, default='Quality Groceries & Essentials Delivered to Your Door')
    hero_subtitle = models.TextField(default='Shop fresh produce, pantry staples, electronics, and household essentials across Bangladesh.')
    support_email = models.EmailField(default='help@auntor.com.bd')
    support_phone = models.CharField(max_length=40, default='+880 1XXX-XXXXXX')
    footer_address = models.CharField(max_length=255, default='Dhaka, Bangladesh')
    hero_background_image = models.ImageField(
        null=True,
        blank=True,
        upload_to='site/',
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp']),
            validate_image_size,
        ],
    )
    promo_background_image = models.ImageField(
        null=True,
        blank=True,
        upload_to='site/',
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp']),
            validate_image_size,
        ],
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return self.site_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        settings_obj, _ = cls.objects.get_or_create(pk=1)
        return settings_obj


class Product(models.Model):
    name = models.CharField(max_length=200, blank=False, null=False)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    stock = models.BooleanField(default=False)
    image = models.ImageField(
        null=True, 
        blank=True, 
        upload_to='products/',
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp']),
            validate_image_size
        ]
    )
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_featured = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def average_rating(self):
        result = self.reviews.aggregate(avg_rating=Avg('rating'))
        if result['avg_rating']:
            return round(result['avg_rating'], 1)
        return 0
    
    @property
    def review_count(self):
        return self.reviews.count()


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.quantity})"
    
    @property
    def total_price(self):
        return self.product.price * self.quantity


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlist_items')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.product.name}"


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5 stars"
    )
    comment = models.TextField()
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('product', 'user')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.rating}★)"
    
    def save(self, *args, **kwargs):
        # Auto-verify if user has purchased this product
        if not self.is_verified:
            from account.models import OrderModel
            user_orders = OrderModel.objects.filter(
                user=self.user, 
                ordered_item__icontains=self.product.name,
                paid_status=True
            )
            if user_orders.exists():
                self.is_verified = True
        super().save(*args, **kwargs)