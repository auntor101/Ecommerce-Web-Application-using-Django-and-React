from django.shortcuts import get_object_or_404
from django.db.models import Q, Avg, Count
from rest_framework import status, permissions, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters

from .models import Product, Category, Cart, Wishlist, Review
from .serializers import (
    ProductSerializer, ProductCreateUpdateSerializer, CategorySerializer,
    CartItemSerializer, WishlistItemSerializer, ReviewSerializer,
    CartSummarySerializer
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    category = django_filters.ModelChoiceFilter(queryset=Category.objects.all())
    stock = django_filters.BooleanFilter()
    is_featured = django_filters.BooleanFilter()
    
    class Meta:
        model = Product
        fields = ['name', 'description', 'price_min', 'price_max', 'category', 'stock', 'is_featured']


class ProductView(APIView):
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['name', 'price', 'created_at', 'average_rating']
    ordering = ['-created_at']

    def get(self, request):
        products = Product.objects.all().select_related('category').prefetch_related('reviews')
        
        # Apply filters
        search = request.GET.get('search', '')
        if search:
            products = products.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search) |
                Q(category__name__icontains=search)
            )
        
        # Price range filter
        price_min = request.GET.get('price_min')
        price_max = request.GET.get('price_max')
        if price_min:
            products = products.filter(price__gte=price_min)
        if price_max:
            products = products.filter(price__lte=price_max)
        
        # Category filter
        category = request.GET.get('category')
        if category:
            products = products.filter(category_id=category)
        
        # Stock filter
        stock_filter = request.GET.get('stock')
        if stock_filter is not None:
            products = products.filter(stock=stock_filter.lower() == 'true')
        
        # Featured filter
        featured = request.GET.get('featured')
        if featured:
            products = products.filter(is_featured=featured.lower() == 'true')
        
        # Ordering
        ordering = request.GET.get('ordering', '-created_at')
        if ordering == 'price_low':
            products = products.order_by('price')
        elif ordering == 'price_high':
            products = products.order_by('-price')
        elif ordering == 'rating':
            products = products.annotate(avg_rating=Avg('reviews__rating')).order_by('-avg_rating')
        elif ordering == 'name':
            products = products.order_by('name')
        else:
            products = products.order_by('-created_at')
        
        # Pagination
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(products, request)
        
        if page is not None:
            serializer = ProductSerializer(page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)
        
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductDetailView(APIView):
    def get(self, request, pk):
        product = get_object_or_404(Product, id=pk)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductCreateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        serializer = ProductCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ProductDeleteView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
            product.delete()
            return Response({"detail": "Product successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class ProductEditView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProductCreateUpdateSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# Category Views
class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CategoryCreateView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Cart Views
class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart_items = Cart.objects.filter(user=request.user).select_related('product')
        total_items = cart_items.count()
        total_price = sum(item.total_price for item in cart_items)
        
        serializer = CartItemSerializer(cart_items, many=True)
        
        response_data = {
            'total_items': total_items,
            'total_price': total_price,
            'items': serializer.data
        }
        
        return Response(response_data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CartItemSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request, pk):
        try:
            cart_item = Cart.objects.get(id=pk, user=request.user)
        except Cart.DoesNotExist:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CartItemSerializer(cart_item, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            cart_item = Cart.objects.get(id=pk, user=request.user)
            cart_item.delete()
            return Response({"detail": "Item removed from cart."}, status=status.HTTP_204_NO_CONTENT)
        except Cart.DoesNotExist:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)


class CartClearView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request):
        Cart.objects.filter(user=request.user).delete()
        return Response({"detail": "Cart cleared."}, status=status.HTTP_204_NO_CONTENT)


# Wishlist Views
class WishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist_items = Wishlist.objects.filter(user=request.user).select_related('product')
        serializer = WishlistItemSerializer(wishlist_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = WishlistItemSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WishlistItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, pk):
        try:
            wishlist_item = Wishlist.objects.get(product_id=pk, user=request.user)
            wishlist_item.delete()
            return Response({"detail": "Item removed from wishlist."}, status=status.HTTP_204_NO_CONTENT)
        except Wishlist.DoesNotExist:
            return Response({"detail": "Wishlist item not found."}, status=status.HTTP_404_NOT_FOUND)


# Review Views
class ProductReviewsView(APIView):
    def get(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        
        reviews = Review.objects.filter(product=product).select_related('user')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, product_id):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user already reviewed this product
        if Review.objects.filter(product=product, user=request.user).exists():
            return Response({"detail": "You have already reviewed this product."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ReviewSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request, pk):
        try:
            review = Review.objects.get(id=pk, user=request.user)
        except Review.DoesNotExist:
            return Response({"detail": "Review not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ReviewSerializer(review, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            review = Review.objects.get(id=pk, user=request.user)
            review.delete()
            return Response({"detail": "Review deleted."}, status=status.HTTP_204_NO_CONTENT)
        except Review.DoesNotExist:
            return Response({"detail": "Review not found."}, status=status.HTTP_404_NOT_FOUND)