# 🎨 Guía de Frontend y White Label (Marca Blanca)

Todo el frontend (Next.js) utiliza **Shadcn/UI** y **TailwindCSS**, adaptado para soportar personalización dinámica según el hotel.

## 1. El Motor White Label
Los colores no están definidos como clases estáticas en Tailwind. El backend provee la configuración visual del hotel y el frontend inyecta **Variables CSS**.

| Variable CSS | Propósito | Ejemplo en Tailwind |
| :--- | :--- | :--- |
| `--primary` | Color de marca del hotel | `text-primary`, `bg-primary` |
| `--secondary`| Headers, menús laterales | `bg-secondary` |

> [!IMPORTANT]
> **Regla de Oro:** Prohibido usar colores quemados como `bg-[#ff0000]` o `bg-blue-500`. Siempre utiliza las clases semánticas de Tailwind basadas en HSL (`bg-primary`).

## 2. Desarrollo con @hms/ui
Los componentes compartidos viven en `packages/ui` pero se consumen como librería externa.

- **Importación:** `import { Button, Input } from "@hms/ui";`
- **Añadir nuevos:** Desde `packages/ui` correr `pnpm dlx shadcn@latest add [componente]`. Modificar rutas relativas en lugar de `@/lib/utils` y exportarlo en el `index.ts`.
- **Estilo Visual:** Se fomenta el uso de "Glassmorphism" en las pantallas principales (Login/Layouts) aprovechando Tailwind.
