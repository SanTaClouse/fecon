# FECON — Landing

Landing page mobile-first de **FECON (Febre Construcciones)**, constructora de
Santa Fe, Argentina. Objetivo único: que el visitante mande un **WhatsApp
pidiendo presupuesto**. Dirección de marca **"Módulo"** (editorial, sobria,
acento bronce).

Implementada según `design_handoff_fecon_web/README.md`, con
`design_handoff_fecon_web/fecon-web.jsx` como fuente de verdad del copy y los
estilos.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** (tokens "Módulo" en `tailwind.config.ts`)
- **shadcn/ui** (Radix Accordion para el FAQ)
- **next/font/google** — Bricolage Grotesque, Schibsted Grotesk, Space Mono
- Deploy objetivo: **Vercel**

## Scripts

```bash
npm install      # instalar dependencias
npm run dev      # desarrollo en http://localhost:3000
npm run build    # build de producción
npm run start    # servir el build
npm run lint
```

## Estructura

```
app/
  layout.tsx        # fuentes (next/font), metadata SEO, lang="es-AR"
  page.tsx          # ensambla las secciones
  globals.css       # Tailwind + keyframe de entrada (reveal) + reduced-motion
  icon.svg          # favicon: mosaico "Hueco" (F en tile grafito)
components/
  marks.tsx         # isotipo "Módulo", wordmark e íconos geométricos propios
  ui-bits.tsx       # Reveal, Eyebrow, WAButton
  ui/accordion.tsx  # primitivo shadcn (Radix) para el FAQ
  sections/         # nav, hero, kpis, servicios, por-que, testimonios, faq, cta, footer
lib/
  utils.ts          # cn()
  whatsapp.ts       # deep-links wa.me con mensajes pre-cargados por contexto
```

## Pendientes (según handoff)

- **Fotos reales** de Martín en obra (hero, card de tejas, fondo del carrusel).
  Hoy hay placeholders rayados; cambiar a `next/image` cuando haya material.
- **Testimonios reales** — los 3 actuales son provisorios.
- **Layout desktop** — este handoff cubre mobile; derivar desktop después.
- **Meta Pixel** — instalar desde día 1 para pauta posterior.
- Logo completo / lockups: ver `design_handoff_fecon_web/FECON — Sistema de Logo (Módulo).html`.
