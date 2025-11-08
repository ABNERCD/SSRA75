# backend/api/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated # <-- Importación clave para seguridad
from .models import Rol, TipoUsuario, Usuario, Reporte, EstadisticasReporte
from .serializers import (
    RolSerializer, 
    TipoUsuarioSerializer, 
    UsuarioSerializer, 
    ReporteSerializer, 
    EstadisticasReporteSerializer,
    UsuarioMeSerializer # <-- Asegúrate de importar el serializer específico
)

# ViewSet para Roles (permite listar, crear, obtener, actualizar y eliminar roles)
class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    # Opcional: define permisos, ej: IsAdminUser o IsAuthenticated

# ViewSet para Tipos de Usuario
class TipoUsuarioViewSet(viewsets.ModelViewSet):
    queryset = TipoUsuario.objects.all()
    serializer_class = TipoUsuarioSerializer

# ViewSet para Usuarios (Ajustado para seguridad y acción /me/)
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    # 1. Aplicamos permisos de autenticación a todo el ViewSet (necesario para /me/)
    # Esto significa que, a menos que se anule, todas las rutas de /usuarios/ requieren login.
    permission_classes = [IsAuthenticated] 
    
    # 2. Definición del Endpoint Personalizado: /api/v1/usuarios/me/
    # detail=False: Indica que esta acción aplica a la colección (/usuarios/), no a un elemento específico (/usuarios/1/).
    # methods=['get']: Solo permite solicitudes GET.
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Retorna la información del usuario actualmente autenticado (usando el token JWT).
        Endpoint: GET /api/v1/usuarios/me/
        """
        # request.user contiene el objeto Usuario si el token JWT es válido
        user = request.user
        
        # Usamos el Serializer diseñado para el Dashboard
        serializer = UsuarioMeSerializer(user)
        
        # Devolver los datos del usuario logueado
        return Response(serializer.data, status=status.HTTP_200_OK)

# ViewSet para Reportes
class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    permission_classes = [IsAuthenticated] # Ejemplo: protegiendo la ruta

# ViewSet para Estadísticas de Reporte
class EstadisticasReporteViewSet(viewsets.ModelViewSet):
    queryset = EstadisticasReporte.objects.all()
    serializer_class = EstadisticasReporteSerializer
    permission_classes = [IsAuthenticated] # Ejemplo: protegiendo la ruta