import os
import sys
from pathlib import Path

# Ensure Django apps can be imported when Vercel runs from backend/api.
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.append(str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_project.settings')

from django.core.wsgi import get_wsgi_application

app = get_wsgi_application()
