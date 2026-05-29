# Handoff: FECON — Landing (Next.js + Tailwind + shadcn/ui)

## Overview
Landing page mobile-first de **FECON (Febre Construcciones)** — constructora de Santa Fe, Argentina. Objetivo único: que el visitante termine mandando un **WhatsApp pidiendo presupuesto**. Una sola página larga, sin multipágina. Dirección de marca elegida: **"Módulo"** (editorial, premium, sobria, acento bronce).

## Sobre los archivos de este bundle
Los archivos de esta carpeta son **referencias de diseño hechas en HTML/React (Babel in-browser)** — prototipos que muestran el look y el comportamiento buscados, **no código de producción para copiar tal cual**. La tarea es **recrear estos diseños en tu entorno real**: Next.js 14 (App Router) + Tailwind + shadcn/ui, deploy en Vercel, usando tus patrones y componentes. El JSX del prototipo usa estilos inline y un device-frame de iPhone solo para previsualizar en mobile; nada de eso va a producción.

## Fidelidad
**Alta fidelidad (hi-fi).** Colores, tipografías, espaciados y jerarquía son los definitivos. Recreá la UI fielmente con Tailwind. Las **fotos son placeholders rayados** (faltan las reales de Martín en obra) — dejá `next/image` con un fill/placeholder hasta tener material.

---

## Design Tokens

### Colores (paleta "Módulo")
| Token | Hex | Uso |
|---|---|---|
| `grafito` | `#211E1A` | Base oscura / texto principal / hero / CTA / footer |
| `grafito-2` | `#191713` | Footer (un punto más oscuro) / nav scrolleada |
| `texto` | `#2C2924` | Texto sobre fondo claro |
| `muted` | `#736C61` | Texto secundario / párrafos sobre claro |
| `niebla` | `#9C958B` | Labels mono / captions |
| `lino` | `#E4DDD0` | Superficie clara / sección "Por qué" / bordes |
| `lino-2` | `#EDE7DB` | Cards de servicios sobre fondo claro |
| `blanco` | `#FAF6EE` | Fondo general (blanco cálido) / texto sobre oscuro |
| `bronce` | `#8A6E3C` | Acento principal (botones, números, detalles) |
| `bronce-claro` | `#A2823F` | Acento sobre fondo oscuro (mejor contraste) |

Sugerencia `tailwind.config`:
```js
colors: {
  grafito: { DEFAULT: '#211E1A', 900: '#191713' },
  blanco: '#FAF6EE',
  lino: { DEFAULT: '#E4DDD0', 2: '#EDE7DB' },
  bronce: { DEFAULT: '#8A6E3C', light: '#A2823F' },
  niebla: '#9C958B',
  muted: '#736C61',
  texto: '#2C2924',
}
```

### Tipografías (Google Fonts → usar `next/font`)
- **Display / titulares:** `Bricolage Grotesque` — weights 400/500/700/800. Siempre con `letter-spacing` negativo (≈ `-0.035em` a `-0.04em`) y `line-height` apretado (1.0–1.1).
- **Texto / cuerpo:** `Schibsted Grotesk` — weights 400/500/600/700.
- **Mono / labels / datos:** `Space Mono` — weights 400/700. Para eyebrows, captions, números de paso, teléfono. Mayúsculas + `letter-spacing` 0.1em–0.24em.

### Escala tipográfica (mobile, px)
| Rol | Font | Size | Weight | LH | LS |
|---|---|---|---|---|---|
| H1 hero | Bricolage | 34 | 800 | 1.08 | -0.035em |
| H2 sección | Bricolage | 33 | 800 | 1.05 | -0.035em |
| H2 CTA | Bricolage | 40 | 800 | 1.02 | -0.04em |
| KPI número | Bricolage | 46 | 800 | 0.9 | -0.04em |
| H3 card | Bricolage | 21–24 | 700 | 1.0 | -0.03em |
| Quote testimonio | Bricolage | 24 | 500 | 1.25 | -0.02em |
| Párrafo | Schibsted | 15–17 | 400/500 | 1.5 | — |
| FAQ pregunta | Schibsted | 16 | 600 | 1.3 | — |
| Eyebrow | Space Mono | 11 | 400 | — | 0.2em, uppercase |
| Caption/label | Space Mono | 10.5–13.5 | 400/700 | — | 0.04–0.18em |

### Espaciado y formas
- Padding lateral de secciones: **22px** (`px-[22px]`). KPIs usan 16px.
- Padding vertical de secciones: **64px** arriba/abajo (`py-16`). CTA 70px.
- Border-radius: cards **16px** (`rounded-2xl`), botones **999px** (`rounded-full`), tiles/swatches 3–4px.
- Sombra de botón WhatsApp: `0 6px 20px rgba(33,30,26,0.18)`.
- Hairlines/bordes: `1px solid` en `lino` (claro) o `rgba(33,30,26,0.14)`.

---

## Marca / Logo
- **Isotipo "Módulo" (01):** la "F" de FECON armada con 3 bloques rectangulares con `rx≈2`. Asta vertical (grafito) + brazo superior (bronce) + brazo medio (grafito). ViewBox `0 0 100 120`: `rect(8,8,24,104)` grafito · `rect(36,8,56,28)` bronce · `rect(36,48,40,28)` grafito.
- **Mosaico "Hueco" (03):** misma F en negativo dentro de un tile macizo grafito → usar para **favicon / avatar** (legible a 16px).
- **Avatar de Instagram:** incluido como `assets/FECON-avatar-instagram.svg` (1080×1080, símbolo 01 sobre grafito).
- **Wordmark:** "FECON" en Bricolage Grotesque 800, `-0.04em`. Bajada "FEBRE CONSTRUCCIONES" en Schibsted/Space Mono, mayúsculas, `letter-spacing` 0.38em.
- El sistema completo de logo (lockups, reproducción, clear space, tamaños mínimos) está en `FECON — Sistema de Logo (Módulo).html`.

---

## Screens / Views (orden de la página)

> Todas las secciones tienen una **animación de entrada** sutil (fade + translateY 22px, ~0.7s, con stagger de 60–80ms entre elementos). En el prototipo es un keyframe `fecon-rise`. En Next conviene `framer-motion` (`whileInView`, `viewport={{ once: true }}`) o un IntersectionObserver propio. **El contenido debe quedar visible aunque la animación no corra** (no gatear visibilidad solo con JS).

### 1. Nav (sticky)
- Sticky top. Transparente sobre el hero; al scrollear >40px gana fondo `rgba(25,23,19,0.92)` + `backdrop-blur(12px)` + borde inferior `rgba(255,255,255,0.08)`. Transición 0.3s.
- Izquierda: isotipo (22px) + wordmark "FECON" (18px, blanco).
- Derecha: botón "Presupuesto" → link WhatsApp. Borde `1px rgba(250,246,238,0.35)`, `rounded-full`, padding 8/15.
- Padding top 50px (deja lugar al status bar en mobile real), bottom 12px.

### 2. Hero
- Fondo **grafito oscuro** con foto de Martín en obra a sangre (placeholder rayado por ahora). Overlay gradiente `to bottom` de `rgba(25,23,19,0.55)` → `0.92` para legibilidad del texto.
- Contenido alineado **abajo** (flex column, `justify-end`), `min-height ~600px`, padding `180px 22px 56px`.
- Eyebrow (Space Mono, bronce-claro): "Construcción · Santa Fe · 16 años".
- **H1:** "Casas de cero, remodelaciones y especialistas en techos de tejas." (34px, `text-wrap: balance`).
- Subhead (17px, `rgba(250,246,238,0.82)`, max-width 340): "Equipo propio, trato directo con el dueño y 16 años de oficio. De cero a llaves, o el techo que tu casa necesita."
- Acciones (flex, gap 18, wrap): botón WhatsApp grande "Pedir presupuesto" + link de texto "Ver servicios" (ancla a #servicios, subrayado bronce).

### 3. KPIs
- Fondo `blanco`. Grilla **2×2**, borde `1px lino` entre celdas (top + right en col izquierda + bottom).
- Cada celda padding `26px 14px`: número grande (Bricolage 46, grafito) + label (Space Mono 11.5, muted, uppercase).
- Datos: **16** Años de oficio · **14** Casas de cero · **+200** Trabajos y techos · **15** En el equipo.

### 4. Servicios (`id="servicios"`)
- Fondo `blanco`, padding `64px 22px 8px`. Eyebrow "Lo que hacemos" + H2 "Tres formas de trabajar con nosotros."
- **Card 1 y 2** (fondo `lino-2`, `rounded-2xl`, padding `24px 22px`): número mono (bronce) + H3 (Bricolage 22) + párrafo (15, muted). Toda la card es link a WhatsApp con mensaje pre-cargado.
  - 01 **Construcción llave en mano** — "De terreno a llaves. Nos hacemos cargo de todo el proceso para que no tengas que ser tu propio capataz."
  - 02 **Remodelaciones integrales** — "Ampliar, renovar o transformar lo que ya tenés, con el mismo equipo de principio a fin."
- **Card destacada "Techos de tejas"** (fondo `grafito`, texto blanco): badge "NUESTRA ESPECIALIDAD" (mono, fondo bronce-claro, pill) + ícono techo (esquina sup. der.) + H3 "Techos de tejas" + párrafo "Reparación, recambio total e impermeabilización. Pocos lo hacen bien en Santa Fe; nosotros vivimos de esto hace años." + link "Consultar por mi techo →" (bronce-claro). Link a WhatsApp.

### 5. Por qué FECON
- Fondo `lino`, padding `64px 22px`. Eyebrow "Por qué FECON" + H2 "Construir sin vueltas, con quien sabe."
- 3 items en columna (gap 30), cada uno con borde superior `1px rgba(33,30,26,0.14)`, padding-top 22:
  - **Equipo propio** (ícono: 3 bloques) — "15 personas en relación de dependencia. No tercerizamos: la obra la hace nuestra gente, no un subcontratista que aparece y desaparece."
  - **Trato directo con el dueño** (ícono: 2 bloques + conector) — "Hablás con Martín, no con un vendedor ni un arquitecto intermediario que infle la cuenta. Las cosas se dicen de frente."
  - **Especialistas en techos** (ícono: techo/ángulo) — "El nicho que casi nadie cubre bien en Santa Fe. Tejas, cumbreras y filtraciones: lo resolvemos y te explicamos cómo."
- **Íconos:** geométricos propios (bloques del sistema Módulo + un techo a 2 aguas con acento bronce). NO usar íconos genéricos de librería. SVGs en el prototipo (`IconEquipo`, `IconTrato`, `IconTecho`).

### 6. Testimonios (slider)
- Fondo `blanco`, padding `64px 22px`. Eyebrow "Lo que dicen".
- Comilla decorativa grande (Bricolage, color `lino`). Quote (Bricolage 24, 500, grafito, `min-height ~150px`) + nombre (Schibsted 700, 15) + lugar (Space Mono 11.5, muted).
- Controles abajo: **dots** (el activo se estira a 22px, bronce; inactivos 7px, lino) + flechas ‹ › (42×42, `rounded-full`, borde `1px lino`).
- 3 testimonios (FALSOS por ahora, reemplazar por reales):
  1. "Pensé que iba a ser un quilombo y fue al revés: Martín me explicó cada etapa y los tiempos se cumplieron." — Laura G. · Casa nueva · Recreo
  2. "Nos cambiaron todo el techo de tejas en una semana. Dos inviernos después, cero goteras." — Diego F. · Recambio de techo · Santo Tomé
  3. "Presupuesto claro, sin sorpresas a mitad de obra. Volvería a construir con ellos sin dudarlo." — Flia. Méndez · Ampliación · Santa Fe

### 7. FAQ (acordeón)
- Fondo `blanco`, padding `20px 22px 64px`. Eyebrow "Preguntas frecuentes" + H2 "Lo que todos preguntan."
- Items con borde superior `1px lino`. Header = botón full-width (pregunta Schibsted 600 16 + toggle "+" que rota 45° al abrir, bronce). Panel colapsable con transición `max-height 0.4s`. **Por defecto abre el primero.** Permitir cerrar todos.
- 6 preguntas (texto completo en `fecon-web.jsx`, componente `FAQ`): presupuesto cerrado · casas vs remodelaciones · planos/arquitecto · zona de trabajo · cuánto tarda una casa · por qué tejas.

### 8. CTA final
- Fondo `grafito`, padding `70px 22px`. Eyebrow "Hablemos" (bronce-claro) + H2 "Contanos tu proyecto." (40px, blanco).
- Párrafo (17, `rgba(250,246,238,0.8)`): "Mandanos un WhatsApp y te respondemos nosotros mismos —no un bot— con las preguntas justas para darte un número real."
- Botón WhatsApp grande "Escribinos por WhatsApp" + teléfono en mono bronce-claro: **+54 9 3425 19-4112**.

### 9. Footer
- Fondo `grafito-2`, padding `40px 22px`. Isotipo + wordmark. Links (Schibsted 15, `rgba(250,246,238,0.82)`): WhatsApp · Instagram @feconconstrucciones · "Santa Fe capital y alrededores · Argentina" · dominio `feconconstrucciones.com.ar` (bronce-claro, mono).
- Línea inferior (mono 10.5, `rgba(250,246,238,0.4)`): "© 2026 FECON · Febre Construcciones · Construcciones en general".

---

## Interacciones & comportamiento
- **WhatsApp deep-links:** todos los CTA abren `https://wa.me/5493425194112?text=<mensaje URL-encoded>` en nueva pestaña. Mensajes pre-cargados distintos por contexto (general, techo, remodelación, construcción). Helper en el prototipo: `wa(msg)`.
- **Nav sticky:** cambia de transparente a sólido con blur al pasar 40px de scroll.
- **Acordeón FAQ:** un panel abierto a la vez (estado `open: number`, `-1` = todos cerrados); transición `max-height`.
- **Slider testimonios:** estado `index`; dots + flechas con wrap-around (módulo).
- **Reveals:** entrada fade-up al montar/entrar en viewport, una sola vez. Sobrias, sin parallax ni scroll-jacking.
- **Scroll suave** en anclas internas (`scroll-behavior: smooth`).

## State management
- `navScrolled: boolean` (scroll listener).
- `faqOpen: number` (índice abierto, default 0).
- `testimonialIndex: number` (default 0).
- Sin data fetching. Meta Pixel: instalar desde día 1 para pauta posterior (no implementado en el prototipo).

## SEO / técnico (Next.js)
- `lang="es-AR"`. Title + meta description orientados a "constructora Santa Fe / techos de tejas".
- Fuentes vía `next/font/google` (Bricolage Grotesque, Schibsted Grotesk, Space Mono) para evitar CLS.
- Imágenes con `next/image`. Botones WhatsApp con `rel="noopener"` y `aria-label`.
- Mobile-first; derivar desktop después (este handoff cubre mobile; el layout desktop está pendiente de diseño).

## Assets
- `assets/FECON-avatar-instagram.svg` — avatar IG (incluido).
- Isotipos/logo: recrear como SVG desde las specs de arriba o exportar desde `FECON — Sistema de Logo (Módulo).html`.
- Fotos de obra (hero, card de tejas, fondo de carrusel): **pendientes** — placeholders rayados por ahora.

## Files (referencias en este bundle)
- `FECON — Web (Mobile).html` — entrypoint del prototipo (monta el landing en un frame de iPhone y lo escala).
- `fecon-web.jsx` — **todo el landing**: componentes, copy literal, tokens (objeto `F`), íconos SVG, slider, acordeón, deep-links. **Fuente de verdad del contenido.**
- `ios-frame.jsx` — solo el marco de iPhone para previsualizar (NO va a producción).
- `FECON — Sistema de Logo (Módulo).html` + `boards/logo-modulo.jsx` — sistema de logo.
- `FECON — Direcciones de Marca.html` + `boards/*` — exploración de marca (contexto).
- `assets/FECON-avatar-instagram.svg` — avatar.
