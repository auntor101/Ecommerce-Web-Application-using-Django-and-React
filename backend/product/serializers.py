from rest_framework import serializers
from .models import Product, Category, Cart, Wishlist, Review
from django.contrib.auth.models import User


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'product_count', 'created_at']
    
    def get_product_count(self, obj):
        return obj.products.filter(stock=True).count()


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'rating', 'comment', 'is_verified', 'created_at', 
            'updated_at', 'user_name', 'user_id'
        ]
        read_only_fields = ['is_verified', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    reviews = ReviewSerializer(many=True, read_only=True)
    is_in_wishlist = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock', 'image', 
            'category', 'category_name', 'created_at', 'updated_at', 
            'is_featured', 'average_rating', 'review_count', 'reviews',
            'is_in_wishlist'
        ]
    
    def get_is_in_wishlist(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Wishlist.objects.filter(user=request.user, product=obj).exists()
        return False


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock', 'image', 
            'category', 'is_featured'
        ]


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = [
            'id', 'product', 'product_id', 'quantity', 'total_price',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        product_id = validated_data.pop('product_id')
        validated_data['product_id'] = product_id
        
        # Check if item already exists in cart
        cart_item, created = Cart.objects.get_or_create(
            user=validated_data['user'],
            product_id=product_id,
            defaults={'quantity': validated_data.get('quantity', 1)}
        )
        
        if not created:
            # If item exists, update quantity
            cart_item.quantity += validated_data.get('quantity', 1)
            cart_item.save()
        
        return cart_item
    
    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value)
            if not product.stock:
                raise serializers.ValidationError("Product is out of stock")
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product does not exist")


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id', 'created_at']
        read_only_fields = ['created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        product_id = validated_data.pop('product_id')
        validated_data['product_id'] = product_id
        
        # Create or get existing wishlist item
        wishlist_item, created = Wishlist.objects.get_or_create(
            user=validated_data['user'],
            product_id=product_id
        )
        
        return wishlist_item
    
    def validate_product_id(self, value):
        try:
            Product.objects.get(id=value)
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product does not exist")


class CartSummarySerializer(serializers.Serializer):
    total_items = serializers.IntegerField()
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    items = CartItemSerializer(many=True)