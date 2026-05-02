# 🛠️ HMS OmniHotel - API Central

Este es el **Backend Central** de la plataforma OmniHotel, desarrollado con [NestJS](https://nestjs.com/) y siguiendo los principios de la **Arquitectura Hexagonal**.

---

## 🏗️ Arquitectura y Stack

- **🚀 Framework:** NestJS (Node.js v24).
- **🛡️ Patrón:** Arquitectura Hexagonal (Puertos y Adaptadores).
- **🗄️ Persistencia:** PostgreSQL 16 con SQL Puro (`postgres.js`).
- **🔒 Multi-tenancy:** Aislamiento lógico por `tenant_id`.

> [!IMPORTANT]
> Para detalles profundos sobre la implementación, consulte:
> - 📐 [Diseño de Arquitectura](../docs/arquitectura/Arquitectura.md)
> - 🛡️ [Protocolo de Seguridad](../docs/infraestructura/seguridad.md)

---

## 🚀 Inicio Rápido

### 🔧 Instalación
```bash
pnpm install
```

### 🏃 Ejecución
```bash
# Desarrollo con watch mode
pnpm run start:dev

# Producción
pnpm run start:prod
```

### 🧪 Pruebas
```bash
# Pruebas unitarias
pnpm run test

# Pruebas E2E
pnpm run test:e2e
```

---

## 📁 Estructura del Módulo
Cada módulo funcional en `src/modules` sigue esta estructura:
- `domain/`: Entidades e interfaces (0 dependencias).
- `application/`: Casos de uso y lógica de negocio.
- `infrastructure/`: Controladores NestJS y persistencia SQL.

---

## 📖 Recursos Adicionales
- [Documentación Maestría de la API](../../docs/arquitectura/MapeoAPI.md)
- [Guía de Desarrollo con IA](../../docs/operativa/GuiaDesarrolloIA.md)

