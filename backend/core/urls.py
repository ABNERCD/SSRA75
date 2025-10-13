# backend/core/urls.py

from django.contrib import admin
from django.urls import path, include 

urlpatterns = [
    # 1. Ruta de Administración de Django
    path('admin/', admin.site.urls),
    
    # 2. RUTA PRINCIPAL DE TU API: Incluye las rutas definidas en api/urls.py
    path('api/v1/', include('api.urls')), 
]2