# 🛡️ Seguridad y Aislamiento Multi-Tenant: HMS OmniHotel

Este documento establece las normativas técnicas para garantizar el aislamiento lógico de los datos en nuestro entorno SaaS.

## 1. Estrategia Multi-tenant (Shared Schema)
Para maximizar el rendimiento, todos los hoteles comparten la misma base de datos, separados lógicamente por un `tenant_id`.

> [!CAUTION]
> **Aislamiento Lógico Obligatorio:** Toda consulta `SELECT`, `UPDATE` o `DELETE` debe incluir explícitamente el parámetro `tenant_id` en la cláusula `WHERE`. El `tenant_id` NUNCA debe ser inferido de variables globales.

## 2. Blindaje contra Inyección SQL
Al utilizar SQL Puro con `postgres.js`, la seguridad depende estrictamente del uso de **Tagged Templates**. NUNCA concatenar strings.

✅ **SEGURO:** `` sql`SELECT id, email FROM usuarios WHERE id = ${id} AND tenant_id = ${tenantId}` ``
❌ **INSEGURO:** `sql("SELECT * FROM usuarios WHERE id = '" + id + "'")`

## 3. Autenticación y RBAC
- **Login:** Se devuelve un JWT validando las credenciales.
- **Payload JWT:** Debe incluir `usuario_id`, `rol`, y de manera obligatoria el `tenant_id` asociado.
- Toda operación sensible interceptará este JWT para inyectar el `tenant_id` correcto en los Casos de Uso.
