from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# API Health Check View
def api_health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'message': 'Auntor Shopping Mall API is running',
        'version': '2.0.0',
        'debug': settings.DEBUG
    })

# API Documentation View
def api_docs(request):
    docs = {
        'title': 'Auntor Shopping Mall API Documentation',
        'version': '2.0.0',
        'base_url': f"{request.scheme}://{request.get_host()}/api/",
        'endpoints': {
            'products': {
                'list': 'GET /api/products/',
                'detail': 'GET /api/product/{id}/',
                'create': 'POST /api/product-create/',
                'update': 'PUT /api/product-update/{id}/',
                'delete': 'DELETE /api/product-delete/{id}/',
                'reviews': 'GET|POST /api/product/{id}/reviews/',
            },
            'categories': {
                'list': 'GET /api/categories/',
                'create': 'POST /api/category-create/',
            },
            'cart': {
                'list': 'GET /api/cart/',
                'add': 'POST /api/cart/',
                'update': 'PUT /api/cart/item/{id}/',
                'remove': 'DELETE /api/cart/item/{id}/',
                'clear': 'DELETE /api/cart/clear/',
            },
            'wishlist': {
                'list': 'GET /api/wishlist/',
                'add': 'POST /api/wishlist/',
                'remove': 'DELETE /api/wishlist/item/{id}/',
            },
            'payments': {
                'methods': 'GET /payments/methods/',
                'process': 'POST /payments/process/',
                'bkash': 'POST /payments/bkash/',
                'card': 'POST /payments/card/',
                'history': 'GET /payments/history/',
                'status': 'GET /payments/status/{transaction_id}/',
            },
            'account': {
                'register': 'POST /account/register/',
                'login': 'POST /account/login/',
                'profile': 'GET /account/profile/',
                'addresses': 'GET|POST /account/addresses/',
                'orders': 'GET /account/orders/',
            }
        },
        'authentication': {
            'type': 'JWT Bearer Token',
            'header': 'Authorization: Bearer <token>',
            'login_endpoint': '/account/login/',
            'token_refresh': '/account/token/refresh/',
        }
    }
    return JsonResponse(docs, json_dumps_params={'indent': 2})

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API health and documentation
    path('api/health/', api_health_check, name='api-health'),
    path('api/docs/', api_docs, name='api-docs'),
    
    # API endpoints
    path('api/', include('product.urls')),
    path('payments/', include('payments.urls')),
    path('account/', include('account.urls')),
]

# Serve static and media files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # Debug toolbar (development only)
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns

# Custom error handlers
handler400 = 'my_project.views.bad_request'
handler403 = 'my_project.views.permission_denied'
handler404 = 'my_project.views.page_not_found'
handler500 = 'my_project.views.server_error'

# Admin site customization
admin.site.site_header = 'Auntor Shopping Mall Administration'
admin.site.site_title = 'Auntor Shopping Mall Admin'
admin.site.index_title = 'Welcome to Auntor Shopping Mall Administration'