-- ============================================================
-- SISTEMA DE GESTIÓN HOTELERA (HMS) — OMNIHOTEL SaaS
-- Versión: 2.0 (Maestra - Completa)
-- Arquitectura: Multi-tenant Lógico | Marca Blanca
-- ============================================================

-- [0] LIMPIEZA TOTAL
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO hms_admin;
GRANT ALL ON SCHEMA public TO public;

-- [1] EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- [2] TIPOS ENUMERADOS (Enums)
CREATE TYPE rol_usuario AS ENUM ('SUPER_ADMIN', 'ADMIN_HOTEL', 'RECEPCIONISTA', 'HOUSEKEEPING', 'MANTENIMIENTO');
CREATE TYPE estado_habitacion AS ENUM ('DISPONIBLE', 'OCUPADA', 'SUCIA', 'EN_LIMPIEZA', 'MANTENIMIENTO', 'BLOQUEADA');
CREATE TYPE estado_reserva AS ENUM ('PENDIENTE', 'CONFIRMADA', 'GARANTIZADA', 'CHECK_IN', 'CHECK_OUT', 'CANCELADA', 'NO_SHOW');
CREATE TYPE origen_reserva AS ENUM ('DIRECTO', 'WEB_PROPIA', 'BOOKING_COM', 'EXPEDIA', 'AIRBNB');
CREATE TYPE tipo_transaccion AS ENUM ('CARGO', 'ABONO', 'AJUSTE');
CREATE TYPE tipo_documento AS ENUM ('DNI', 'PASAPORTE', 'CE', 'RUC');

-- [3] CATÁLOGOS MAESTROS (Globales)
CREATE TABLE catalogo_ubigeo (
    codigo_ubigeo VARCHAR(6) PRIMARY KEY,
    departamento   VARCHAR(100) NOT NULL,
    provincia      VARCHAR(100) NOT NULL,
    distrito       VARCHAR(100) NOT NULL
);

CREATE TABLE catalogo_paises (
    codigo_iso CHAR(2) PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL
);

-- [4] NÚCLEO SAAS (Tenants & Marca Blanca)
CREATE TABLE hoteles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            VARCHAR(50) UNIQUE NOT NULL, -- Para subdominio: hotel-miraflores.hms.com
    nombre_comercial VARCHAR(150) NOT NULL,
    razon_social    VARCHAR(200),
    nro_ruc         VARCHAR(20) UNIQUE,
    correo_contacto VARCHAR(150) NOT NULL,
    telefono        VARCHAR(30),
    direccion       TEXT,
    codigo_ubigeo   VARCHAR(6) REFERENCES catalogo_ubigeo(codigo_ubigeo),
    moneda_base     CHAR(3) DEFAULT 'PEN',
    impuesto_base   NUMERIC(5,2) DEFAULT 18.00, -- IGV Configurable
    activo          BOOLEAN DEFAULT TRUE,
    creado_at       TIMESTAMPTZ DEFAULT NOW(),
    actualizado_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE configuracion_marca (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id         UUID NOT NULL UNIQUE REFERENCES hoteles(id) ON DELETE CASCADE,
    color_primario   CHAR(7) DEFAULT '#3B82F6',
    color_secundario CHAR(7) DEFAULT '#1E293B',
    url_logo         TEXT,
    url_favicon      TEXT,
    fuente_familia   VARCHAR(50) DEFAULT 'Inter',
    dominio_custom   VARCHAR(100) UNIQUE -- Ej: reservas.hotelmiraflores.com
);

-- [5] PERSONAL Y ACCESOS (IAM)
CREATE TABLE usuarios (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id        UUID NOT NULL REFERENCES hoteles(id) ON DELETE CASCADE,
    email           VARCHAR(150) NOT NULL,
    password_hash   TEXT NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    rol             rol_usuario DEFAULT 'RECEPCIONISTA',
    activo          BOOLEAN DEFAULT TRUE,
    creado_at       TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_usuario_email_hotel UNIQUE(hotel_id, email)
);

-- [6] INFRAESTRUCTURA HOTELERA
CREATE TABLE categorias_habitacion (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id        UUID NOT NULL REFERENCES hoteles(id) ON DELETE CASCADE,
    nombre          VARCHAR(100) NOT NULL, -- Ej: Suite, Doble
    precio_base     NUMERIC(12,2) NOT NULL CHECK (precio_base >= 0),
    capacidad_adultos INT DEFAULT 2,
    capacidad_ninos   INT DEFAULT 0,
    creado_at       TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_categoria_hotel UNIQUE(hotel_id, nombre)
);

CREATE TABLE habitaciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id        UUID NOT NULL REFERENCES hoteles(id) ON DELETE CASCADE,
    categoria_id    UUID NOT NULL REFERENCES categorias_habitacion(id),
    nro_habitacion  VARCHAR(10) NOT NULL,
    piso            INT NOT NULL,
    estado          estado_habitacion DEFAULT 'DISPONIBLE',
    activo          BOOLEAN DEFAULT TRUE,
    CONSTRAINT uq_nro_hab_hotel UNIQUE(hotel_id, nro_habitacion)
);

-- [7] HUÉSPEDES Y RESERVAS (CRM & BOOKING)
CREATE TABLE huespedes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id        UUID NOT NULL REFERENCES hoteles(id) ON DELETE CASCADE,
    tipo_doc        tipo_documento DEFAULT 'DNI',
    nro_doc         VARCHAR(30) NOT NULL,
    nombres         VARCHAR(100) NOT NULL,
    apellidos       VARCHAR(100) NOT NULL,
    email           VARCHAR(150),
    telefono        VARCHAR(30),
    codigo_iso_pais CHAR(2) REFERENCES catalogo_paises(codigo_iso),
    creado_at       TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_huesped_hotel UNIQUE(hotel_id, tipo_doc, nro_doc)
);

CREATE TABLE reservas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id        UUID NOT NULL REFERENCES hoteles(id) ON DELETE CASCADE,
    huesped_id      UUID NOT NULL REFERENCES huespedes(id),
    habitacion_id   UUID NOT NULL REFERENCES habitaciones(id),
    fecha_ingreso   DATE NOT NULL,
    fecha_salida    DATE NOT NULL,
    estado          estado_reserva DEFAULT 'PENDIENTE',
    origen          origen_reserva DEFAULT 'DIRECTO',
    total_estimado  NUMERIC(12,2) NOT NULL,
    aplica_igv      BOOLEAN DEFAULT TRUE, -- REGLA: Flexibilidad IGV
    notas           TEXT,
    creado_by       UUID REFERENCES usuarios(id),
    creado_at       TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_fechas CHECK (fecha_salida > fecha_ingreso)
);

-- [8] CAJA Y OPERACIONES DIARIAS (NUEVO)
CREATE TABLE turnos_caja (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id        UUID NOT NULL REFERENCES hoteles(id) ON DELETE CASCADE,
    usuario_id      UUID NOT NULL REFERENCES usuarios(id),
    monto_apertura  NUMERIC(12,2) NOT NULL,
    monto_cierre    NUMERIC(12,2),
    abierto_at      TIMESTAMPTZ DEFAULT NOW(),
    cerrado_at      TIMESTAMPTZ,
    estado          BOOLEAN DEFAULT TRUE -- TRUE = Abierta
);

-- [9] FINANZAS Y FOLIOS (Inmutabilidad)
CREATE TABLE folios (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id      UUID NOT NULL UNIQUE REFERENCES reservas(id) ON DELETE CASCADE,
    abierto         BOOLEAN DEFAULT TRUE,
    creado_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transacciones_folio (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio_id        UUID NOT NULL REFERENCES folios(id) ON DELETE CASCADE,
    tipo            tipo_transaccion NOT NULL,
    monto           NUMERIC(12,2) NOT NULL,
    descripcion     VARCHAR(255) NOT NULL,
    es_gravado      BOOLEAN DEFAULT TRUE, -- REGLA: IGV por ítem
    usuario_id      UUID NOT NULL REFERENCES usuarios(id),
    turno_caja_id   UUID REFERENCES turnos_caja(id),
    creado_at       TIMESTAMPTZ DEFAULT NOW()
);

-- [10] AUDITORÍA Y RENDIMIENTO
CREATE TABLE logs_auditoria (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id        UUID NOT NULL REFERENCES hoteles(id),
    usuario_id      UUID REFERENCES usuarios(id),
    accion          VARCHAR(50) NOT NULL, -- INSERT, UPDATE, DELETE
    tabla_afectada  VARCHAR(50) NOT NULL,
    registro_id     UUID NOT NULL,
    valor_anterior  JSONB,
    valor_nuevo     JSONB,
    ip_address      VARCHAR(45),
    creado_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES COMPUESTOS (Columna vertebral del SaaS)
CREATE INDEX idx_hab_hotel_estado ON habitaciones (hotel_id, estado);
CREATE INDEX idx_res_hotel_fechas ON reservas (hotel_id, fecha_ingreso, fecha_salida);
CREATE INDEX idx_trans_folio ON transacciones_folio (folio_id);
CREATE INDEX idx_huesped_doc ON huespedes (hotel_id, nro_doc);

-- [11] AUTOMATIZACIÓN (Triggers)
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_hotel BEFORE UPDATE ON hoteles FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();