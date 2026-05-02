# 🗄️ Modelo de Datos Lógico: HMS OmniHotel

Este documento detalla la estructura lógica de la base de datos PostgreSQL, diseñada para un entorno **SaaS Multi-tenant** de alto rendimiento, utilizando acceso directo a datos (**No-ORM**) y Arquitectura Hexagonal.

---

## 🔒 1. Estrategia de Multi-tenancy (Aislamiento Lógico)

Para maximizar el rendimiento y minimizar los costos de infraestructura, utilizamos el modelo de **Shared Schema / Shared Database**:

- **🆔 Identificador Global:** El campo `tenant_id` (UUID) es mandatorio en todas las tablas operativas (`usuarios`, `habitaciones`, `reservas`, `folios`, etc.).
- **🛡️ Cumplimiento Manual:** Al no contar con un ORM, el aislamiento de datos se garantiza mediante el **Patrón Repositorio**, donde cada sentencia SQL incluye forzosamente la cláusula `WHERE tenant_id = $1`.
- **🚀 Optimización:** Se implementan índices compuestos obligatorios en las columnas (`tenant_id`, `id`) para asegurar búsquedas sub-milimétricas.

---

## 📐 2. Diagrama de Módulos y Entidades

### 🛡️ A. Módulo de Identidad y Núcleo (Core/IAM)
- **Tenants:** La raíz del sistema (datos fiscales, slug, estado).
- **Brand_Config:** Configuración White Label (colores, logos). Relación 1:1 con Tenants.
- **Users (Personal):** Credenciales de acceso vinculadas a un `tenant_id`.
- **Roles & Permissions:** Tabla de referencia para **RBAC**.

### 🛏️ B. Módulo de Infraestructura Hotelera (Inventario)
- **Blocks / Floors:** Organización física (Sedes, Torres, Pisos).
- **Room_Categories:** Tipos de habitación (Suite, Matrimonial) con precios base.
- **Rooms:** Unidades físicas (`room_number`, `status`).
- **Amenities:** Catálogo de servicios adicionales.

### 📍 C. Módulo de Localización (Perú Específico)
- **Ubigeo:** Catálogo estático de Departamentos, Provincias y Distritos (6 dígitos).
- **Countries:** Catálogo ISO para perfiles internacionales.

### 👥 D. Módulo de Operaciones (Huéspedes y Reservas)
- **Guests:** CRM de huéspedes (DNI/CE, nacionalidad).
- **Bookings:** El contrato de alojamiento (fechas, huéspedes, habitaciones).
- **Booking_Items:** Desglose de noches y cargos adicionales.

### 💰 E. Módulo Financiero (Caja y Folios)
- **Folios:** La cuenta corriente del huésped.
- **Transactions:** Registro inmutable de cargos o abonos.
- **Payments:** Métodos de pago (Efectivo, Visa, Transferencia).
- **Cash_Shifts:** Control de turnos de recepcionistas.

---

## 💎 3. Reglas de Integridad y Datos (No-ORM)

Al trabajar sin ORM, la base de datos es la **"primera línea de defensa"**:

> [!IMPORTANT]
> **Claves Foráneas (FK):** Se utilizan restricciones `FOREIGN KEY` con `ON DELETE RESTRICT` para evitar la eliminación accidental de registros vinculados.

> [!CAUTION]
> **Inmutabilidad Financiera:** Los registros en `transactions` y `payments` JAMÁS se editan. Los errores se corrigen con una nueva transacción negativa (Anulación).

- **🗑️ Soft Delete:** Se implementa la columna `deleted_at` para todas las entidades principales.
- **🏷️ Normalización:** `snake_case` en DB, `camelCase` en Backend.

---

## 📊 4. Tipos de Datos Estándar

| Dato | Tipo PostgreSQL | Razón Técnica |
| :--- | :--- | :--- |
| **Identificadores** | `UUID` | Seguridad contra predicción y facilidad de merge. |
| **Monedas** | `DECIMAL(12, 2)` | Precisión exacta para cálculos financieros e IGV. |
| **Fechas/Hora** | `TIMESTAMPTZ` | Manejo correcto de zonas horarias. |
| **Textos Largos** | `TEXT` | Optimizado sobre `varchar` en PostgreSQL. |
| **Banderas** | `BOOLEAN` | Simplicidad y ahorro de espacio. |

---

## 🚀 5. Mejores Prácticas de Consulta

1.  **Prohibido el SELECT *:** Los repositorios deben listar explícitamente las columnas necesarias.
2.  **Uso de Joins:** Se prefieren `JOIN` en SQL puro sobre múltiples consultas separadas.
3.  **Tipado en Dominio:** Cada tabla tiene una interfaz correspondiente en TypeScript en la capa de Dominio.

