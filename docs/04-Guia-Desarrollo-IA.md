# 🤖 Guía Operativa y Desarrollo con IA (Prompt Guard)

## 1. El Core Prompt (Contexto Maestro Obligatorio)
Copia y pega este bloque al inicio de cada nueva conversación con un LLM para "resetear" su comportamiento:

> [!TIP]
> "Actúa como un Arquitecto de Software Senior. Trabajamos en HMS OmniHotel, un SaaS Multi-tenant en NestJS.
> **Reglas Innegociables:**
> - 🚫 **Cero ORMs:** Está terminantemente prohibido usar Prisma, TypeORM o Drizzle. Usa solo SQL Puro con postgres.js.
> - 🏗️ **Arquitectura Hexagonal:** Separa en carpetas domain (0 dependencias), application e infrastructure.
> - 🔒 **Seguridad Multi-tenant:** Toda consulta SQL debe incluir obligatoriamente el filtro `tenant_id` en el WHERE.
> - 🚀 **Prohibido SELECT *:** Debes listar explícitamente las columnas necesarias.
> - 🏷️ **Naming:** Base de Datos usa snake_case, código TS usa camelCase."

## 2. El Filtro del Arquitecto (Review de Salida)
Antes de integrar cualquier código generado por IA, verifica:
1. ¿Hay rastros de ORMs? Si es así, el código es incorrecto.
2. ¿Usa Tagged Templates para el SQL?
3. ¿Falta el filtro `tenant_id` en el `WHERE`?
4. ¿Usa `SELECT *`?

## 3. Metodología de Commits (Micro-Sprints)
- Utiliza **Conventional Commits**: `feat(scope): mensaje`, `fix(scope): mensaje`.
- Una tarea se considera "Terminada" cuando respeta la Arquitectura Hexagonal, el SQL está optimizado y seguro, y pasa el build en Turborepo.
