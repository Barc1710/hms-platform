# 📋 Documento de Requerimientos del Producto (PRD): HMS OmniHotel

| Información | Detalle |
| :--- | :--- |
| **📌 Estado** | Versión 2.1 (Actualizado: No-ORM / SQL Nativo) |
| **🎯 Enfoque** | SaaS Multi-tenant / Marca Blanca (White Label) |
| **🛠️ Stack Técnico** | NestJS, Node.js v24, `postgres.js`, PostgreSQL 16 |
| **📍 Localización** | Perú (IGV 18%, PEN, UBIGEO, Exoneraciones de Ley) |

---

## 📑 Tabla de Contenidos
1. [Visión General](#1-visión-general)
2. [Requerimientos Funcionales (FR)](#2-requerimientos-funcionales-fr---detallado)
3. [Requerimientos No Funcionales (NFR)](#3-requerimientos-no-funcionales-nfr)
4. [Casos de Uso Críticos](#4-casos-uso-críticos-implementación-sql-puro)
5. [Reglas de Negocio](#5-reglas-de-negocio-y-buenas-prácticas-de-datos)

---

## 1. 🌟 Visión General

**HMS OmniHotel** es una plataforma de gestión hotelera (PMS) de alto rendimiento diseñada bajo el modelo SaaS. A diferencia de soluciones convencionales, OmniHotel utiliza un motor de persistencia de acceso directo a datos (**No-ORM**) mediante el driver `postgres.js`. Esto garantiza latencias mínimas, ejecución de consultas optimizadas a nivel de kernel y un control absoluto sobre el aislamiento de inquilinos (**Multi-tenancy**), permitiendo que cada hotel gestione su identidad visual (**White Label**) y fiscal de forma independiente y segura.

---

## 2. 🚀 Requerimientos Funcionales (FR) - Detallado

### 🏢 Módulo 1: Arquitectura SaaS y Multi-tenancy (Core)
- **FR-1.1: Onboarding de Tenants:** Registro automatizado de hoteles con validación de UBIGEO y generación de slug único para acceso web.
- **FR-1.2: Aislamiento de Datos por Sentencia:** Implementación obligatoria del filtro `tenant_id` en cada consulta SQL a través del patrón Repositorio, eliminando cualquier riesgo de fuga de datos entre hoteles.
- **FR-1.3: Ciclo de Vida del Inquilino:** Gestión de estados operativos (Activo, Suspendido por pago, Demo, Archivado).
- **FR-1.4: Motor de Marca Blanca (White Label):** Almacenamiento y recuperación dinámica de configuración visual (paleta HEX, logotipos, tipografías) inyectada en el frontend según el inquilino resuelto.
- **FR-1.5: Localización Fiscal Peruana:** Soporte para IGV (18%) con lógica de exoneración configurable por ítem o por tipo de huésped (Exoneración a extranjeros).

### 🔐 Módulo 2: Gestión de Personal y Seguridad (IAM)
- **FR-2.1: Autenticación Basada en Contexto:** Login centralizado que vincula al usuario con un `tenant_id` específico desde el handshake inicial.
- **FR-2.2: Control de Acceso (RBAC):** Definición de permisos granulares para roles: SuperAdmin SaaS, Administrador de Hotel, Recepcionista, Housekeeping.
- **FR-2.3: Auditoría Transaccional Nativa:** Registro manual de auditoría en tablas dedicadas para cada operación de escritura, garantizando trazabilidad sin depender de triggers ocultos.

### 🛌 Módulo 3: Infraestructura y Configuración Hotelera
- **FR-3.1: Modelado Físico:** Estructura jerárquica de Sedes, Bloques, Pisos y Habitaciones físicas.
- **FR-3.2: Gestión de Inventario:** Definición de categorías de habitación con capacidad de ocupación y estados de mantenimiento (Disponible, Ocupada, Sucia, Bloqueada).
- **FR-3.3: Catálogo de Servicios:** Gestión de amenidades y servicios extra (frigobar, lavandería, etc.).

### 📅 Módulo 4: Tarifario y Motor de Reservas
- **FR-4.1: Tarifas Dinámicas:** Gestión de precios base y reglas de sobrecosto por temporadas altas o feriados nacionales.
- **FR-4.2: Rack de Reservas Interactivo:** Interfaz visual para gestión de ocupación (Gantt) con validación de colisiones directamente en PostgreSQL.
- **FR-4.3: Portal Público de Reservas:** Motor orientado al cliente final con disponibilidad en tiempo real reflejada al milisegundo.

### 💰 Módulo 5: Operaciones y Finanzas
- **FR-5.1: Front Desk (Check-in/out):** Registro de huéspedes con captura de datos para SUNAT y liquidación de folios electrónicos.
- **FR-5.2: Control de Caja (Shift Management):** Gestión de turnos de recepcionistas con cierres de caja ciegos y justificación de discrepancias.

---

## ⚡ 3. Requerimientos No Funcionales (NFR)

- **🚀 NFR-1 (Rendimiento):** Latencia de respuesta de API < 150ms en el 95% de las peticiones gracias al driver `postgres.js`.
- **🛡️ NFR-2 (Seguridad):** Protección intrínseca contra SQL Injection mediante el uso mandatorio de *Tagged Templates* proporcionadas por el driver de conexión.
- **📦 NFR-3 (Eficiencia):** Despliegue de backend ligero (< 200MB en imagen Docker) al eliminar dependencias de motores de consulta binarios pesados.
- **📈 NFR-4 (Escalabilidad):** Pool de conexiones optimizado y gestionado centralizadamente para soportar picos de concurrencia.
- **🛠️ NFR-5 (Mantenibilidad):** Aplicación estricta de Arquitectura Hexagonal, desacoplando la lógica de negocio del driver de base de datos.

---

## 🧪 4. Casos de Uso Críticos (Implementación SQL Puro)

| ID | Caso de Uso | Actor | Lógica de Datos Relevante |
| :--- | :--- | :--- | :--- |
| **UC-01** | Cambio de Habitación | Recepcionista | Transacción SQL atómica: actualiza estado de 2 habitaciones y reasigna cargos en folios. |
| **UC-02** | Resolución de Tenant | Sistema | Middleware que intercepta el header `x-tenant-slug` y valida existencia en tabla `tenants`. |
| **UC-03** | Cierre de Caja | Recepcionista | Query agregado con `SUM()` y `GROUP BY` para conciliación de movimientos por método de pago. |
| **UC-04** | Bloqueo por Mantenimiento | Staff | Actualización de estado con validación de no-existencia de reservas futuras activas. |

---

## 💎 5. Reglas de Negocio y Buenas Prácticas de Datos

> [!CAUTION]
> **Prohibición de SELECT *:** Es obligatorio especificar cada columna requerida en los repositorios para minimizar el uso de memoria y ancho de banda.

> [!IMPORTANT]
> **Inmutabilidad Financiera:** Los registros de pago y cargos no se eliminan ni editan. Cualquier corrección debe realizarse mediante una transacción de anulación/reverso.

- **🛡️ Aislamiento de Infraestructura:** La capa de Dominio no debe conocer a `postgres.js`. Toda interacción se realiza mediante interfaces (`ITenantRepository`, `IUserRepository`).
- **📍 Normalización de Ubigeo:** Se utilizará el estándar de 6 dígitos para departamentos, provincias y distritos para compatibilidad futura con facturación electrónica.
- **🔌 Gestión de Pool de Conexiones:** El pool de base de datos es compartido y centralizado en un `DatabaseService` global para evitar el agotamiento de sockets en PostgreSQL.
- **🏷️ Tipado Estricto de Resultados:** Cada respuesta de base de datos debe ser mapeada a una interfaz de TypeScript para asegurar la integridad de tipos en toda la aplicación.
ada a una interfaz de TypeScript para asegurar la integridad de tipos en toda la aplicación.
