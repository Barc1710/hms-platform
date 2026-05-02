# 🗺️ Roadmap Full-Stack: 30 Días para el MVP (2 Devs)

Este plan aplica la técnica de **Vertical Slicing**. Cada desarrollador es responsable del flujo completo (`SQL -> API -> UI`) de su módulo asignado para evitar dependencias.

---

## 📅 SEMANA 1: Identidad SaaS y Acceso
**Objetivo:** El sistema puede identificar hoteles y permitir el ingreso del personal.

| Día | 👨‍💻 Dev A (Módulo Hoteles & Marca) | 👨‍💻 Dev B (Módulo IAM & Personal) |
| :--- | :--- | :--- |
| **01** | **Backend:** `SqlHotelRepository` + Interceptor de resolución por slug.<br>**Frontend:** Layout base con inyección de variables CSS (`--primary`). | **Backend:** Módulo de Autenticación con JWT + Hashing de contraseñas.<br>**Frontend:** Pantalla de Login dinámica. |
| **02** | **Backend:** CRUD de `configuracion_marca`.<br>**Frontend:** Formulario de personalización de marca (colores y logo). | **Backend:** `SqlUsuarioRepository` (CRUD de personal filtrado por hotel).<br>**Frontend:** Tabla de gestión de staff (Admin). |
| **03** | **Backend:** Endpoint de Onboarding (Transacción SQL Hotel+Marca).<br>**Frontend:** Flujo de registro de nuevo hotel. | **Backend:** Middleware de RBAC (Control de acceso por roles).<br>**Frontend:** Protección de rutas y persistencia de sesión. |
| **04** | **Backend:** API de Catálogo de Países.<br>**Frontend:** Selectores de nacionalidad para huéspedes. | **Backend:** Logs de auditoría base para acciones de personal.<br>**Frontend:** Perfil de usuario (Staff). |
| **05** | **Integración:** Pruebas de "Cross-tenant" (Validar que el Hotel A no vea la marca del Hotel B). | **Integración:** Pruebas de Roles (Validar que el recepcionista no vea gestión de staff). |

---

## 📅 SEMANA 2: Infraestructura e Inventario
**Objetivo:** Configurar físicamente el hotel (Habitaciones y Precios).

| Día | 👨‍💻 Dev A (Categorías y Tarifas) | 👨‍💻 Dev B (Habitaciones y Limpieza) |
| :--- | :--- | :--- |
| **06** | **Backend:** CRUD `categorias_habitacion` (SQL Puro).<br>**Frontend:** Gestión de tipos (Suite, Doble) con precios base. | **Backend:** CRUD habitaciones (SQL JOIN con categorías).<br>**Frontend:** Lista de inventario físico por piso. |
| **07** | **Backend:** Lógica de validación de precios negativos y capacidades.<br>**Frontend:** UI de configuración de amenidades. | **Backend:** API de cambio de estado (`PATCH /habitaciones/estado`).<br>**Frontend:** Vista de "Rack de Limpieza" para Housekeeping. |
| **08** | **Backend:** API de Ubigeo (Carga de Dpto/Prov/Dist).<br>**Frontend:** Selectores dinámicos de dirección fiscal. | **Backend:** Validación SQL: no borrar habitación con reserva activa.<br>**Frontend:** Filtros avanzados de inventario. |
| **09** | **Full-stack:** Reporte básico de inventario (cuántas suites hay, etc). | **Full-stack:** Vista móvil optimizada para personal de mantenimiento. |
| **10** | **Estabilización:** Revisión de índices SQL para búsquedas de habitaciones. | **Estabilización:** Manejo de errores de Postgres en el frontend (Toasts). |

---

## 📅 SEMANA 3: CRM y Motor de Reservas (Core)
**Objetivo:** El flujo de venta de noches de principio a fin.

| Día | 👨‍💻 Dev A (Huéspedes & Portal Web) | 👨‍💻 Dev B (Reservas Internas & Rack) |
| :--- | :--- | :--- |
| **11** | **Backend:** `SqlHuespedRepository` (Búsqueda por DNI/RUC).<br>**Frontend:** Formulario rápido de creación de huéspedes. | **Backend:** Lógica de traslape SQL (`OVERLAPS`) para disponibilidad.<br>**Frontend:** Calendario interactivo (Rack de Reservas). |
| **12** | **Backend:** API pública de disponibilidad por slug.<br>**Frontend:** Landing page del hotel (Motor de reservas público). | **Backend:** Transacción SQL: Crear Reserva + Crear Folio.<br>**Frontend:** Flujo de reserva manual (recepción). |
| **13** | **Backend:** Validación de nacionalidad para exoneración de IGV.<br>**Frontend:** Checkout del portal web (Datos del cliente). | **Backend:** CRUD de estados de reserva (Pendiente, Confirmada).<br>**Frontend:** Modal de detalle de reserva y edición rápida. |
| **14** | **Backend:** Generación de ID de confirmación único.<br>**Frontend:** Vista de "Mis Reservas" para el huésped. | **Backend:** Lógica de asignación de habitación automática.<br>**Frontend:** Drag & Drop en el rack para mover reservas. |
| **15** | **Pruebas:** Flujo completo de reserva desde la web pública. | **Pruebas:** Flujo completo de Check-in (Cambio reserva -> Check-in). |

---

## 📅 SEMANA 4: Finanzas, Caja y Liquidación
**Objetivo:** Control de dinero inmutable y Check-out.

| Día | 👨‍💻 Dev A (Caja y Turnos) | 👨‍💻 Dev B (Folio y Transacciones) |
| :--- | :--- | :--- |
| **16** | **Backend:** API `turnos_caja` (Apertura con monto inicial).<br>**Frontend:** Interfaz de "Abrir Caja". | **Backend:** API `transacciones_folio` (Cargos de alojamiento).<br>**Frontend:** Vista de cuenta corriente de la reserva. |
| **17** | **Backend:** Cierre de caja (Conciliación de montos).<br>**Frontend:** Reporte de cierre ciego para el recepcionista. | **Backend:** Lógica de pagos (Abonos) con método de pago.<br>**Frontend:** Formulario de cobro (Visa, Efectivo, etc). |
| **18** | **Backend:** Registro de movimientos extra de caja (gastos).<br>**Frontend:** Panel de control de flujo de efectivo. | **Backend:** Proceso de Check-out (Validación Saldo 0).<br>**Frontend:** Generación de resumen de liquidación (Pre-factura). |
| **19** | **Full-stack:** Dashboard financiero (Ventas del día vs Cobros). | **Full-stack:** Implementación de Transacciones de Reverso (Corrección). |
| **20** | **Final:** Optimización final de queries y auditoría de seguridad. | 🏁 **MVP LISTO.** |

---

## 🎨 Final: Pulido de UI, Skeletons y UX general.

🚀 **MVP LISTO PARA PRODUCCIÓN.**

---

## 📜 REGLAS DE ORO PARA EL DÍA A DÍA

- 🛠️ **Propiedad de la Rebanada:** Si el Dev B está haciendo "Reservas", él crea la tabla (si falta), el repositorio SQL, el Use Case y la pantalla. No espera a nadie.
- 🔌 **Interfaces Primero:** Antes de codificar la lógica, define la interface del Dominio y compártela.
- 🔒 **Filtro de Inquilino:** Es pecado capital subir un SQL que no tenga `WHERE hotel_id = ...`.
- 💬 **Commits en Español:** `feat(habitaciones): implementar cambio de estado a sucia`.

