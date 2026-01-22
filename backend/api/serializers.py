from rest_framework import serializers
# Necesario para el Login personalizado
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 
from .models import Rol, TipoUsuario, Usuario, Reporte, ReporteVoluntario, EstadisticasReporte
import json

# -------------------------------------------------------------
# --- Serializer de LOGIN (Token Personalizado) ---
# -------------------------------------------------------------
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['nombre'] = user.nombre
        token['correo'] = user.correo
        token['id_usuario'] = user.id_usuario
        if user.id_tipo:
             token['id_tipo'] = user.id_tipo.id_tipo
             token['tipo_nombre'] = user.id_tipo.nombre
        return token

# -------------------------------------------------------------
# --- Serializers Base (Anidados) ---
# -------------------------------------------------------------
class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ['id_rol', 'nombre']

class TipoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoUsuario
        fields = ['id_tipo', 'nombre']

# -------------------------------------------------------------
# --- Serializer de REGISTRO (Crear Cuenta) ---
# -------------------------------------------------------------
class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    id_tipo = serializers.PrimaryKeyRelatedField(queryset=TipoUsuario.objects.all(), required=True)

    class Meta:
        model = Usuario
        fields = ['nombre', 'correo', 'password', 'id_tipo']

    def create(self, validated_data):
        user = Usuario.objects.create_user(
            correo=validated_data['correo'],
            nombre=validated_data['nombre'],
            password=validated_data['password'],
            id_tipo=validated_data['id_tipo']
        )
        return user

# -------------------------------------------------------------
# --- Serializers de REPORTES (Estructura SSRA75) ---
# -------------------------------------------------------------

# 1. Serializador para la tabla de estadísticas
class EstadisticasReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadisticasReporte
        fields = '__all__'

# 2. Serializador para la LISTA general
class ReporteSerializer(serializers.ModelSerializer):
    nombre_usuario = serializers.ReadOnlyField(source='id_usuario.nombre')
    class Meta:
        model = Reporte
        fields = ('id_reporte', 'id_usuario', 'nombre_usuario', 'numero_reporte_manual', 'tipo_reporte', 'fecha_elaboracion', 'estatus')

# 3. Serializer para la tabla de detalles (Estadística + JSON)
class ReporteVoluntarioDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReporteVoluntario
        fields = [
            'nombre_reportante', 
            'correo_reportante', 
            'lugar',           
            'hora_local',      
            'fecha_evento',    
            'probabilidad',    
            'severidad',       
            'detalles_completos_json'
        ]

# 4. Serializer Maestro (Triple Inserción)
class ReporteVoluntarioCreateSerializer(serializers.ModelSerializer):
    # Usamos source='reportevoluntario' para que Django sepa leer los 
    # datos del modelo hijo en la respuesta JSON.
    detalles = ReporteVoluntarioDetalleSerializer(source='reportevoluntario')

    class Meta:
        model = Reporte
        fields = ['id_reporte', 'numero_reporte_manual', 'fecha_elaboracion', 'tipo_reporte', 'subtipo', 'detalles']
        read_only_fields = ['id_reporte']

    def create(self, validated_data):
        # Al usar 'source', la llave interna en validated_data cambia a 'reportevoluntario'
        detalles_data = validated_data.pop('reportevoluntario')
        usuario = self.context['request'].user
        
        # 1. Crear en tabla 'reportes'
        reporte_madre = Reporte.objects.create(id_usuario=usuario, **validated_data)
        
        # 2. Crear en 'reporte_voluntario'
        ReporteVoluntario.objects.create(id_reporte=reporte_madre, **detalles_data)

        # 3. Crear en 'estadisticas_reportes'
        try:
            raw_json = json.loads(detalles_data['detalles_completos_json'])
            EstadisticasReporte.objects.create(
                id_reporte=reporte_madre,
                severidad=detalles_data.get('severidad'),
                consecuencias=raw_json.get('consecuencias', '')
            )
        except Exception as e:
            print(f"Error en estadísticas: {e}")
            EstadisticasReporte.objects.create(id_reporte=reporte_madre)
        
        return reporte_madre

# -------------------------------------------------------------
# --- Serializers de Usuario ---
# -------------------------------------------------------------
class UsuarioSerializer(serializers.ModelSerializer):
    id_rol = RolSerializer(read_only=True) 
    id_tipo = TipoUsuarioSerializer(read_only=True)
    password = serializers.CharField(write_only=True, required=False) 

    class Meta:
        model = Usuario
        fields = ('id_usuario', 'nombre', 'correo', 'password', 'id_rol', 'id_tipo', 'fecha_registro')
        read_only_fields = ['id_usuario', 'fecha_registro']

class UsuarioMeSerializer(serializers.ModelSerializer):
    rol = RolSerializer(source='id_rol', read_only=True)
    tipo_usuario = TipoUsuarioSerializer(source='id_tipo', read_only=True) 

    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nombre', 'correo', 'rol', 'tipo_usuario']