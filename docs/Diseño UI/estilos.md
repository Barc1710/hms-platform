# 🎨 Guía de Estilo y Sistema de Diseño: HMS OmniHotel

Este documento establece las bases visuales y técnicas para la interfaz de usuario (UI) de los paneles administrativos y portales públicos, garantizando una experiencia coherente y un motor de **Marca Blanca (White Label)** dinámico.

---

## 💡 1. Filosofía de Diseño: "Claridad Hotelera"

El diseño de OmniHotel prioriza la eficiencia operativa sobre el adorno innecesario.
- **🖥️ ERP (Admin):** Interfaz densa pero limpia, enfocada en la gestión de inventario y rapidez de check-in.
- **🌐 Web (Público):** Interfaz aspiracional, enfocada en la conversión de reservas y confianza de marca.

---

## 🌈 2. Sistema de Color y Motor White Label

OmniHotel utiliza un sistema de **Variables CSS** inyectadas dinámicamente desde el backend.

### ⚪ 2.1 Colores Base del Sistema (Neutros)
Utilizados para el "armazón" del software (bordes, fondos de dashboard, textos).
- **Fondo:** `#F8FAFC` (Slate-50)
- **Bordes:** `#E2E8F0` (Slate-200)
- **Texto Principal:** `#0F172A` (Slate-900)

### 🎨 2.2 Colores Dinámicos (Personalizables por Hotel)
Estos valores se recuperan de la tabla `configuracion_marca` y se aplican al `:root` del documento.

| Variable CSS | Uso Principal | Valor por Defecto |
| :--- | :--- | :--- |
| `--primary` | Botones principales, estados activos, enlaces. | `#3B82F6` |
| `--secondary` | Headers, menús laterales, acentos. | `#1E293B` |
| `--accent` | Notificaciones, llamadas a la acción menores. | `#F59E0B` |

> [!TIP]
> **Implementación Técnica:**
> ```css
> :root {
>   --primary: ${hotel.color_primario};
>   --secondary: ${hotel.color_secundario};
> }
> ```

---

## 🔡 3. Tipografía

El sistema utiliza fuentes legibles y modernas con soporte para caracteres internacionales.
- **Fuente Principal:** Inter (Sans-serif). Optimizada para lectura de datos en tablas.

### 📐 Jerarquía
- **H1 (Títulos de página):** 24px - SemiBold.
- **H2 (Secciones):** 20px - Medium.
- **Body (Texto común):** 14px - Regular.
- **Caption (Datos de tabla):** 12px - Regular.

---

## 🧩 4. Componentes Core (Basados en Shadcn/UI)

### 🖱️ 4.1 Botones (Buttons)
- **Primary:** Fondo `--primary`, texto blanco.
- **Outline:** Borde `--primary`, texto `--primary`, fondo transparente.
- **Destructive:** Fondo rojo (uso exclusivo para cancelaciones o borrado).

### 📊 4.2 Tablas de Datos (Data Tables)
- **Estilo:** Cebra (filas pares con fondo ligero).
- **Acciones:** Agrupadas a la derecha bajo un menú de "tres puntos" (Dropdown).

### 🏷️ 4.3 Badges de Estado (Semantic Badges)
Mapeo visual de los Enums de la base de datos:

| Estado | Color de Badge | Razón |
| :--- | :--- | :--- |
| **DISPONIBLE** | Verde / Esmeralda | Habitación lista para venta. |
| **OCUPADA** | Azul / Primario | Habitación con huésped activo. |
| **SUCIA / LIMPIEZA** | Amarillo / Ámbar | Requiere atención de Housekeeping. |
| **MANTENIMIENTO** | Rojo / Rosa | Bloqueada por falla técnica. |

---

## 📐 5. Layout y Estructura de Paneles

### 🛠️ 5.1 Dashboard Administrativo (ERP)
- **Sidebar (Lateral):** Anclado a la izquierda, color `--secondary`.
- **Topbar:** Superior, fondo blanco. Muestra el nombre del Hotel y selector de Sede.
- **Canvas Principal:** Fondo Slate-50, contenedor centrado (max-width 1440px).

### 📱 5.2 Portal de Reservas (Front-facing)
- **Mobile-First:** El 70% de las reservas se hacen desde smartphone.
- **Sticky Booking Bar:** Selector de fechas siempre visible en móviles.

---

## 🖼️ 6. Recursos Visuales (Logos y Favicons)

- **Logotipos:** URLs externas (S3/Cloudinary).
- **Restricción:** Max-height de 48px para evitar roturas de layout.
- **Placeholder:** Si no hay logo, se muestra el `nombre_comercial` con la fuente de la marca.

---

## ♿ 7. Accesibilidad y Calidad

- **⚖️ Contraste:** Todo color dinámico debe pasar la prueba WCAG AA.
- **⏳ Loading States:** Uso obligatorio de **Skeletons** mientras el SQL responde.
- **🌙 Modo Oscuro:** El ERP soporta modo oscuro nativo, invirtiendo la paleta de neutros.

