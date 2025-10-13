# backend/api/views.py
from rest_framework import viewsets
from .models import Rol, TipoUsuario, Usuario, Reporte, EstadisticasReporte
from .serializers import (
    RolSerializer, 
    TipoUsuarioSerializer, 
    UsuarioSerializer, 
    ReporteSerializer, 
    EstadisticasReporteSerializer
)

# ViewSet para Roles (permite listar, crear, obtener, actualizar y eliminar roles)
class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

# ViewSet para Tipos de Usuario
class TipoUsuarioViewSet(viewsets.ModelViewSet):
    queryset = TipoUsuario.objects.all()
    serializer_class = TipoUsuarioSerializer

# ViewSet para Usuarios
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

# ViewSet para Reportes
class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer

# ViewSet para Estadísticas de Reporte
class EstadisticasReporteViewSet(viewsets.ModelViewSet):
    queryset = EstadisticasReporte.objects.all()
    serializer_class = EstadisticasReporteSerializer