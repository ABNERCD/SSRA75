# backend/api/urls.py

from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ( # <--- ASEGÚRATE DE QUE ESTAS CLASES EXISTEN
    RolViewSet, 
    TipoUsuarioViewSet, 
    UsuarioViewSet, 
    ReporteViewSet, 
    EstadisticasReporteViewSet
)

router = DefaultRouter()
router.register(r'roles', RolViewSet)
router.register(r'tipos-usuario', TipoUsuarioViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'reportes', ReporteViewSet)
router.register(r'estadisticas', EstadisticasReporteViewSet)

urlpatterns = [
    # ESTA LÍNEA DEBE SER EXACTA
    path('', include(router.urls)), 
]