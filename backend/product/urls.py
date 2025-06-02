from django.urls import path
from product import views

urlpatterns = [
    # Product URLs
    path('products/', views.ProductView.as_view(), name="products-list"),
    path('product/<str:pk>/', views.ProductDetailView.as_view(), name="product-details"),
    path('product-create/', views.ProductCreateView.as_view(), name="product-create"),
    path('product-update/<str:pk>/', views.ProductEditView.as_view(), name="product-update"),
    path('product-delete/<str:pk>/', views.ProductDeleteView.as_view(), name="product-delete"),
    
    # Category URLs
    path('categories/', views.CategoryListView.as_view(), name="categories-list"),
    path('category-create/', views.CategoryCreateView.as_view(), name="category-create"),
    
    # Cart URLs
    path('cart/', views.CartView.as_view(), name="cart"),
    path('cart/item/<int:pk>/', views.CartItemView.as_view(), name="cart-item"),
    path('cart/clear/', views.CartClearView.as_view(), name="cart-clear"),
    
    # Wishlist URLs
    path('wishlist/', views.WishlistView.as_view(), name="wishlist"),
    path('wishlist/item/<int:pk>/', views.WishlistItemView.as_view(), name="wishlist-item"),
    
    # Review URLs
    path('product/<int:product_id>/reviews/', views.ProductReviewsView.as_view(), name="product-reviews"),
    path('review/<int:pk>/', views.ReviewDetailView.as_view(), name="review-detail"),
]