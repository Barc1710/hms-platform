-- ============================================================
-- SEED DATA PARA OMNIHOTEL SaaS
-- Orden de inserción: Catálogos -> Hotel -> Config -> Personal -> Infraestructura -> CRM -> Operaciones
-- ============================================================

-- [1] CATÁLOGOS GLOBALES
INSERT INTO catalogo_paises (codigo_iso, nombre) VALUES
('PE', 'Perú'),
('ES', 'España'),
('US', 'Estados Unidos');

INSERT INTO catalogo_ubigeo (codigo_ubigeo, departamento, provincia, distrito) VALUES
('150101', 'Lima', 'Lima', 'Lima'),
('150115', 'Lima', 'Lima', 'Miraflores'),
('080101', 'Cusco', 'Cusco', 'Cusco');

-- [2] EL TENANT (HOTEL)
-- Guardamos el ID en una variable para usarlo en todo el script
DO $$
DECLARE
    v_hotel_id UUID;
    v_admin_id UUID;
    v_recep_id UUID;
    v_cat_suite_id UUID;
    v_hab_101_id UUID;
    v_huesped_id UUID;
    v_reserva_id UUID;
    v_caja_id UUID;
    v_folio_id UUID;
BEGIN
    -- Insertar Hotel
    INSERT INTO hoteles (slug, nombre_comercial, razon_social, nro_ruc, correo_contacto, codigo_ubigeo, moneda_base)
    VALUES ('hotel-paraiso', 'Hotel Paraíso Miraflores', 'Inversiones Hoteleras S.A.C.', '20123456789', 'gerencia@hotelparaiso.com', '150115', 'PEN')
    RETURNING id INTO v_hotel_id;

    -- [3] CONFIGURACIÓN DE MARCA (White Label)
    INSERT INTO configuracion_marca (hotel_id, color_primario, color_secundario, url_logo, fuente_familia)
    VALUES (v_hotel_id, '#0F172A', '#3B82F6', 'https://cdn.omnihotel.com/logos/paraiso.png', 'Poppins');

    -- [4] PERSONAL (IAM)
    -- Contraseña de ejemplo: 'password123' (en un entorno real usarías el hash de pgcrypto)
    INSERT INTO usuarios (hotel_id, email, password_hash, nombre_completo, rol)
    VALUES (v_hotel_id, 'admin@hotelparaiso.com', crypt('password123', gen_salt('bf')), 'Administrador Maestro', 'ADMIN_HOTEL')
    RETURNING id INTO v_admin_id;

    INSERT INTO usuarios (hotel_id, email, password_hash, nombre_completo, rol)
    VALUES (v_hotel_id, 'recepcion@hotelparaiso.com', crypt('recep123', gen_salt('bf')), 'Lucía Recepcionista', 'RECEPCIONISTA')
    RETURNING id INTO v_recep_id;

    -- [5] INFRAESTRUCTURA (Categorías y Habitaciones)
    INSERT INTO categorias_habitacion (hotel_id, nombre, precio_base, capacidad_adultos, capacidad_ninos)
    VALUES (v_hotel_id, 'Suite Matrimonial Deluxe', 350.00, 2, 1)
    RETURNING id INTO v_cat_suite_id;

    INSERT INTO habitaciones (hotel_id, categoria_id, nro_habitacion, piso, estado)
    VALUES (v_hotel_id, v_cat_suite_id, '101', 1, 'DISPONIBLE')
    RETURNING id INTO v_hab_101_id;

    INSERT INTO habitaciones (hotel_id, categoria_id, nro_habitacion, piso, estado)
    VALUES (v_hotel_id, v_cat_suite_id, '102', 1, 'SUCIA');

    -- [6] HUÉSPED (CRM)
    INSERT INTO huespedes (hotel_id, tipo_doc, nro_doc, nombres, apellidos, email, codigo_iso_pais)
    VALUES (v_hotel_id, 'DNI', '44556677', 'Juan Carlos', 'Pérez Bazán', 'juan.perez@email.com', 'PE')
    RETURNING id INTO v_huesped_id;

    -- [7] RESERVA
    INSERT INTO reservas (hotel_id, huesped_id, habitacion_id, fecha_ingreso, fecha_salida, estado, origen, total_estimado, creado_by)
    VALUES (v_hotel_id, v_huesped_id, v_hab_101_id, CURRENT_DATE, CURRENT_DATE + 3, 'CONFIRMADA', 'WEB_PROPIA', 1050.00, v_recep_id)
    RETURNING id INTO v_reserva_id;

    -- [8] CAJA Y FINANZAS
    -- Abrir turno de caja
    INSERT INTO turnos_caja (hotel_id, usuario_id, monto_apertura)
    VALUES (v_hotel_id, v_recep_id, 200.00)
    RETURNING id INTO v_caja_id;

    -- Crear Folio (Estado de cuenta de la reserva)
    INSERT INTO folios (reserva_id)
    VALUES (v_reserva_id)
    RETURNING id INTO v_folio_id;

    -- Insertar una transacción inicial (Cargo por la primera noche)
    INSERT INTO transacciones_folio (folio_id, tipo, monto, descripcion, usuario_id, turno_caja_id)
    VALUES (v_folio_id, 'CARGO', 350.00, 'Alojamiento Noche 1 - Hab 101', v_recep_id, v_caja_id);

    -- [9] AUDITORÍA (Ejemplo)
    INSERT INTO logs_auditoria (hotel_id, usuario_id, accion, tabla_afectada, registro_id, valor_nuevo)
    VALUES (v_hotel_id, v_admin_id, 'INSERT', 'reservas', v_reserva_id, '{"mensaje": "Reserva inicial creada"}');

    RAISE NOTICE 'Seed finalizado: Hotel Paraíso y datos de prueba creados con éxito.';
END $$;