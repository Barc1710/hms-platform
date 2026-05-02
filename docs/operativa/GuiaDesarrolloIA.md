# 🤖 AI Manifesto: Reglas para el Desarrollo en HMS OmniHotel

Este documento es la **ley marcial** para interactuar con Modelos de Lenguaje (LLMs). Su objetivo es transformar a la IA en un Ingeniero de Software Senior que domine el SQL puro y la Arquitectura Hexagonal, evitando que genere código genérico o dependencias de ORMs.

---

## 🧠 1. El Core Prompt (Contexto Maestro Obligatorio)

Copia y pega este bloque al inicio de cada nueva conversación con una IA para "resetear" su comportamiento al estándar del proyecto:

> [!IMPORTANT]
> "Actúa como un Arquitecto de Software Senior. Trabajamos en HMS OmniHotel, un SaaS Multi-tenant en NestJS.
> **Stack Técnico:** Node.js v24, `postgres.js` (Driver SQL Puro), Arquitectura Hexagonal.
>
> **Reglas Innegociables:**
> - 🚫 **Cero ORMs:** Está terminantemente prohibido usar Prisma, TypeORM o Drizzle. Usa solo SQL Puro con *Tagged Templates* (ej. `sql`SELECT ...``).
> - 🏗️ **Arquitectura Hexagonal:** Separa en carpetas `domain` (0 dependencias), `application` (Casos de Uso) e `infrastructure` (SQL y NestJS).
> - 🔒 **Seguridad Multi-tenant:** Toda consulta SQL (SELECT, UPDATE, DELETE) debe incluir obligatoriamente el filtro `tenant_id` en el `WHERE`.
> - 🚀 **Prohibido SELECT *:** Debes listar explícitamente las columnas necesarias por rendimiento y seguridad.
> - 🏷️ **Naming:** Base de Datos usa `snake_case`, código TypeScript usa `camelCase`. El driver `postgres.js` ya está configurado para transformar automáticamente."

---

## 🎯 2. Estrategia de Solicitud (Prompts Atómicos)

No pidas un módulo entero de golpe. Divide la construcción por capas para mantener el control total:

### 🛡️ Paso A: Definición de Dominio
**Prompt:** *"Genera la interfaz IRoomRepository y la entidad Room para el módulo de habitaciones. Usa tipos de TypeScript puros. La interfaz debe definir métodos para buscar por disponibilidad filtrando por tenantId."*

### ⚙️ Paso B: Lógica de Aplicación
**Prompt:** *"Basado en la interfaz IRoomRepository, crea el caso de uso BookRoomUseCase. Solo debe contener lógica de negocio y validaciones. No menciones SQL aquí."*

### 🔌 Paso C: Implementación de Infraestructura (SQL)
**Prompt:** *"Crea la implementación de SqlRoomRepository usando el driver postgres.js. Usa Tagged Templates para evitar SQL Injection. Implementa el método findById asegurando que el SQL sea: SELECT id, name, status FROM rooms WHERE id = ${id} AND tenant_id = ${tenantId}. No uses SELECT *."*

---

## 🔍 3. El Filtro del Arquitecto (Review de Salida)

Antes de integrar cualquier código de la IA, verifica estos 4 puntos críticos. Si falta uno, pide a la IA que lo corrija:

- **¿Hay rastros de ORMs?** Si ves algo como `prisma.user.findMany`, el código es basura para nuestra arquitectura.
- **¿Usa Tagged Templates?** Debe usar la sintaxis de comillas invertidas del driver: `` sql`query` ``. Si usa strings planos, es vulnerable a SQL Injection.
- **¿Falta el tenant_id?** En un SaaS, un query sin `tenant_id` es un bug de seguridad crítico.
- **¿Usa SELECT *?** Exige que se especifiquen las columnas. Queremos que el API sea ligera.

---

## 🛠️ 4. Guía para Debugging con IA

Cuando el código falle, no copies el error solo. Dale contexto de mapeo:

> [!TIP]
> "Tengo un error de tipado en mi Repositorio de SQL. El driver `postgres.js` transforma `created_at` (DB) a `createdAt` (TS). Revisa si el Mapper o la Interfaz de Dominio están alineados con esta transformación automática."

---

## 📖 5. Glosario de Prompting para HMS

| Término | Lo que la IA debe entender |
| :--- | :--- |
| **"Implementación SQL"** | Uso de `postgres.js` con sentencias puras optimizadas. |
| **"Aislamiento de Inquilino"** | Inyección forzosa de `tenant_id` en cada consulta. |
| **"Inmutabilidad Financiera"** | No generar `UPDATE` en tablas de transacciones; generar nuevos registros. |
| **"Entidad Pura"** | Una interfaz de TS en la capa de `Domain` sin decoradores de NestJS. |

