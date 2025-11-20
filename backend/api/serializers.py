# backend/api/serializers.py
from rest_framework import serializers
from .models import Rol, TipoUsuario, Usuario, Reporte, EstadisticasReporte

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
# --- Serializer Principal de Usuarios (CORREGIDO PARA AUTENTICACIÓN) ---
# -------------------------------------------------------------

class UsuarioSerializer(serializers.ModelSerializer):
    # Usar Serializers anidados para mostrar los datos completos del FK (Mejor que ReadOnlyField)
    id_rol = RolSerializer(read_only=True) 
    id_tipo = TipoUsuarioSerializer(read_only=True)
 
    password = serializers.CharField(write_only=True) 

    class Meta:
        model = Usuario
        fields = ('id_usuario', 'nombre', 'correo', 'password', 'id_rol', 'id_tipo', 'fecha_registro')
        read_only_fields = ['id_usuario', 'fecha_registro']
 
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Usuario.objects.create(**validated_data)
        if password is not None:
            user.set_password(password)
            user.save()
        return user

# -------------------------------------------------------------
# --- Serializer Específico para el Dashboard (/me/) ---
# -------------------------------------------------------------

class UsuarioMeSerializer(serializers.ModelSerializer):
    # 🛑 AJUSTE: Renombramos 'tipo' a 'tipo_usuario' para que Angular lo lea mejor.
    # Esto evita confusión ya que 'tipo' es una palabra muy genérica.
    rol = RolSerializer(source='id_rol', read_only=True)
    tipo_usuario = TipoUsuarioSerializer(source='id_tipo', read_only=True) # <--- CAMBIO DE NOMBRE
 
    class Meta:
        model = Usuario
        # 🛑 Incluimos el nuevo nombre 'tipo_usuario'
        fields = ['id_usuario', 'nombre', 'correo', 'rol', 'tipo_usuario'] 
 
# -------------------------------------------------------------
# --- Otros Serializers (Sin Cambios) ---
# -------------------------------------------------------------

class EstadisticasReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadisticasReporte
        fields = '__all__'

class ReporteSerializer(serializers.ModelSerializer):
    nombre_usuario = serializers.ReadOnlyField(source='id_usuario.nombre')
    estadisticas = EstadisticasReporteSerializer(source='estadisticasreporte', read_only=True)

    class Meta:
        model = Reporte
        fields = ('id_reporte', 'id_usuario', 'nombre_usuario', 'tipo_reporte', 'descripcion', 'fecha_reporte', 'estadisticas')