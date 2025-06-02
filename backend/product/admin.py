from django.contrib import admin
from .models import Product, Category, Cart, Wishlist, Review


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'product_count', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']
    ordering = ['name']
    
    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'is_featured', 'average_rating', 'review_count', 'created_at']
    list_filter = ['stock', 'is_featured', 'category', 'created_at']
    search_fields = ['name', 'description', 'category__name']
    list_editable = ['stock', 'is_featured', 'price']
    readonly_fields = ['average_rating', 'review_count', 'created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'price', 'stock')
        }),
        ('Categorization', {
            'fields': ('category', 'is_featured')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Statistics', {
            'fields': ('average_rating', 'review_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    ordering = ['-created_at']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'quantity', 'total_price', 'created_at']
    list_filter = ['created_at', 'product__category']
    search_fields = ['user__username', 'product__name']
    readonly_fields = ['total_price', 'created_at', 'updated_at']
    ordering = ['-created_at']


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'created_at']
    list_filter = ['created_at', 'product__category']
    search_fields = ['user__username', 'product__name']
    readonly_fields = ['created_at']
    ordering = ['-created_at']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'rating', 'is_verified', 'created_at']
    list_filter = ['rating', 'is_verified', 'created_at', 'product__category']
    search_fields = ['user__username', 'product__name', 'comment']
    list_editable = ['is_verified']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Review Information', {
            'fields': ('user', 'product', 'rating', 'comment')
        }),
        ('Status', {
            'fields': ('is_verified',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    ordering = ['-created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'product')