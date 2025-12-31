# backend/core/urls.py
from django.contrib import admin
from django.urls import path, include 
from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # Vista para obtener el token (login)
    TokenRefreshView,     # Vista para refrescar el token
)

urlpatterns = [
    # 1. Ruta de Administración de Django
    path('admin/', admin.site.urls),
    
    # 2. Rutas de Autenticación JWT (Login)
    # El Login de Angular debe apuntar a esta URL: 'api/auth/token/'
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # 3. RUTA PRINCIPAL DE TU API: Incluye las rutas definidas en api/urls.py
    # Estas rutas contendrán tus ViewSets (roles, usuarios, reportes, etc.)
    path('api/v1/', include('api.urls')), 
]