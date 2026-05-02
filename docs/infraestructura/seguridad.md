# 🛡️ Protocolo de Seguridad y Manejo de Secretos: HMS OmniHotel

Este documento establece las normativas técnicas para garantizar la integridad de los datos, la protección contra ataques comunes y el manejo seguro de credenciales en el entorno SaaS Multi-tenant.

---

## 🔑 1. Gestión de Variables de Entorno (.env)

OmniHotel utiliza un enfoque de **Configuración Centralizada** en la raíz del monorepo.

### 📜 1.1 El Archivo Maestro
Solo debe existir un archivo `.env` en la raíz del proyecto. Queda prohibido duplicar archivos `.env` dentro de las carpetas `apps/` o `packages/`.

### 🚀 1.2 Inyección Nativa (Node.js v24)
Para evitar dependencias de terceros y mejorar el rendimiento, el API arranca utilizando el flag nativo:

```bash
tsx watch --env-file=../../.env src/main.ts
```

### 🗄️ 1.3 Clasificación de Secretos
- **Infraestructura:** `DATABASE_URL`, `REDIS_URL`.
- **Aplicación:** `JWT_SECRET`, `ENCRYPTION_KEY`.
- **Integraciones:** `STRIPE_SECRET_KEY`, `S3_ACCESS_KEY`.

---

## 🏗️ 2. Blindaje contra Inyección SQL

Al utilizar el driver nativo `postgres.js`, la seguridad depende estrictamente del uso de **Tagged Templates**.

### 💎 2.1 La Regla de Oro
NUNCA concatenar strings ni usar template literals normales para construir queries.

> [!CAUTION]
> **❌ INSEGURO:** `sql("SELECT * FROM usuarios WHERE id = '" + id + "'")`
>
> **✅ SEGURO:** `` sql`SELECT id, email FROM usuarios WHERE id = ${id}` ``

El driver se encarga de parametrizar automáticamente todos los valores pasados dentro de `${}`, enviándolos por separado al motor de PostgreSQL.

---

## 🔒 3. Aislamiento Multi-tenant (Data Leaks)

En un SaaS de base de datos compartida, el mayor riesgo es el **"Cross-tenant access"**.

### 🛡️ 3.1 Filtro Obligatorio por hotel_id
Todo repositorio de infraestructura debe forzar el filtro de hotel. El `hotel_id` nunca debe ser inferido; debe ser inyectado desde la capa de aplicación.

```sql
SELECT nro_habitacion, estado
FROM habitaciones
WHERE hotel_id = ${hotelId}
AND id = ${id};
```

### 🕵️ 3.2 Auditoría de Acceso
Toda operación de escritura debe registrar el `usuario_id` y el `hotel_id` en la tabla `logs_auditoria` para detectar comportamientos anómalos o intentos de escalación de privilegios.

---

## 🔐 4. Criptografía y Contraseñas

### 🔑 4.1 Hashing de Usuarios
Las contraseñas no se almacenan en texto plano. Se utiliza **bcrypt** con un factor de costo de 12 o la extensión `pgcrypto` directamente en la base de datos:

```sql
crypt('password_del_usuario', gen_salt('bf', 12))
```

### 🔒 4.2 Encriptación de Datos Sensibles (PII)
Datos como números de tarjetas o tokens de terceros deben encriptarse utilizando **AES-256** con una `ENCRYPTION_KEY` almacenada fuera de la base de datos.

---

## 🔄 5. Protocolo de Rotación y Backups

### ⏰ 5.1 Rotación de Secretos
Se recomienda rotar la `JWT_SECRET` y las credenciales de la base de datos cada **90 días**.

### 💾 5.2 Estrategia de Backup (PostgreSQL)
- **Frecuencia:** Cada 24 horas (vía `pg_dump`).
- **Retención:** 30 días de historial.
- **Seguridad:** Backups encriptados antes de subirse a S3/GCS.

---

## ✅ 6. Lista de Verificación de Seguridad (Pre-Commit)

Antes de realizar un merge a `develop`, el desarrollador debe confirmar:
- [ ] No hay credenciales hardcodeadas en el código.
- [ ] Todas las queries SQL usan **Tagged Templates**.
- [ ] Todos los `WHERE` incluyen `hotel_id`.
- [ ] El archivo `.env` está en el `.gitignore`.
- [ ] Los endpoints sensibles tienen **Guardias de Roles (RBAC)** activos.

