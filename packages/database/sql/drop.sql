-- ============================================================
-- SCRIPT DE LIMPIEZA DE DATOS (DML RESET)
-- Sistema: HMS OMNIHOTEL
-- Acción: Borra el contenido de las tablas sin eliminar la estructura.
-- ============================================================

-- Desactivar temporalmente los triggers para agilizar el proceso
SET session_replication_role = 'replica';

-- Truncar todas las tablas en orden de dependencia o con CASCADE
-- RESTART IDENTITY reinicia contadores (aunque uses UUID, es buena práctica)
TRUNCATE TABLE
    logs_auditoria,
    transacciones_folio,
    folios,
    turnos_caja,
    reservas,
    huespedes,
    habitaciones,
    categorias_habitacion,
    usuarios,
    configuracion_marca,
    hoteles,
    catalogo_paises,
    catalogo_ubigeo
RESTART IDENTITY CASCADE;

-- Reactivar el comportamiento normal de triggers
SET session_replication_role = 'origin';

-- Mensaje de confirmación (PostgreSQL)
DO $$
BEGIN
    RAISE NOTICE 'Base de datos vaciada exitosamente. Estructura preservada.';
END $$;

SELECT id, nombre_comercial FROM hoteles WHERE slug = 'hotel-paraiso';