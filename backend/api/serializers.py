from rest_framework import serializers
# IMPORTANTE: Necesario para el Login personalizado (Agregado)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 
from .models import Rol, TipoUsuario, Usuario, Reporte, EstadisticasReporte

# -------------------------------------------------------------
# --- Serializer de LOGIN (Token Personalizado) ---
# --- (ESTE FALTABA Y ES CRÍTICO PARA EL LOGIN) ---
# -------------------------------------------------------------
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Datos extra que viajan en el token
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
# --- (ESTE FALTABA Y ES CRÍTICO PARA EL REGISTRO) ---
# -------------------------------------------------------------
class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # Recibimos solo el ID (ej: 1) desde el frontend
    id_tipo = serializers.PrimaryKeyRelatedField(queryset=TipoUsuario.objects.all(), required=True)

    class Meta:
        model = Usuario
        fields = ['nombre', 'correo', 'password', 'id_tipo']

    def create(self, validated_data):
        # Usamos el manager para encriptar la contraseña correctamente
        user = Usuario.objects.create_user(
            correo=validated_data['correo'],
            nombre=validated_data['nombre'],
            password=validated_data['password'],
            id_tipo=validated_data['id_tipo']
        )
        return user

# -------------------------------------------------------------
# --- Serializer Principal de Usuarios (TU CÓDIGO ORIGINAL) ---
# -------------------------------------------------------------

class UsuarioSerializer(serializers.ModelSerializer):
    # Usar Serializers anidados para mostrar los datos completos del FK
    id_rol = RolSerializer(read_only=True) 
    id_tipo = TipoUsuarioSerializer(read_only=True)
 
    password = serializers.CharField(write_only=True, required=False) 

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
# --- Serializer Específico para el Dashboard (/me/) (TU CÓDIGO) ---
# -------------------------------------------------------------

class UsuarioMeSerializer(serializers.ModelSerializer):
    # 🛑 AJUSTE: Renombramos 'tipo' a 'tipo_usuario' para que Angular lo lea mejor.
    rol = RolSerializer(source='id_rol', read_only=True)
    tipo_usuario = TipoUsuarioSerializer(source='id_tipo', read_only=True) 
 
    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nombre', 'correo', 'rol', 'tipo_usuario'] 
 
# -------------------------------------------------------------
# --- Otros Serializers (TU CÓDIGO) ---
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
        read_only_fields = ('id_usuario', 'fecha_reporte')