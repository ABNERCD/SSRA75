from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
# Importamos permisos: AllowAny (público), IsAuthenticated (privado)
from rest_framework.permissions import IsAuthenticated, AllowAny 

# Importamos las vistas de JWT para personalizarlas
from rest_framework_simplejwt.views import TokenObtainPairView

# Importamos tus modelos y serializers
from .models import Rol, TipoUsuario, Usuario, Reporte, EstadisticasReporte
from .serializers import (
    RolSerializer, 
    TipoUsuarioSerializer, 
    UsuarioSerializer, 
    ReporteSerializer, 
    EstadisticasReporteSerializer,
    UsuarioMeSerializer,
    RegistroSerializer, # <--- CORREGIDO: Coincide con serializers.py
    MyTokenObtainPairSerializer # <--- CORREGIDO: Importamos el serializer de token
)

# ------------------------------------------------------------------
# VISTA DE LOGIN PERSONALIZADA
# ------------------------------------------------------------------
class MyTokenObtainPairView(TokenObtainPairView):
    """
    Vista de login que devuelve el token de acceso y refresco, 
    además de datos extra del usuario (nombre, correo) definidos en el serializer.
    """
    serializer_class = MyTokenObtainPairSerializer

# ------------------------------------------------------------------
# VISTA DE REGISTRO (Pública)
# ------------------------------------------------------------------
class RegistroView(generics.CreateAPIView):
    """
    Vista dedicada exclusivamente al registro de nuevos usuarios.
    Permite acceso público (AllowAny) para que cualquiera pueda registrarse.
    """
    queryset = Usuario.objects.all()
    permission_classes = [AllowAny] # <--- ¡Crucial! Permite registrarse sin estar logueado
    serializer_class = RegistroSerializer # <--- CORREGIDO: Usa el serializer correcto

# ------------------------------------------------------------------
# VIEWSETS (Endpoints CRUD)
# ------------------------------------------------------------------

# ViewSet para Roles
class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [IsAuthenticated]

# ViewSet para Tipos de Usuario
class TipoUsuarioViewSet(viewsets.ModelViewSet):
    queryset = TipoUsuario.objects.all()
    serializer_class = TipoUsuarioSerializer
    permission_classes = [IsAuthenticated]

# ViewSet para Usuarios (Gestión y Perfil)
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    # Protegemos todo el ViewSet. Solo usuarios logueados pueden ver la lista de usuarios.
    permission_classes = [IsAuthenticated] 
    
    # Acción personalizada: /api/v1/usuarios/me/
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Retorna la información del usuario actualmente autenticado.
        Endpoint: GET /api/v1/usuarios/me/
        """
        user = request.user
        # Usamos el serializer optimizado para el Dashboard
        serializer = UsuarioMeSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

# ViewSet para Reportes
class ReporteViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para reportes.
    Al crear un reporte, se asigna automáticamente el usuario autenticado.
    """
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    permission_classes = [IsAuthenticated]

    # Sobrescribir perform_create para asignar el usuario automáticamente
    def perform_create(self, serializer):
        serializer.save(id_usuario=self.request.user)

# ViewSet para Estadísticas de Reporte
class EstadisticasReporteViewSet(viewsets.ModelViewSet):
    queryset = EstadisticasReporte.objects.all()
    serializer_class = EstadisticasReporteSerializer
    permission_classes = [IsAuthenticated]