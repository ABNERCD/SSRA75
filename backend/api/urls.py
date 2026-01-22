from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

# Importamos TODAS las vistas que usamos
from .views import (
    RegistroView,           # Para registrar usuarios (público)
    MyTokenObtainPairView,  # Para login (token personalizado)
    ReporteVoluntarioCreateView, # <--- NUEVA: Para el guardado optimizado
    RolViewSet,             # CRUD Roles
    TipoUsuarioViewSet,     # CRUD Tipos de Usuario
    UsuarioViewSet,         # CRUD Usuarios y perfil /me/
    ReporteViewSet,         # CRUD Reportes
    EstadisticasReporteViewSet # CRUD Estadísticas
)

# 1. Configuración del Router
# El router crea automáticamente las URLs para los ViewSets
router = DefaultRouter()
router.register(r'roles', RolViewSet)
router.register(r'tipos-usuario', TipoUsuarioViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'reportes-lista', ReporteViewSet) # Cambiamos el nombre para no chocar con la ruta de guardado
router.register(r'estadisticas', EstadisticasReporteViewSet)

# 2. Definición de URLs
urlpatterns = [
    # --- Autenticación ---
    path('registro/', RegistroView.as_view(), name='registro'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # --- Reportes Especializados (Guardado de Formulario) ---
    # Esta es la ruta que configuramos en el ReporteService de Angular
    path('reportes/voluntario/', ReporteVoluntarioCreateView.as_view(), name='crear-reporte-voluntario'),

    # --- API Router (Incluye todas las rutas CRUD definidas arriba) ---
    path('', include(router.urls)), 
]