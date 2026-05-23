# 📊 Reporte del Estado del Proyecto: HMS OmniHotel

Este documento detalla el análisis exhaustivo de los componentes actuales del proyecto, dividiendo el software desarrollado (Backend, Frontend y Base de Datos) de los requerimientos pendientes por implementar, estructurado por módulos de negocio.

---

## 🏗️ 1. Estructura General y Monorepo

### Desarrollado
*   **Gestor de Monorepo**: Configurado con **Turborepo** y **pnpm workspaces**.
*   **Paquete `@hms/ui`**: Sistema de diseño compartido completo en `packages/ui` equipado con **Shadcn/UI**, **Tailwind CSS** y componentes base de UI (Button, Input, Form, Card, Collapsible, Sidebar, etc.).
*   **Paquete `@hms/database`**: Conexor y driver nativo `postgres.js` con mapeo automático de `camelCase` configurado en `packages/database/src/index.ts`.

### Pendiente
*   **Paquete `@hms/config`**: Listado en la arquitectura teórica pero ausente en el monorepo. Actualmente, TSConfigs, ESLint y Prettier se configuran localmente en cada aplicación.
*   **Paquete `@hms/shared`**: Listado en la arquitectura para centralizar DTOs, interfaces de dominio comunes y validaciones compartidas, pero no existe físicamente en `packages/`.

---

## 🏨 2. Módulo de Tenant (Multi-tenant y Marca Blanca)

Gestiona la separación lógica de datos de los hoteles clientes y la inyección dinámica de branding.

### Desarrollado
*   **Base de Datos**: Tablas `hoteles` y `configuracion_marca` diseñadas en `init.sql` con indexación por `slug`.
*   **API (Backend)**:
    *   Módulo `tenant` completo con repositorio `SqlHotelRepository` para consultar configuraciones de marca por slug.
    *   [TenantInterceptor](file:///home/barc/projects/hms-platform/apps/api/src/common/interceptors/tenant.interceptor.ts): Interceptor global que extrae la cabecera `x-tenant-slug` y carga los datos del hotel correspondiente en la petición.
    *   [TenantGuard](file:///home/barc/projects/hms-platform/apps/api/src/common/guards/tenant.guard.ts): Guardia global que verifica que el `hotel_id` del usuario autenticado coincida con el hotel (tenant) de la petición activa.
*   **Admin (Frontend)**:
    *   [tenant-provider.tsx](file:///home/barc/projects/hms-platform/apps/admin/src/components/providers/tenant-provider.tsx): Proveedor que inyecta las variables CSS de marca (color primario, secundario, fuentes y logo) provistos por el backend en la interfaz del staff.
    *   **Resolución automática por Subdominio y Validación (Middleware/Proxy)**: Implementación de [proxy.ts](file:///home/barc/projects/hms-platform/apps/admin/src/proxy.ts) en el Admin Frontend para extraer dinámicamente el subdominio actual y compararlo con el `hotelId` o `slug` del token JWT (`hms_session`). Si no coinciden, redirige al usuario a `/login`. Admite un bypass de desarrollo mediante la variable `NEXT_PUBLIC_DEV_BYPASS_TENANT_MATCH`.

### Pendiente
*   **CRUD de Hoteles y Planes**: Falta un panel de administración "Super Admin" global de la plataforma para dar de alta nuevos hoteles (tenants) y modificar sus configuraciones visuales.

---

## 🔒 3. Módulo de Gestión de Accesos (IAM)

Controla el registro, autenticación, recuperación de contraseñas y permisos del staff del hotel.

### Desarrollado
*   **Base de Datos**: Tabla `usuarios` con roles restringidos por un Enum de Postgres y columnas integradas de tokens de recuperación de claves.
*   **API (Backend)**:
    *   Módulo `iam` con controladores y lógica de inicio de sesión (`login`) que devuelve un JWT firmado con el rol y `hotelId`.
    *   Flujos de recuperación de contraseñas (`forgot-password` con simulación por consola de link único y `reset-password` para aplicar la nueva contraseña).
    *   [SqlUsuarioRepository](file:///home/barc/projects/hms-platform/apps/api/src/modules/iam/infrastructure/persistence/sql-usuario.repository.ts) adaptado para persistir de forma segura en Postgres con passwords hasheados en `bcrypt`.
    *   **Autenticación y Protección de Rutas**: Implementación completa de `JwtAuthGuard` y la estrategia Passport `JwtStrategy` para validar tokens, corroborando a través de base de datos que el usuario exista y esté activo en su respectivo tenant (`hotel_id`), poblando el objeto `request.user`. Adicionalmente, se creó el decorador `@CurrentUser()`. Se corrigió el problema de ciclo de vida del constructor de la estrategia leyendo de forma segura las variables de entorno (`process.env.JWT_SECRET`) directamente en `super()`.
*   **Admin (Frontend)**:
    *   Páginas de [Login](file:///home/barc/projects/hms-platform/apps/admin/src/app/login/page.tsx), [Forgot Password](file:///home/barc/projects/hms-platform/apps/admin/src/app/forgot-password/page.tsx) y [Reset Password](file:///home/barc/projects/hms-platform/apps/admin/src/app/reset-password/page.tsx) completadas y enlazadas para consumir el backend central.

### Pendiente
*   **Gestión de Staff**: El Panel de Admin tiene un enlace en el menú lateral ("Gestión de Staff"), pero no se han creado las páginas ni los endpoints CRUD para crear, listar, modificar o desactivar cuentas de trabajadores del hotel.
*   **Roles y Permisos Granulares (RBAC)**: Validar a nivel API y Frontend si un usuario posee el rol adecuado para ejecutar ciertas acciones (ej. solo `ADMIN_HOTEL` abre cajas o altera tarifas; `HOUSEKEEPING` solo cambia estados de limpieza).

---

## 🛏️ 4. Módulo de Infraestructura Hotelera (Habitaciones y Limpieza)

Administración física del hotel: categorías de habitaciones, tarifas base y estados de limpieza/mantenimiento.

### Desarrollado
*   **Base de Datos**: Tablas `categorias_habitacion` y `habitaciones` definidas con estados de limpieza y ocupación.
*   **API (Backend)**: Módulo `rooms` completamente desarrollado bajo Arquitectura Hexagonal. Incluye los casos de uso y endpoints expuestos en [RoomsController](file:///home/barc/projects/hms-platform/apps/api/src/modules/rooms/infrastructure/http/rooms.controller.ts) para listar habitaciones por hotel y actualizar su estado. La persistencia se realiza mediante consultas SQL puras con `postgres.js` en [SqlRoomRepository](file:///home/barc/projects/hms-platform/apps/api/src/modules/rooms/infrastructure/persistence/sql-room.repository.ts), protegida mediante `JwtAuthGuard` y `TenantGuard` para aislamiento multi-tenant.

### Pendiente
*   **API (Backend)**: Endpoints administrativos CRUD de creación y edición para categorías de habitaciones y registro inicial de habitaciones físicas.
*   **Admin (Frontend)**: Cero desarrollado.
    *   Falta la sección `/dashboard/habitaciones` para que la recepción monitoree y cambie el estado de las habitaciones.
    *   Falta una vista simplificada móvil para que el staff de limpieza (Housekeeping) marque las habitaciones limpias o reporte incidencias.

---

## 📅 5. Módulo de Reservas y Huéspedes (CRM y Booking)

Core operativo: reserva de habitaciones, Check-In, Check-Out y ficha de clientes.

### Desarrollado
*   **Base de Datos**: Tablas `huespedes` y `reservas` con sus respectivas restricciones de fechas y llaves foráneas correspondientes.

### Pendiente
*   **API (Backend)**: Cero desarrollado. Se requiere programar:
    *   CRUD de Huéspedes (ficha del cliente, pasaporte, correo, teléfono).
    *   Motor de Reservas (verificación de disponibilidad en rangos de fechas, bloqueo temporal de habitación, cálculo de total estimado, creación y cancelación de reservas).
    *   Flujos de Check-In (cambio de estado de reserva y habitación a `OCUPADA`) y Check-Out (liberación de habitación y verificación de saldo en folio).
*   **Admin (Frontend)**:
    *   Falta la página `/dashboard/reservas` (el menú de operaciones del staff). Se requiere implementar una interfaz tipo **Rack de Reservas** (cuadrícula interactiva de habitaciones vs calendario) para arrastrar y soltar reservas y hacer Check-In rápido.
    *   Falta la sección `/dashboard/huespedes` para buscar y gestionar clientes.
*   **Web (Frontend - Portal Público)**:
    *   [page.tsx](file:///home/barc/projects/hms-platform/apps/web/src/app/page.tsx) es la plantilla por defecto de Next.js. **Falta todo el portal de cara al huésped**: visualización de habitaciones disponibles de acuerdo al hotel detectado, selección de fechas, simulación de costos y creación del formulario de reserva directa.

---

## 💰 6. Módulo Financiero y Caja (Folios y Transacciones)

Control de dinero, transacciones por habitación y arqueos de turnos en recepción.

### Desarrollado
*   **Base de Datos**: Tablas `turnos_caja` (apertura y cierre de caja chica), `folios` (estado de cuenta único de la reserva) y `transacciones_folio` (cargos por noche o abonos por pago).

### Pendiente
*   **API (Backend)**: Cero desarrollado. Es mandatorio escribir la lógica de:
    *   Apertura y Cierre de Turno de Caja (registro de monto inicial de dinero físico en recepción y validación de saldo al cerrar).
    *   Gestión de Folio: cada vez que se crea una reserva, se debe crear un folio automático.
    *   Transacciones: registrar cargos automáticos (cálculo nocturno de tarifa de alojamiento) o manuales (consumo de frigobar, servicios extra), y registrar abonos (pagos mediante efectivo, tarjeta).
    *   **Regla de Inmutabilidad**: Los cargos financieros no pueden ser editados o eliminados; se deben anular con otra transacción de ajuste inversa.
*   **Admin (Frontend)**:
    *   Falta la sección `/dashboard/finanzas` para realizar la apertura/cierre de turnos de caja chica.
    *   Falta la interfaz de Folio dentro de cada detalle de reserva para cobrar, emitir estado de cuenta e imprimir comprobantes.

---

## 📊 7. Módulo de Estadísticas y Auditoría

### Desarrollado
*   **Base de Datos**: Tabla `logs_auditoria` lista para recibir logs.

### Pendiente
*   **API (Backend)**:
    *   Falta conectar los triggers de auditoría o configurar interceptores de NestJS a nivel de infraestructura para capturar cambios en tablas críticas (`usuarios`, `reservas`, `transacciones_folio`) y alimentar la tabla de auditoría.
    *   Endpoints de estadísticas (ingresos diarios, tasa de ocupación, habitaciones en limpieza).
*   **Admin (Frontend)**:
    *   [stats/page.tsx](file:///home/barc/projects/hms-platform/apps/admin/src/app/stats) está vacío. Falta diseñar un dashboard gerencial con gráficas de ocupación, ingresos y reportes de caja.

---

## 🗺️ Resumen de Ficheros Críticos de Estado

| Componente | Fichero | Estado Actual | Objetivo Pendiente |
| :--- | :--- | :--- | :--- |
| **API** | `src/modules/*` | Solo `iam` y `tenant` | Crear módulos: `habitaciones`, `reservas`, `finanzas`, `huespedes` |
| **Admin** | `src/app/dashboard/page.tsx` | Placeholder vacío | Implementar vista consolidada de ocupación y tareas diarias |
| **Admin** | `src/app/dashboard/reservas/` | No existe | Crear interfaz de Rack de Reservas interactivo |
| **Web** | `src/app/page.tsx` | Plantilla Next.js por defecto | Crear portal de reservas responsive con marca blanca dinámica |
