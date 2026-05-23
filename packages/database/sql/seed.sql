-- ============================================================
-- SEED DATA PARA OMNIHOTEL SaaS
-- Orden de inserción: Catálogos -> Hoteles -> Config -> Personal -> Infraestructura -> CRM -> Operaciones
-- ============================================================

-- [1] CATÁLOGOS GLOBALES
INSERT INTO catalogo_paises (codigo_iso, nombre) VALUES
('PE', 'Perú'),
('ES', 'España'),
('US', 'Estados Unidos')
ON CONFLICT (codigo_iso) DO NOTHING;

INSERT INTO catalogo_ubigeo (codigo_ubigeo, departamento, provincia, distrito) VALUES
('150101', 'Lima', 'Lima', 'Lima'),
('150115', 'Lima', 'Lima', 'Miraflores'),
('080101', 'Cusco', 'Cusco', 'Cusco')
ON CONFLICT (codigo_ubigeo) DO NOTHING;

-- [2] HOTELES Y LÓGICA DE NEGOCIO POR TENANT
DO $$
DECLARE
    -- Hotel 1 (Paraíso)
    v_hotel1_id UUID;
    v_admin1_id UUID;
    v_recep1_id UUID;
    v_house1_id UUID;
    v_cat1_id UUID;
    v_hab1_101_id UUID;
    v_huesped1_id UUID;
    v_reserva1_id UUID;
    v_caja1_id UUID;
    v_folio1_id UUID;

    -- Hotel 2 (Alameda)
    v_hotel2_id UUID;
    v_admin2_id UUID;
    v_recep2_id UUID;
    v_house2_id UUID;
    v_cat2_id UUID;
    v_hab2_201_id UUID;
    v_huesped2_id UUID;
    v_reserva2_id UUID;
    v_caja2_id UUID;
    v_folio2_id UUID;

    -- Hotel 3 (Marina)
    v_hotel3_id UUID;
    v_admin3_id UUID;
    v_recep3_id UUID;
    v_house3_id UUID;
    v_cat3_id UUID;
    v_hab3_401_id UUID;
    v_huesped3_id UUID;
    v_reserva3_id UUID;
    v_caja3_id UUID;
    v_folio3_id UUID;
BEGIN
    -- ============================================================
    -- HOTEL 1: PARAÍSO MIRAFLORES
    -- ============================================================
    INSERT INTO hoteles (slug, nombre_comercial, razon_social, nro_ruc, correo_contacto, codigo_ubigeo, moneda_base)
    VALUES ('hotel-paraiso', 'Hotel Paraíso Miraflores', 'Inversiones Hoteleras S.A.C.', '20123456789', 'gerencia@hotelparaiso.com', '150115', 'PEN')
    RETURNING id INTO v_hotel1_id;

    INSERT INTO configuracion_marca (hotel_id, color_primario, color_secundario, url_logo, fuente_familia)
    VALUES (v_hotel1_id, '#0F172A', '#3B82F6', 'https://cdn.omnihotel.com/logos/paraiso.png', 'Poppins');

    -- Usuarios (3 por hotel)
    INSERT INTO usuarios (hotel_id, email, password_hash, nombre_completo, rol)
    VALUES (v_hotel1_id, 'admin@hotelparaiso.com', crypt('password123', gen_salt('bf')), 'Administrador Maestro Paraíso', 'ADMIN_HOTEL')
    RETURNING id INTO v_admin1_id;

    INSERT INTO usuarios (hotel_id, email, password_hash, nombre_completo, rol)
    VALUES (v_hotel1_id, 'recepcion@hotelparaiso.com', crypt('recep123', gen_salt('bf')), 'Lucía Recepcionista Paraíso', 'RECEPCIONISTA')
    RETURNING id INTO v_recep1_id;

    INSERT INTO usuarios (hotel_id, email, password_hash, nombre_completo, rol)
    VALUES (v_hotel1_id, 'housekeeping@hotelparaiso.com', crypt('clean123', gen_salt('bf')), 'Carlos Limpieza Paraíso', 'HOUSEKEEPING')
    RETURNING id INTO v_house1_id;

    -- Infraestructura, Huéspedes, Reservas
    INSERT INTO categorias_habitacion (hotel_id, nombre, precio_base, capacidad_adultos, capacidad_ninos)
    VALUES (v_hotel1_id, 'Suite Matrimonial Deluxe', 350.00, 2, 1)
    RETURNING id INTO v_cat1_id;

    INSERT INTO habitaciones (hotel_id, categoria_id, nro_habitacion, piso, estado)
    VALUES (v_hotel1_id, v_cat1_id, '101', 1, 'DISPONIBLE')
    RETURNING id INTO v_hab1_101_id;

    INSERT INTO habitaciones (hotel_id, categoria_id, nro_habitacion, piso, estado)
    VALUES (v_hotel1_id, v_cat1_id, '102', 1, 'SUCIA');

    INSERT INTO huespedes (hotel_id, tipo_doc, nro_doc, nombres, apellidos, email, codigo_iso_pais)
    VALUES (v_hotel1_id, 'DNI', '44556677', 'Juan Carlos', 'Pérez Bazán', 'juan.perez@email.com', 'PE')
    RETURNING id INTO v_huesped1_id;

    INSERT INTO reservas (hotel_id, huesped_id, habitacion_id, fecha_ingreso, fecha_salida, estado, origen, total_estimado, creado_by)
    VALUES (v_hotel1_id, v_huesped1_id, v_hab1_101_id, CURRENT_DATE, CURRENT_DATE + 3, 'CONFIRMADA', 'WEB_PROPIA', 1050.00, v_recep1_id)
    RETURNING id INTO v_reserva1_id;

    -- Caja y folio
    INSERT INTO turnos_caja (hotel_id, usuario_id, monto_apertura)
    VALUES (v_hotel1_id, v_recep1_id, 200.00)
    RETURNING id INTO v_caja1_id;

    INSERT INTO folios (reserva_id)
    VALUES (v_reserva1_id)
    RETURNING id INTO v_folio1_id;

    INSERT INTO transacciones_folio (folio_id, tipo, monto, descripcion, usuario_id, turno_caja_id)
    VALUES (v_folio1_id, 'CARGO', 350.00, 'Alojamiento Noche 1 - Hab 101', v_recep1_id, v_caja1_id);


    -- ============================================================
    -- HOTEL 2: ALAMEDA SAN ISIDRO
    -- ============================================================
    INSERT INTO hoteles (slug, nombre_comercial, razon_social, nro_ruc, correo_contacto, codigo_ubigeo, moneda_base)
    VALUES ('hotel-alameda', 'Hotel Alameda San Isidro', 'Inversiones Alameda S.A.C.', '20987654321', 'gerencia@hotelalameda.com', '150115', 'PEN')
    RETURNING id INTO v_hotel2_id;

    INSERT INTO configuracion_marca (hotel_id, color_primario, color_secundario, url_logo, fuente_familia)
    VALUES (v_hotel2_id, '#1E3A8A', '#10B981', 'https://cdn.omnihotel.com/logos/alameda.png', 'Outfit');

    -- Usuarios (3 por hotel)
    INSERT INTO usuarios (hotel_id, email, password_hash, nombre_completo, rol)
    VALUES (v_hotel2_id, 'admin@hotelalameda.com', crypt('password123', gen_salt('bf')), 'Administrador Maestro Alameda', 'ADMIN_HOTEL')
    RETURNING id INTO v_admin2_id;

    INSERT INTO usuarios (hotel_id, email, password_hash, nombre_completo, rol)
    VALUES (v_hotel2_id, 'recepcion@hotelalameda.com', crypt('recep123', gen_salt('bf')), 'Pedro Recepcionista Alameda', 'RECEPCIONISTA')
    RETURNING id INTO v_recep2_id;

    INSERT INTO usuarios (hotel_id, email, password_hash, nombre_completo, rol)
    VALUES (v_hotel2_id, 'housekeeping@hotelalameda.com', crypt('clean123', gen_salt('bf')), 'Ana Limpieza Alameda', 'HOUSEKEEPING')
    RETURNING id INTO v_house2_id;

    -- Infraestructura, Huéspedes, Reservas
    INSERT INTO categorias_habitacion (hotel_id, nombre, precio_base, capacidad_adultos, capacidad_ninos)
    VALUES (v_hotel2_id, 'Habitación Standard Ejecutiva', 250.00, 2, 0)
    RETURNING id INTO v_cat2_id;

    INSERT INTO habitaciones (hotel_id, categoria_id, nro_habitacion, piso, estado)
    VALUES (v_hotel2_id, v_cat2_id, '201', 2, 'DISPONIBLE')
    RETURNING id INTO v_hab2_201_id;

    INSERT INTO habitaciones (hotel_id, categoria_id, nro_habitacion, piso, estado)
    VALUES (v_hotel2_id, v_cat2_id, '202', 2, 'DISPONIBLE');

    INSERT INTO huespedes (hotel_id, tipo_doc, nro_doc, nombres, apellidos, email, codigo_iso_pais)
    VALUES (v_hotel2_id, 'PASAPORTE', 'P9876543', 'John', 'Doe', 'john.doe@email.com', 'US')
    RETURNING id INTO v_huesped2_id;

    INSERT INTO reservas (hotel_id, huesped_id, habitacion_id, fecha_ingreso, fecha_salida, estado, origen, total_estimado, creado_by)
    VALUES (v_hotel2_id, v_huesped2_id, v_hab2_201_id, CURRENT_DATE, CURRENT_DATE + 2, 'CONFIRMADA', 'BOOKING_COM', 500.00, v_recep2_id)
    RETURNING id INTO v_reserva2_id;

    -- Caja y folio
    INSERT INTO turnos_caja (hotel_id, usuario_id, monto_apertura)
    VALUES (v_hotel2_id, v_recep2_id, 150.00)
    RETURNING id INTO v_caja2_id;

    INSERT INTO folios (reserva_id)
    VALUES (v_reserva2_id)
    RETURNING id INTO v_folio2_id;

    INSERT INTO transacciones_folio (folio_id, tipo, monto, descripcion, usuario_id, turno_caja_id)
    VALUES (v_folio2_id, 'CARGO', 250.00, 'Alojamiento Noche 1 - Hab 201', v_recep2_id, v_caja2_id);


    -- ============================================================
    -- HOTEL 3: MARINA BAY
    -- ============================================================
    INSERT INTO hoteles (slug, nombre_comercial, razon_social, nro_ruc, correo_contacto, codigo_ubigeo, moneda_base)
    VALUES ('hotel-marina', 'Hotel Marina Bay', 'Marina Bay Resorts S.A.C.', '20888777666', 'gerencia@hotelmarina.com', '150101', 'PEN')
    RETURNING id INTO v_hotel3_id;

    INSERT INTO configuracion_marca (hotel_id, color_primario, color_secundario, url_logo, fuente_familia)
    VALUES (v_hotel3_id, '#065F46', '#F59E0B', 'https://cdn.omnihotel.com/logos/marina.png', 'Inter');

    -- Usuarios (3 por hotel)
    INSERT INTO usuarios (hotel_id, email, password_hash, nombre_completo, rol)
    VALUES (v_hotel3_id, 'admin@hotelmarina.com', crypt('password123', gen_salt('bf')), 'Administrador Maestro Marina', 'ADMIN_HOTEL')
    RETURNING id INTO v_admin3_id;

    INSERT INTO usuarios (hotel_id, email, password_hash, nombre_completo, rol)
    VALUES (v_hotel3_id, 'recepcion@hotelmarina.com', crypt('recep123', gen_salt('bf')), 'Sofía Recepcionista Marina', 'RECEPCIONISTA')
    RETURNING id INTO v_recep3_id;

    INSERT INTO usuarios (hotel_id, email, password_hash, nombre_completo, rol)
    VALUES (v_hotel3_id, 'housekeeping@hotelmarina.com', crypt('clean123', gen_salt('bf')), 'Miguel Limpieza Marina', 'HOUSEKEEPING')
    RETURNING id INTO v_house3_id;

    -- Infraestructura, Huéspedes, Reservas
    INSERT INTO categorias_habitacion (hotel_id, nombre, precio_base, capacidad_adultos, capacidad_ninos)
    VALUES (v_hotel3_id, 'Suite Presidencial Vista al Mar', 600.00, 3, 2)
    RETURNING id INTO v_cat3_id;

    INSERT INTO habitaciones (hotel_id, categoria_id, nro_habitacion, piso, estado)
    VALUES (v_hotel3_id, v_cat3_id, '401', 4, 'DISPONIBLE')
    RETURNING id INTO v_hab3_401_id;

    INSERT INTO habitaciones (hotel_id, categoria_id, nro_habitacion, piso, estado)
    VALUES (v_hotel3_id, v_cat3_id, '402', 4, 'MANTENIMIENTO');

    INSERT INTO huespedes (hotel_id, tipo_doc, nro_doc, nombres, apellidos, email, codigo_iso_pais)
    VALUES (v_hotel3_id, 'DNI', '77889900', 'María Carmen', 'Gonzáles Rivas', 'carmen.rivas@email.com', 'ES')
    RETURNING id INTO v_huesped3_id;

    INSERT INTO reservas (hotel_id, huesped_id, habitacion_id, fecha_ingreso, fecha_salida, estado, origen, total_estimado, creado_by)
    VALUES (v_hotel3_id, v_huesped3_id, v_hab3_401_id, CURRENT_DATE, CURRENT_DATE + 4, 'CONFIRMADA', 'DIRECTO', 2400.00, v_recep3_id)
    RETURNING id INTO v_reserva3_id;

    -- Caja y folio
    INSERT INTO turnos_caja (hotel_id, usuario_id, monto_apertura)
    VALUES (v_hotel3_id, v_recep3_id, 300.00)
    RETURNING id INTO v_caja3_id;

    INSERT INTO folios (reserva_id)
    VALUES (v_reserva3_id)
    RETURNING id INTO v_folio3_id;

    INSERT INTO transacciones_folio (folio_id, tipo, monto, descripcion, usuario_id, turno_caja_id)
    VALUES (v_folio3_id, 'CARGO', 600.00, 'Alojamiento Noche 1 - Hab 401', v_recep3_id, v_caja3_id);

    RAISE NOTICE 'Seed finalizado: 3 Hoteles y sus respectivos 3 usuarios configurados exitosamente.';
END $$;