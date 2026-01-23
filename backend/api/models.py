# backend/api/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# --- User Manager ---
class UsuarioManager(BaseUserManager):
    def create_user(self, correo, password=None, **extra_fields):
        if not correo:
            raise ValueError('El correo electrónico debe ser proporcionado')
        email = self.normalize_email(correo)
        user = self.model(correo=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, correo, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(correo, password, **extra_fields)

# --- Catálogos ---
class Rol(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50) 
    class Meta:
        db_table = 'roles'
        verbose_name_plural = "Roles"
    def __str__(self): return self.nombre

class TipoUsuario(models.Model):
    id_tipo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50) 
    class Meta:
        db_table = 'tipos_usuario'
        verbose_name_plural = "Tipos de Usuario"
    def __str__(self): return self.nombre

# --- Modelo de Usuario ---
class Usuario(AbstractBaseUser, PermissionsMixin):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(max_length=100, unique=True)
    id_rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, db_column='id_rol')
    id_tipo = models.ForeignKey(TipoUsuario, on_delete=models.SET_NULL, null=True, db_column='id_tipo')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    objects = UsuarioManager()
    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre']
    class Meta:
        db_table = 'usuarios'
        verbose_name_plural = "Usuarios"
    def __str__(self): return self.nombre

# ----------------------------------------------------------------------------------
# SECCIÓN DE REPORTES (SSRA75)
# ----------------------------------------------------------------------------------

class Reporte(models.Model):
    """Tabla Madre: Información administrativa y de control."""
    id_reporte = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    
    # Encabezado del documento físico
    numero_reporte_manual = models.CharField(max_length=50) 
    fecha_elaboracion = models.DateField() 
    
    tipo_reporte = models.CharField(max_length=50) # 'Voluntario', 'RPAS', etc.
    subtipo = models.CharField(max_length=20, choices=[('Voluntario', 'Voluntario'), ('Obligatorio', 'Obligatorio')])
    
    estatus = models.CharField(max_length=20, default='Pendiente')
    fecha_creacion_sistema = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reportes'
        verbose_name_plural = "Reportes"

    def __str__(self):
        return f"Reporte {self.numero_reporte_manual} ({self.tipo_reporte})"

class ReporteGenerado(models.Model): # Cambiamos el nombre de la clase
    # El related_name 'detalles_reporte' es el que usaremos en el Serializer
    id_reporte = models.OneToOneField(
        Reporte, 
        on_delete=models.CASCADE, 
        primary_key=True, 
        db_column='id_reporte',
        related_name='detalles_reporte' 
    )
    nombre_reportante = models.CharField(max_length=255, null=True, blank=True)
    correo_reportante = models.CharField(max_length=255, null=True, blank=True)
    
    # Campos obligatorios sincronizados con tu SQL
    lugar = models.CharField(max_length=255)
    hora_local = models.TimeField()
    fecha_evento = models.DateField()
    probabilidad = models.CharField(max_length=50)
    severidad = models.CharField(max_length=50)
    
    detalles_completos_json = models.TextField()

    class Meta:
        db_table = 'reportes_generados' # <--- DEBE coincidir con el ALTER TABLE de Postgres
        verbose_name_plural = "Detalles de Reportes Generados"

class EstadisticasReporte(models.Model):
    id_estadistica = models.AutoField(primary_key=True)
    id_reporte = models.OneToOneField(Reporte, on_delete=models.CASCADE, db_column='id_reporte')
    
    # Solo las columnas que existen en tu tabla SQL
    cantidad = models.IntegerField(null=True, blank=True)
    consecuencias = models.TextField(null=True, blank=True)
    severidad = models.CharField(max_length=50, null=True, blank=True)
    fase_ocurrencia = models.CharField(max_length=100, null=True, blank=True)
    otros = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'estadisticas_reportes'
        verbose_name_plural = "Estadísticas de Reportes"