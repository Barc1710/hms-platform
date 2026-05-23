# 📐 Documento Maestro de Arquitectura (SAD): HMS OmniHotel

| Información | Detalle |
| :--- | :--- |
| **🏗️ Arquitectura** | Hexagonal (Puertos y Adaptadores) + Monorepo (Turborepo) |
| **🗄️ Persistencia** | No-ORM (SQL Puro con `postgres.js`) |
| **🛠️ Stack Principal** | NestJS, Next.js, PostgreSQL 16, Redis, pnpm |
| **📌 Estado** | Versión 2.0 (Definición Técnica Maestra) |

## 1. 📂 Estructura del Monorepo (Ecosistema)
Utilizamos **Turborepo** para gestionar las aplicaciones. La eliminación de capas intermedias (como ORMs) permite que los paquetes sean más ligeros y fáciles de vincular.

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
```

## 2. 🏗️ Arquitectura Hexagonal (Capa a Capa)
Cada módulo funcional (ej. *tenants*, *rooms*) en `apps/api` se organiza en tres capas concéntricas:

- **Capa de Dominio (`domain/`)**: Entidades e Interfaces de Repositorio. **0 dependencias externas**.
- **Capa de Aplicación (`application/`)**: Casos de uso (Use Cases) y DTOs.
- **Capa de Infraestructura (`infrastructure/`)**: Controladores NestJS y persistencia con `postgres.js` (SQL Puro).

> [!IMPORTANT]
> **Regla de Oro:** La lógica de negocio vive en *Application* y no conoce a NestJS. El SQL vive exclusivamente en *Infrastructure/Persistence*.

## 3. Modelo de Datos Lógico y Buenas Prácticas
- **Soft Delete:** Uso de `deleted_at` para entidades principales.
- **Inmutabilidad Financiera:** Registros en transacciones y pagos jamás se editan (se anulan con otra transacción).
- **Tipado Estricto:** Cada query de `postgres.js` debe ser tipado: `const [user] = await sql<User[]>\`...\``
- **Prohibido SELECT *:** Las consultas deben listar explícitamente las columnas necesarias.
