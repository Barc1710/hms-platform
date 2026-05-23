# 🐳 Guía de Uso de Base de Datos con Docker

Esta guía detalla los pasos para levantar e inicializar la infraestructura de base de datos (PostgreSQL 16 y Redis 7) utilizando el archivo `docker-compose.yml` que se encuentra en la raíz del proyecto.

---

## 🛠️ Requisitos Previos

*   Tener instalado **Docker** y **Docker Compose**.
*   (Opcional) Un cliente SQL para bases de datos (como DBeaver, DataGrip o la extensión de bases de datos de VS Code).

---

## 🚀 Paso 1: Levantar los Contenedores

Ejecuta el siguiente comando en la **raíz del proyecto** (donde se encuentra `docker-compose.yml`) para levantar la base de datos y Redis en segundo plano:

```bash
docker compose up -d
```

Este comando descargará e iniciará dos servicios:
1.  **PostgreSQL 16**: Corriendo bajo el nombre de contenedor `hms-postgres` en el puerto `5432`.
2.  **Redis 7**: Corriendo bajo el nombre de contenedor `hms-redis` en el puerto `6379`.

Para verificar que los contenedores están corriendo correctamente, ejecuta:

```bash
docker compose ps
```

---

## 🔑 Credenciales de Conexión

Usa las siguientes credenciales para conectarte a PostgreSQL desde tu cliente local o desde el backend:

*   **Host**: `localhost` (o `127.0.0.1`)
*   **Puerto**: `5432`
*   **Usuario**: `hms_admin`
*   **Contraseña**: `hms_secure_password_2026`
*   **Base de Datos**: `omnihotel_db`

---

## 🗃️ Paso 2: Inicializar el Schema y Cargar Datos Semilla

Hay dos maneras de inicializar el esquema en el contenedor de PostgreSQL.

### Opción A: Desde la consola utilizando `docker exec` (Recomendado)

Ejecuta los siguientes comandos desde la raíz del proyecto para inyectar los scripts SQL directamente al contenedor:

1.  **Crear tablas e Índices (Schema)**:
    ```bash
    docker exec -i hms-postgres psql -U hms_admin -d omnihotel_db < packages/database/sql/init.sql
    ```

2.  **Cargar datos semilla (Seed con 3 hoteles y 9 usuarios)**:
    ```bash
    docker exec -i hms-postgres psql -U hms_admin -d omnihotel_db < packages/database/sql/seed.sql
    ```

3.  **(Opcional) Limpiar todos los datos operativos**:
    ```bash
    docker exec -i hms-postgres psql -U hms_admin -d omnihotel_db < packages/database/sql/drop.sql
    ```

---

### Opción B: Conexión mediante Cliente SQL Local

1.  Abre tu herramienta de base de datos preferida y crea una nueva conexión PostgreSQL usando las credenciales listadas arriba.
2.  Abre y ejecuta secuencialmente los scripts ubicados en la carpeta `packages/database/sql/`:
    *   Primero: [init.sql](sql/init.sql)
    *   Segundo: [seed.sql](sql/seed.sql)

---

## 🛑 Detener los Servicios

Para detener y apagar los contenedores conservando los datos persistidos en los volúmenes, ejecuta:

```bash
docker compose down
```

Si deseas reiniciar la base de datos desde cero eliminando toda la información almacenada en los volúmenes, ejecuta:

```bash
docker compose down -v
```
