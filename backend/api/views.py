from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
# Importamos permisos: AllowAny (público), IsAuthenticated (privado)
from rest_framework.permissions import IsAuthenticated, AllowAny 

# Importamos las vistas de JWT para personalizarlas
from rest_framework_simplejwt.views import TokenObtainPairView

# Importamos tus modelos y serializers (Agregamos ReporteVoluntario)
from .models import Rol, TipoUsuario, Usuario, Reporte, ReporteGenerado, EstadisticasReporte
from .serializers import (
    RolSerializer, 
    TipoUsuarioSerializer, 
    UsuarioSerializer, 
    ReporteSerializer, 
    EstadisticasReporteSerializer,
    UsuarioMeSerializer,
    RegistroSerializer,
    MyTokenObtainPairSerializer,
    ReporteVoluntarioCreateSerializer # <--- NUEVO: El que creamos para el guardado doble
)

# ------------------------------------------------------------------
# VISTA DE LOGIN PERSONALIZADA
# ------------------------------------------------------------------
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# ------------------------------------------------------------------
# VISTA DE REGISTRO (Pública)
# ------------------------------------------------------------------
class RegistroView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegistroSerializer

# ------------------------------------------------------------------
# NUEVA VISTA: CREACIÓN DE REPORTE VOLUNTARIO (Privada)
# ------------------------------------------------------------------
class ReporteVoluntarioCreateView(generics.CreateAPIView):
    """
    Vista para crear un reporte voluntario y sus detalles simultáneamente.
    Utiliza el ReporteVoluntarioCreateSerializer para repartir datos en dos tablas.
    """
    queryset = Reporte.objects.all()
    serializer_class = ReporteVoluntarioCreateSerializer
    permission_classes = [IsAuthenticated] # <--- Solo usuarios autenticados

# ------------------------------------------------------------------
# VIEWSETS (Endpoints CRUD)
# ------------------------------------------------------------------

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [IsAuthenticated]

class TipoUsuarioViewSet(viewsets.ModelViewSet):
    queryset = TipoUsuario.objects.all()
    serializer_class = TipoUsuarioSerializer
    permission_classes = [IsAuthenticated]

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated] 
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        user = request.user
        serializer = UsuarioMeSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

# ViewSet para Reportes (Mantiene el CRUD general)
class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(id_usuario=self.request.user)

class EstadisticasReporteViewSet(viewsets.ModelViewSet):
    queryset = EstadisticasReporte.objects.all()
    serializer_class = EstadisticasReporteSerializer
    permission_classes = [IsAuthenticated]