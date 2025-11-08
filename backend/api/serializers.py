# backend/api/serializers.py
from rest_framework import serializers
from .models import Rol, TipoUsuario, Usuario, Reporte, EstadisticasReporte

# --- Serializers Base (Anidados) ---

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ['id_rol', 'nombre']

class TipoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoUsuario
        fields = ['id_tipo', 'nombre']

# --- Serializer Principal de Usuarios (CORREGIDO PARA AUTENTICACIÓN) ---

class UsuarioSerializer(serializers.ModelSerializer):
    # Usar Serializers anidados para mostrar los datos completos del FK (Mejor que ReadOnlyField)
    # read_only=True asegura que solo se usen para leer la respuesta.
    id_rol = RolSerializer(read_only=True) 
    id_tipo = TipoUsuarioSerializer(read_only=True)
    
    # Campo de solo escritura que se mapea a 'password' para el hash
    # ESTO ES CLAVE para AbstractBaseUser (el nombre debe ser 'password')
    password = serializers.CharField(write_only=True) 

    class Meta:
        model = Usuario
        # El campo 'password' reemplaza a 'contrasena' en la lista de fields.
        fields = ('id_usuario', 'nombre', 'correo', 'password', 'id_rol', 'id_tipo', 'fecha_registro')
        read_only_fields = ['id_usuario', 'fecha_registro']
        
    def create(self, validated_data):
        # 1. Extraer la contraseña
        password = validated_data.pop('password', None)
        
        # 2. Crear el usuario sin la contraseña (que es None por defecto en AbstractBaseUser)
        user = Usuario.objects.create(**validated_data)
        
        # 3. Aplicar el hashing de la contraseña
        if password is not None:
            user.set_password(password) # set_password HASHES la contraseña
            user.save()
            
        return user

# --- Serializer Específico para el Dashboard (/me/) ---

class UsuarioMeSerializer(serializers.ModelSerializer):
    # Renombrar los campos de FK a algo más amigable y mostrar sus datos anidados
    rol = RolSerializer(source='id_rol', read_only=True)
    tipo = TipoUsuarioSerializer(source='id_tipo', read_only=True)
    
    class Meta:
        model = Usuario
        # Campos exactos que necesita el frontend: id, nombre, correo, rol, tipo
        fields = ['id_usuario', 'nombre', 'correo', 'rol', 'tipo']
        
# --- Otros Serializers (Se mantienen con ajustes menores) ---

class EstadisticasReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadisticasReporte
        fields = '__all__' # Usar '__all__' es más simple si no hay exclusiones
        # Si quieres excluir id_reporte para anidarlo en ReporteSerializer:
        # fields = ('id_estadistica', 'cantidad', 'consecuencias', 'severidad', 'fase_ocurrencia', 'otros') 

class ReporteSerializer(serializers.ModelSerializer):
    # Muestra el nombre del usuario en lugar de solo su ID
    nombre_usuario = serializers.ReadOnlyField(source='id_usuario.nombre')
    
    # Permite anidar la estadística dentro del reporte (OneToOneField usa related_name 'estadisticasreporte' por defecto)
    estadisticas = EstadisticasReporteSerializer(source='estadisticasreporte', read_only=True)

    class Meta:
        model = Reporte
        fields = ('id_reporte', 'id_usuario', 'nombre_usuario', 'tipo_reporte', 'descripcion', 'fecha_reporte', 'estadisticas')
        