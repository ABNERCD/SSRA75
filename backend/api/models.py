# backend/api/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# --- User Manager (Maneja la creación de usuarios, esencial para AbstractBaseUser) ---
class UsuarioManager(BaseUserManager):
    def create_user(self, correo, password=None, **extra_fields):
        """Crea y guarda un usuario normal con el correo y la contraseña proporcionados."""
        if not correo:
            raise ValueError('El correo electrónico debe ser proporcionado')
        email = self.normalize_email(correo)
        # El campo de contraseña es 'password' en AbstractBaseUser, no 'contrasena'
        user = self.model(correo=email, **extra_fields)
        user.set_password(password) # Esto se encarga del hashing de la contraseña
        user.save(using=self._db)
        return user

    def create_superuser(self, correo, password=None, **extra_fields):
        """Crea y guarda un superusuario con permisos elevados."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser debe tener is_superuser=True.')

        return self.create_user(correo, password, **extra_fields)

# ----------------------------------------------------------------------------------

class Rol(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50) 

    class Meta:
        db_table = 'roles'
        verbose_name_plural = "Roles"

    def __str__(self):
        return self.nombre

class TipoUsuario(models.Model):
    id_tipo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50) 

    class Meta:
        db_table = 'tipos_usuario'
        verbose_name_plural = "Tipos de Usuario"

    def __str__(self):
        return self.nombre

# --- Modelo de Usuario Principal (Hereda de AbstractBaseUser para autenticación) ---
class Usuario(AbstractBaseUser, PermissionsMixin):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(max_length=100, unique=True)
    
    # Nota: El campo de contraseña se maneja internamente como 'password' por AbstractBaseUser.
    # Si tu tabla de Postgres usa 'contrasena', Django debe configurarse con un custom backend
    # o debes cambiar el nombre de la columna en Postgres a 'password'.
    # Asumiremos que estás usando el nombre de campo interno de Django o has aplicado una migración
    # para usar el nombre 'password' en la BD.
    
    # Foreign Keys
    id_rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, db_column='id_rol')
    id_tipo = models.ForeignKey(TipoUsuario, on_delete=models.SET_NULL, null=True, db_column='id_tipo')
    
    fecha_registro = models.DateTimeField(auto_now_add=True)

    # Campos requeridos por Django Auth
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Configuración de Autenticación
    objects = UsuarioManager()
    
    USERNAME_FIELD = 'correo' # <--- Define el campo que se usará para iniciar sesión
    REQUIRED_FIELDS = ['nombre'] # Campos requeridos al crear un superusuario
    
    class Meta:
        db_table = 'usuarios'
        verbose_name_plural = "Usuarios"

    def __str__(self):
        return self.nombre
    
    def get_full_name(self):
        return self.nombre

    def get_short_name(self):
        return self.nombre

# ----------------------------------------------------------------------------------

class Reporte(models.Model):
    id_reporte = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    
    TIPO_CHOICES = (
        ('Voluntario', 'Voluntario'),
        ('Obligatorio', 'Obligatorio'),
    )
    tipo_reporte = models.CharField(max_length=20, choices=TIPO_CHOICES)
    descripcion = models.TextField()
    fecha_reporte = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reportes'
        verbose_name_plural = "Reportes"

    def __str__(self):
        return f"Reporte {self.id_reporte}"

class EstadisticasReporte(models.Model):
    id_estadistica = models.AutoField(primary_key=True)
    id_reporte = models.OneToOneField(Reporte, on_delete=models.CASCADE, db_column='id_reporte')
    
    cantidad = models.IntegerField(null=True, blank=True)
    consecuencias = models.TextField(null=True, blank=True)
    severidad = models.CharField(max_length=50, null=True, blank=True)
    fase_ocurrencia = models.CharField(max_length=100, null=True, blank=True)
    otros = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'estadisticas_reportes'
        verbose_name_plural = "Estadísticas de Reportes"

    def __str__(self):
        return f"Estadística de Reporte {self.id_reporte.id_reporte}"