# 🗺️ Mapeo de API y Entidades: HMS OmniHotel (No-ORM)

Este documento vincula las tablas de PostgreSQL (en español) con las capas de la **Arquitectura Hexagonal** en NestJS.

---

## 🏗️ 1. Módulo: Núcleo y Hoteles (`hoteles`)

| Ruta API | Tabla SQL | Entidad (Domain) | Responsable |
| :--- | :--- | :--- | :--- |
| `/hoteles/registro` | `hoteles`, `configuracion_marca` | `Hotel`, `Marca` | Dev A |
| `/hoteles/:slug` | `hoteles` | `Hotel` | Dev A |
| `/hoteles/:id/marca` | `configuracion_marca` | `Marca` | Dev A |

---

## 🔐 2. Módulo: IAM y Personal (`usuarios`)

| Ruta API | Tabla SQL | Entidad (Domain) | Responsable |
| :--- | :--- | :--- | :--- |
| `/autenticacion/login` | `usuarios` | `Usuario` | Dev B |
| `/personal` | `usuarios` | `Usuario` | Dev B |
| `/personal/:id/rol` | `usuarios` | `Usuario` | Dev B |

---

## 🛏️ 3. Módulo: Inventario (`habitaciones`)

| Ruta API | Tabla SQL | Entidad (Domain) | Responsable |
| :--- | :--- | :--- | :--- |
| `/habitaciones/categorias` | `categorias_habitacion` | `Categoria` | Dev A |
| `/habitaciones` | `habitaciones` | `Habitacion` | Dev B |
| `/habitaciones/:id/estado` | `habitaciones` | `Habitacion` | Dev B |

---

## 📅 4. Módulo: Reservas y CRM (`reservas`)

| Ruta API | Tabla SQL | Entidad (Domain) | Responsable |
| :--- | :--- | :--- | :--- |
| `/huespedes/buscar` | `huespedes` | `Huesped` | Dev A |
| `/reservas` | `reservas`, `folios` | `Reserva`, `Folio` | Dev B |
| `/reservas/disponibilidad` | `reservas`, `habitaciones` | `Disponibilidad` | Dev A |

---

## 💰 5. Módulo: Finanzas y Caja (`turnos_caja`)

| Ruta API | Tabla SQL | Entidad (Domain) | Responsable |
| :--- | :--- | :--- | :--- |
| `/caja/turnos` | `turnos_caja` | `TurnoCaja` | Dev A |
| `/folios/:id/transacciones` | `transacciones_folio` | `Transaccion` | Dev B |
| `/transacciones` | `transacciones_folio` | `Transaccion` | Dev B |

---

## 🔄 Transformación Automática de Datos

El driver `postgres.js` realiza el mapeo de nombres de la siguiente forma:

> [!NOTE]
> **Base de Datos (`snake_case`)** -> **Código TypeScript (`camelCase`)**
> - `id` -> `id`
> - `hotel_id` -> `hotelId`
> - `nro_habitacion` -> `nroHabitacion`
> - `razon_social` -> `razonSocial`
> - `creado_at` -> `creadoAt`

### 💻 Ejemplo de implementación en Repositorio:

```typescript
// La fila viene como { nro_habitacion: '101' }
// El driver la entrega como { nroHabitacion: '101' }
const [habitacion] = await this.db<Habitacion[]>`
  SELECT nro_habitacion, estado 
  FROM habitaciones 
  WHERE hotel_id = ${hotelId}
`;
```

