# backend/api/serializers.py
from rest_framework import serializers
from .models import Rol, TipoUsuario, Usuario, Reporte, EstadisticasReporte

# Serializer para Modelos de Soporte (Roles y Tipos de Usuario)
class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__' # Incluye todos los campos (id_rol, nombre)

class TipoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoUsuario
        fields = '__all__' # Incluye todos los campos (id_tipo, nombre)

# Serializer para Usuarios
class UsuarioSerializer(serializers.ModelSerializer):
    # Campos de solo lectura para mostrar el nombre del Rol y Tipo
    nombre_rol = serializers.ReadOnlyField(source='id_rol.nombre')
    nombre_tipo = serializers.ReadOnlyField(source='id_tipo.nombre')

    class Meta:
        model = Usuario
        # Exponemos campos específicos, incluyendo las claves foráneas (id_rol, id_tipo)
        # y los campos de solo lectura que acabamos de definir.
        fields = ('id_usuario', 'nombre', 'correo', 'contrasena', 'id_rol', 'nombre_rol', 'id_tipo', 'nombre_tipo', 'fecha_registro')
        # Hacemos la contraseña de solo escritura para que no se muestre al consultar
        extra_kwargs = {'contrasena': {'write_only': True}} 

# Serializer para Estadísticas de Reporte
class EstadisticasReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadisticasReporte
        # Excluímos id_reporte si se usa dentro del ReporteSerializer, o incluímos si es standalone
        fields = ('id_estadistica', 'cantidad', 'consecuencias', 'severidad', 'fase_ocurrencia', 'otros') 
        # Si se crea la estadística junto con el reporte, se necesita el ID del reporte
        # fields = '__all__' 

# Serializer para Reportes
class ReporteSerializer(serializers.ModelSerializer):
    # Muestra el nombre del usuario en lugar de solo su ID
    nombre_usuario = serializers.ReadOnlyField(source='id_usuario.nombre')
    
    # Permite anidar la estadística dentro del reporte (solo lectura por defecto)
    estadisticas = EstadisticasReporteSerializer(source='estadisticasreporte', read_only=True)

    class Meta:
        model = Reporte
        fields = ('id_reporte', 'id_usuario', 'nombre_usuario', 'tipo_reporte', 'descripcion', 'fecha_reporte', 'estadisticas')