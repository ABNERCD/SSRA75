# backend/api/models.py
from django.db import models

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

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(max_length=100, unique=True)
    contrasena = models.CharField(max_length=255) # Contraseña hasheada
    
    # Foreign Keys
    id_rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, db_column='id_rol')
    id_tipo = models.ForeignKey(TipoUsuario, on_delete=models.SET_NULL, null=True, db_column='id_tipo')
    
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'usuarios'
        verbose_name_plural = "Usuarios"

    def __str__(self):
        return self.nombre

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
    # Usa OneToOneField ya que cada reporte solo debe tener 1 estadística
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