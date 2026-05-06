# 🏨 Manual de Operaciones: Sistema de Diseño HMS (@hms/ui)

Este manual explica cómo utilizar, extender y mantener la capa visual compartida del ecosistema HMS. Todo el frontend se basa en Shadcn/UI adaptado para un entorno Multi-tenant (White Label).

## 1. ¿Cómo usar componentes existentes?

Los componentes viven en packages/ui pero se consumen como una librería externa gracias a Turborepo.

### ✅ Importación Estándar

Para usar un botón o un input en el Admin o la Web, impórtalo siempre desde el alias @hms/ui:

```tsx
// apps/admin/src/app/login/page.tsx
import { Button, Input, Label } from "@hms/ui";

export default function MiComponente() {
  return (
    <div>
      <Label>Email</Label>
      <Input type="email" />
      <Button variant="outline">Enviar</Button>
    </div>
  );
}
```

### 🧠 La función cn() (Tailwind Merge)

Para concatenar clases de forma segura (evitando conflictos de Tailwind), usa la utilidad cn exportada:

```tsx
import { cn } from "@hms/ui";

const MiDiv = ({ className }) => (
  <div className={cn("p-4 bg-white", className)}>
    Contenido
  </div>
);
```

## 2. Flujo para añadir NUEVOS componentes

Si necesitas un componente que aún no está en la librería (ej: un Select o un Modal), nunca lo instales en apps/admin. Sigue estos pasos:

### Instalación via CLI

Ve a packages/ui y ejecuta:

```bash
pnpm dlx shadcn@latest add [component-name]
```

### La "Regla de Oro" de las Rutas (Fix Path)

Shadcn instala los archivos con el alias @/lib/utils. Debes cambiarlo manualmente a ruta relativa para que sea compatible con el Monorepo:

Abre el archivo creado en src/components/ui/[nombre].tsx.

Cambia:

```tsx
import { cn } from "@/lib/utils"
```

Por:

```tsx
import { cn } from "../../lib/utils"
```

### Exportación Maestra

Añade el componente al archivo packages/ui/index.ts para que sea visible desde fuera:

```ts
export * from "./src/components/ui/nombre-nuevo-componente";
```

## 3. El Sistema White Label (Identidad del Hotel)

Este es el punto más importante para el negocio. No usamos colores fijos (como bg-blue-500). Usamos variables CSS mapeadas en HSL.

### ¿Cómo funciona?

En packages/ui/src/globals.css definimos variables que luego inyectaremos dinámicamente según el hotel.

| Variable | Propósito | Ejemplo de uso en Tailwind |
| --- | --- | --- |
| --primary | Color de marca del hotel | text-primary, bg-primary |
| --radius | Redondeo de bordes | rounded-lg (usa el valor de radius) |
| --card | Fondo de tarjetas | bg-card |

### Regla para el Desarrollador

Si creas un componente personalizado, siempre usa las clases semánticas:

❌ MAL: `<div className="bg-[#ff0000]">` (Color estático)

✅ BIEN: `<div className="bg-primary text-primary-foreground">`

## 4. Troubleshooting (Solución de problemas)

### ¿El componente se ve como HTML viejo (sin estilos)?

Verifica que en el tailwind.config.ts de tu aplicación (admin o web) esté incluida la ruta de la librería en la sección content:

```ts
"../../packages/ui/src/**/*.{ts,tsx}"
```

### ¿Error "Module not found: @hms/ui"?

Corre pnpm install en la raíz del proyecto para refrescar los enlaces del workspace.

### ¿TypeScript no reconoce un componente nuevo?

Asegúrate de haberlo añadido al index.ts de packages/ui.

## 5. Glosario de Comandos Rápidos

- pnpm dev --filter admin: Inicia solo el panel administrativo.
- pnpm dlx shadcn@latest add ...: Añade componentes (siempre dentro de packages/ui).