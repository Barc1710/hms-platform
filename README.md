# 🏨 HMS OmniHotel: SaaS de Gestión Hotelera de Alto Rendimiento

[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%2B%20NestJS%20%2B%20PostgreSQL-blue)](https://github.com/barc/hms-platform)
[![Architecture](https://img.shields.io/badge/Architecture-Hexagonal-orange)](docs/arquitectura/Arquitectura.md)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#)

**OmniHotel** es una plataforma *Property Management System* (PMS) de nivel empresarial diseñada bajo un modelo **SaaS Multi-tenant** y **Marca Blanca** (White Label). El sistema está optimizado para ofrecer una latencia mínima y un aislamiento de datos estricto, utilizando acceso directo a base de datos sin capas de abstracción pesadas (No-ORM).

---

## 🎯 Visión Técnica

A diferencia de las soluciones tradicionales, OmniHotel prioriza el **control total** sobre la persistencia y el rendimiento. La arquitectura está blindada mediante el patrón de **Arquitectura Hexagonal**, separando las reglas de negocio de las decisiones tecnológicas.

## 🛠️ Stack Tecnológico Principal

- **📦 Monorepo:** [Turborepo](https://turbo.build/) con `pnpm`.
- **🚀 Backend:** [NestJS](https://nestjs.com/) (Node.js v24).
- **🎨 Frontend:** [Next.js](https://nextjs.org/) + [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/).
- **🗄️ Persistencia:** [PostgreSQL 16](https://www.postgresql.org/) con el driver nativo `postgres.js`.
- **⚡ Caché:** [Redis](https://redis.io/) para resolución de Tenant Routing.
- **🐳 Infraestructura:** [Docker](https://www.docker.com/) & Docker Compose.

---

## 📂 Estructura del Proyecto

El monorepo organiza el código en aplicaciones ejecutables y paquetes de lógica compartida:

```text
/hms-platform
├── 📱 apps/
│   ├── 🛠️ api/      # Backend Central (Arquitectura Hexagonal)
│   ├── 👨‍💼 admin/    # Panel ERP para Staff del Hotel (Next.js)
│   └── 🌐 web/      # Portal Público de Reservas (Next.js)
├── 📦 packages/
│   ├── 🗃️ database/ # Conexión nativa, Esquemas SQL y Migraciones
│   ├── 🎨 ui/       # Sistema de Diseño White Label compartido
│   ├── ⚙️ config/   # Configuraciones de TS, ESLint y Prettier
│   └── 🧩 shared/   # Entidades de Dominio, DTOs y Utilidades
├── 📑 docs/         # Documentación técnica maestra (PRD, SAD, Roadmap)
└── 🐳 docker/       # Orquestación de servicios de infraestructura
```

---

## 🏗️ Arquitectura de Software

El sistema implementa una **Arquitectura Hexagonal** (Puertos y Adaptadores) para garantizar la mantenibilidad a largo plazo:

*   **🛡️ Dominio (Domain):** Contiene las entidades puras y las interfaces de los repositorios. Cero dependencias externas.
*   **⚙️ Aplicación (Application):** Orquestación de Casos de Uso (ej. `RealizarReserva`, `AbrirCaja`).
*   **🔌 Infraestructura (Infrastructure):** Adaptadores de entrada (Controladores REST) y salida (Implementaciones SQL con `postgres.js`).

### 🔒 Aislamiento Multi-tenant

El sistema utiliza un esquema de **Aislamiento Lógico**. Cada sentencia SQL ejecutada en la capa de infraestructura incluye obligatoriamente un filtro por `hotel_id` resuelto mediante un **Interceptor global** que procesa el contexto del inquilino (Tenant).

---

## 🚀 Preparación del Entorno

### 📋 Requisitos Previos

- ✅ **Node.js v24** o superior.
- ✅ **pnpm v9** o superior.
- ✅ **Docker & Docker Compose** (WSL2 recomendado para Windows).

### 🔧 Instalación y Arranque

1.  **Clonar el repositorio e instalar dependencias:**
    ```bash
    pnpm install
    ```

2.  **Levantar infraestructura de base de datos:**
    ```bash
    docker compose up -d
    ```

3.  **Configuración de entorno:**
    > [!TIP]
    > Cree un archivo `.env` en la raíz del proyecto basado en el archivo `.env.example`.

4.  **Ejecutar el API en modo desarrollo:**
    ```bash
    pnpm --filter api dev
    ```

---
### 🏎️ Ejecución Completa

Para inciar todas las aplicaciones simultáneamente.

```bash
    pnpm turbo dev
```
1. **Ejecución por Componentes**

    | Aplicación     | Comando de Arranque           | URL de Acceso        |
    |----------------|------------------------------|----------------------|
    | API (Backend)  | pnpm --filter api dev        | http://localhost:3000 |
    | Panel Admin    | pnpm --filter admin dev      | http://localhost:3001 |
    | Portal Web     | pnpm --filter web dev        | http://localhost:3002 |

## 📖 Documentación

Para una comprensión profunda de los procesos y reglas de negocio, consulte la carpeta `/docs`:

- 📋 [Requerimientos del Producto (PRD)](docs/negocio/Requerimientos.md)
- 📐 [Diseño de Arquitectura (SAD)](docs/arquitectura/Arquitectura.md)
- 🗺️ [Mapeo de API y SQL](docs/arquitectura/MapeoAPI.md)
- 📊 [Modelo de Datos Lógico](docs/arquitectura/ModeloDatos.md)
- 📘 [Guía Operativa y Metodología](docs/operativa/GuiaOperativaGIT.md)
- 🗓️ [Roadmap de Ejecución](docs/negocio/Roadmap.md)

---

## 🤝 Estándares de Colaboración

*   **💬 Commits:** Se sigue la convención [Conventional Commits](https://www.conventionalcommits.org/).
*   **🌿 Git Flow:** Ramas `feature/[modulo]-[descripcion]` con merge obligatorio mediante Pull Request a `develop`.
*   **💎 Calidad:** Prohibido el uso de `any` en TypeScript y `SELECT *` en SQL. Cada consulta debe listar sus columnas explícitamente por rendimiento.

