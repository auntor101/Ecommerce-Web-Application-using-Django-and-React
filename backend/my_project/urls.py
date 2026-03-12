from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
import json
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


def api_health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'version': '2.0.0',
    })


urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API health and documentation
    path('api/health/', api_health_check, name='api-health'),
    
    # API schema and docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

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