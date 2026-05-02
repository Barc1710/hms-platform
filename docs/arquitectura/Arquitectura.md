# 📐 Documento de Diseño de Arquitectura (SAD): HMS OmniHotel

| Información | Detalle |
| :--- | :--- |
| **🏗️ Arquitectura** | Hexagonal (Puertos y Adaptadores) + Monorepo (Turborepo) |
| **🗄️ Persistencia** | No-ORM (SQL Puro con `postgres.js`) |
| **🛠️ Stack Principal** | NestJS, Next.js, PostgreSQL 16, Redis, pnpm |
| **📌 Estado** | Versión 2.1 (Definición Técnica Maestra) |

---

## 📑 Tabla de Contenidos
1. [Estructura del Monorepo (Ecosistema)](#1-estructura-del-monorepo-ecosistema)
2. [Arquitectura Hexagonal (Capa a Capa)](#2-arquitectura-hexagonal-capa-a-capa)
3. [Patrón de Comunicación y Flujo No-ORM](#3-patrón-de-comunicación-y-flujo-no-orm)
4. [Estrategia Multi-tenant & White Label](#4-estrategia-multi-tenant--white-label)
5. [Estándares de Integridad y Código](#5-estándares-de-integridad-y-código)
6. [Guía para Desarrollo con IA (Prompt Guard)](#6-guía-para-desarrollo-con-ia-prompt-guard)
7. [Estrategia de Base de Datos y Migraciones](#7-estrategia-de-base-de-datos-y-migraciones)

---

## 1. 📂 Estructura del Monorepo (Ecosistema)

Utilizamos **Turborepo** para gestionar las aplicaciones y la lógica compartida. La eliminación de capas intermedias (como ORMs) permite que los paquetes sean más ligeros y fáciles de vincular.

```text
/hms-platform
├── 📱 apps/
│   ├── 🛠️ api/      # Backend Central (NestJS - El Cerebro)
│   ├── 👨‍💼 admin/    # Panel ERP (Next.js - Gestión del Staff)
│   └── 🌐 web/      # Portal Público (Next.js - Motor de Reservas)
├── 📦 packages/
│   ├── 🗃️ database/ # Driver postgres.js, Conexión y SQL Schema
│   ├── 🎨 ui/       # Librería de componentes (Shadcn/UI + Tailwind)
│   ├── ⚙️ config/   # Shared ESLint, Prettier y TSConfigs
│   └── 🧩 shared/   # Interfaces de Dominio, DTOs y utilitarios
├── 🐳 docker/       # Infraestructura (Postgres, Redis, pgAdmin)
└── 🚀 turbo.json    # Pipeline de construcción y caché
```

---

## 2. 🏗️ Arquitectura Hexagonal (Capa a Capa)

Dentro de `apps/api`, cada módulo funcional (ej. *tenants*, *rooms*) se organiza en tres capas concéntricas para garantizar que el negocio sea independiente de la tecnología.

### 🛡️ 2.1 Capa de Dominio (Core)
**Ubicación:** `src/modules/[module]/domain/`

- **Entities:** Interfaces o clases de TypeScript que representan el modelo de negocio (ej. `Tenant`, `Booking`).
- **Repository Interfaces:** Contratos (Puertos) que definen qué datos se requieren, sin mencionar SQL (ej. `ITenantRepository`).
- **Domain Exceptions:** Errores específicos del negocio.

> [!IMPORTANT]
> **Regla de Oro:** 0 dependencias externas. No importa a `postgres.js` ni a NestJS.

### ⚙️ 2.2 Capa de Aplicación (Casos de Uso)
**Ubicación:** `src/modules/[module]/application/`

- **Use Cases:** Orquestadores de la lógica (ej. `CheckInGuestUseCase`).
- **DTOs:** Objetos de entrada y salida para las peticiones.

> [!IMPORTANT]
> **Regla de Oro:** Llama a los repositorios solo a través de sus interfaces de dominio.

### 🔌 2.3 Capa de Infraestructura (Adaptadores)
**Ubicación:** `src/modules/[module]/infrastructure/`

- **Controllers:** Puntos de entrada HTTP (NestJS).
- **Persistence (SQL):** Implementaciones reales de los repositorios usando SQL Puro.
- **Mappers:** Funciones que convierten las filas de la base de datos (Raw Rows) en Entidades de Dominio.

> [!IMPORTANT]
> **Regla de Oro:** Aquí vive el SQL. Es la única capa que conoce al driver `postgres.js`.

---

## 3. 🔄 Patrón de Comunicación y Flujo No-ORM

1.  **Request:** El cliente envía un Header `x-tenant-slug`.
2.  **Interceptor:** Un Interceptor global valida el slug contra la tabla `tenants` usando el driver nativo.
3.  **UseCase:** Se ejecuta la lógica de negocio.
4.  **Repository (SQL):** Se ejecuta una sentencia SQL optimizada:

```sql
SELECT id, name FROM rooms 
WHERE tenant_id = ${tenantId} AND status = 'CLEAN'
```

5.  **Transform:** El driver transforma automáticamente `snake_case` de la DB a `camelCase` para el código.

---

## 4. 🏢 Estrategia Multi-tenant & White Label

### 🔒 4.1 Aislamiento Lógico Estricto
Al no tener un ORM que filtre datos automáticamente, la seguridad recae en el **Patrón Repositorio**:
- Toda consulta `SELECT`, `UPDATE` o `DELETE` debe incluir el parámetro `tenant_id`.
- Se prohíbe el uso de variables globales de base de datos; el `tenant_id` se pasa explícitamente desde el controlador al caso de uso.

### 🎨 4.2 Motor de White Label
El frontend consume un endpoint `GET /auth/config` que devuelve la configuración de `brand_config` (colores, logo). Estos valores se aplican dinámicamente mediante CSS Variables (`--primary-color`).

---

## 💎 5. Estándares de Integridad y Código

- **🚀 Prohibición de SELECT *:** Por rendimiento y seguridad, se deben listar las columnas explícitamente en cada query.
- **🛡️ Tipado de Consultas:** Cada query de `postgres.js` debe ser tipado usando las interfaces de la capa de dominio:
  ```typescript
  const [user] = await sql<User[]>... 
  ```
- **📜 Inmutabilidad:** Las tablas financieras no permiten `UPDATE`. Los errores se corrigen con registros de anulación (Reverse Transactions).
- **🏷️ Naming:**
    - **DB:** `snake_case` (estándar Postgres).
    - **Código:** `camelCase` (estándar TS).
    - **Archivos:** `kebab-case.ts`.

---

## 🤖 6. Guía para Desarrollo con IA (Prompt Guard)

Cuando utilices una IA para generar código en este proyecto, usa este contexto:

> [!NOTE]
> "Genera un componente siguiendo Arquitectura Hexagonal para HMS OmniHotel.
> El motor de base de datos es SQL Puro con el driver postgres.js.
> No uses Prisma ni otros ORMs.
> Especifica las columnas en los SELECT (no uses *).
> Asegura que el filtro por tenant_id esté presente en el WHERE.
> La lógica de negocio va en 'Application' y el SQL en 'Infrastructure/Persistence'."

---

## 🗄️ 7. Estrategia de Base de Datos y Migraciones

- **🔌 Centralización:** El pool de conexiones se maneja en el paquete `@hms/database`.
- **📐 Esquema:** Los archivos `.sql` de definición viven en `packages/database/sql/`.
- **📈 Evolución:** Las migraciones se gestionan mediante scripts manuales o herramientas ligeras de ejecución de SQL para mantener la transparencia total del esquema.
iones se gestionan mediante scripts manuales o herramientas ligeras de ejecución de SQL para mantener la transparencia total del esquema.
