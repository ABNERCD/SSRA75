-- =================================================================
-- PASO 1: CREAR LA BASE DE DATOS
-- (Ejecutar conectado a la base de datos 'postgres' por defecto)
-- =================================================================

DROP DATABASE IF EXISTS "Taller75";

CREATE DATABASE "Taller75"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Mexico.1252'
    LC_CTYPE = 'Spanish_Mexico.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


-- =================================================================
-- PASO 2: CREAR LAS TABLAS
-- (IMPORTANTE: Ahora debes conectarte a 'reportes_app_db' antes de ejecutar esto)
-- En psql, usarías: \c reportes_app_db
-- En pgAdmin, abre un nuevo Query Tool para esta base de datos.
-- =================================================================

-- Tabla de Roles (para distinguir administradores y usuarios)
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL  -- Ej: Administrador, Usuario
);

-- Tabla de Tipos de Usuario (categorías de usuarios finales)
CREATE TABLE tipos_usuario (
    id_tipo SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL  -- Ej: Alumno, Instructor, Técnico, Personal Operativo
);

-- Tabla de Usuarios (con la columna de contraseña ya incluida)
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL, -- Columna para la contraseña hasheada
    id_rol INT REFERENCES roles(id_rol),
    id_tipo INT REFERENCES tipos_usuario(id_tipo),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Reportes
CREATE TABLE reportes (
    id_reporte SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario),
    tipo_reporte VARCHAR(20) CHECK (tipo_reporte IN ('Voluntario', 'Obligatorio')),
    descripcion TEXT,
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Estadísticas de Reportes
CREATE TABLE estadisticas_reportes (
    id_estadistica SERIAL PRIMARY KEY,
    id_reporte INT REFERENCES reportes(id_reporte) ON DELETE CASCADE,
    cantidad INT,
    consecuencias TEXT,
    severidad VARCHAR(50),
    fase_ocurrencia VARCHAR(100),
    otros TEXT
);


SELECT tablename
FROM pg_tables
WHERE schemaname = 'public';
	