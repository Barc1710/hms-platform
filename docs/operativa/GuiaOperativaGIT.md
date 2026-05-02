# 📘 Guía Operativa y Metodología: HMS OmniHotel

Este documento define el marco de trabajo, los estándares de calidad y los procesos de colaboración para el equipo de desarrollo, optimizados para una arquitectura **No-ORM (SQL Nativo)**.

---

## ⏱️ 1. Metodología de Trabajo (Micro-Sprints de 72h)

Adoptamos un enfoque de **Micro-Sprints de 3 días** para asegurar que el código fluya rápidamente hacia la rama de integración y evitar desviaciones en la lógica SQL.

### 🗓️ 1.1 El Ciclo de Desarrollo

- **Día 1: Definición de Dominio y Puertos.**
  - Creación de Interfaces de Repositorio y Entidades puras en TS.
  - Diseño manual del esquema SQL (si la tarea requiere nuevas tablas).
  - *Entregable:* Archivos en carpeta `domain`.

- **Día 2: Lógica y Persistencia SQL.**
  - Desarrollo de Casos de Uso (`Application`).
  - Implementación de queries en `Infrastructure` usando `postgres.js`.
  - *Entregable:* Repositorios con SQL optimizado y linter en verde.

- **Día 3: UI, Validación e Integración.**
  - Construcción de componentes en el Frontend.
  - Pruebas de flujo completo (E2E manual).
  - *Entregable:* Pull Request (PR) aprobada y merge a `develop`.

---

## 🌿 2. Gestión de Código y Git Flow

### 🌳 2.1 Estructura de Ramas

- **`main`:** Producción. Solo se toca para lanzamientos oficiales.
- **`develop`:** Integración. Es la rama base para todo el equipo.
- **`feature/[modulo]-[descripcion]`:** Ramas temporales de trabajo (ej: `feature/tenants-onboarding`).

### 💬 2.2 Convención de Commits (Conventional Commits)

Es obligatorio para mantener un historial legible y automatizable:
- `feat(scope)`: Nueva funcionalidad.
- `fix(scope)`: Corrección de un error.
- `sql(scope)`: Cambios exclusivos en scripts de base de datos o queries.
- `docs`: Cambios en documentación.
- `refactor`: Mejora de código sin cambiar funcionalidad.

### 🔍 2.3 Proceso de Pull Request (PR) y Auditoría

Al no usar ORM, el revisor de la PR debe actuar como un **auditor de seguridad**:
1.  **Validación de Aislamiento:** ¿Cada query `SELECT`, `UPDATE` o `DELETE` incluye el filtro `tenant_id`?
2.  **Performance:** ¿Se evitó el uso de `SELECT *`? ¿Están las columnas explícitas?
3.  **Security:** ¿Se usaron *Tagged Templates* ( `` sql`...` `` ) para prevenir Inyección SQL?
4.  **Arquitectura:** ¿El driver `postgres.js` está confinado exclusivamente en la capa de `Infrastructure`?

---

## 💎 3. Estándares de Calidad de Código (TypeScript & SQL)

### ⌨️ 3.1 Reglas de TypeScript
- **Strict Mode:** Siempre activo. Prohibido el uso de `any`.
- **Interfaces:** Definir siempre el tipo de retorno de las consultas SQL:
  ```typescript
  const [row] = await sql<User[]>...
  ```
- **Enums:** Uso obligatorio para estados (ej: `RoomStatus`) para evitar strings mágicos en el SQL.

### 🗄️ 3.2 Reglas de Base de Datos
- **Naming:** Tablas y columnas en `snake_case`. El código las consume en `camelCase` gracias al transformador del driver.
- **Inmutabilidad:** Las tablas financieras (pagos, folios) no permiten `UPDATE`. Los errores se corrigen con transacciones de compensación.
- **Consistencia:** Las operaciones que afecten a más de una tabla deben envolverse en una transacción nativa de `postgres.js`.

---

## ✅ 4. Definición de "Terminado" (DoD)

Una tarea solo se considera **Done** si cumple con:
- [x] Sigue estrictamente la estructura de carpetas de **Arquitectura Hexagonal**.
- [x] No importa librerías de infraestructura (NestJS/Postgres) en el Dominio.
- [x] El SQL es seguro, optimizado y filtrado por `tenant_id`.
- [x] La interfaz de usuario es responsiva y respeta el motor de **White Label**.
- [x] Pasa exitosamente el comando `pnpm turbo build` en la raíz.
- [x] No tiene comentarios de deuda técnica (`TODO` / `FIXME`) sin un ticket asociado.

