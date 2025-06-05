from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import logging

logger = logging.getLogger(__name__)

def bad_request(request, exception=None):
    """Handle 400 Bad Request errors"""
    logger.warning(f"Bad request: {request.path} - {exception}")
    
    return JsonResponse({
        'error': 'Bad Request',
        'message': 'The request could not be understood by the server.',
        'status_code': 400,
        'path': request.path
    }, status=400)

def permission_denied(request, exception=None):
    """Handle 403 Permission Denied errors"""
    logger.warning(f"Permission denied: {request.path} - User: {request.user} - {exception}")
    
    return JsonResponse({
        'error': 'Permission Denied',
        'message': 'You do not have permission to access this resource.',
        'status_code': 403,
        'path': request.path
    }, status=403)

def page_not_found(request, exception=None):
    """Handle 404 Not Found errors"""
    logger.info(f"Page not found: {request.path}")
    
    return JsonResponse({
        'error': 'Not Found',
        'message': 'The requested resource was not found.',
        'status_code': 404,
        'path': request.path,
        'suggestion': 'Check the API documentation at /api/docs/ for available endpoints.'
    }, status=404)

def server_error(request):
    """Handle 500 Internal Server Error"""
    logger.error(f"Server error: {request.path}")
    
    return JsonResponse({
        'error': 'Internal Server Error',
        'message': 'An unexpected error occurred. Please try again later.',
        'status_code': 500,
        'path': request.path
    }, status=500) 