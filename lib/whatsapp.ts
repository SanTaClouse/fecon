// WhatsApp: mensajes pre-cargados por contexto (general, construcción,
// remodelación, techo).
//
// OJO: este módulo es SOLO de servidor. El número no se manda más al navegador:
// los CTA de la web pública apuntan a /ir/wa?c=<contexto>, que redirige del
// lado del servidor a wa.me. Así el número no aparece en el HTML ni en el
// bundle, y el único camino a WhatsApp pasa por el portero de contacto
// (components/contacto.tsx), que primero desvía las postulaciones de trabajo.
//
// Desde componentes cliente se importa únicamente el TIPO:
//   import type { Contexto } from "@/lib/whatsapp";
// (los `import type` se borran al compilar, así que no arrastran el número).

export const WA_PHONE = "5493425194112";
export const WA_DISPLAY = "+54 9 3425 19-4112";

export const MENSAJES = {
  general:
    "Hola Martín, vi la web de FECON y quería pedir un presupuesto para mi proyecto.",
  construccion:
    "Hola Martín, me interesa construir una casa llave en mano. ¿Podemos hablar?",
  remodelacion: "Hola Martín, quiero remodelar y me gustaría un presupuesto.",
  techo:
    "Hola Martín, tengo un techo de tejas y quiero que lo revisen / presupuesten.",
} as const;

export type Contexto = keyof typeof MENSAJES;

export const esContexto = (v: string | null): v is Contexto =>
  v !== null && Object.prototype.hasOwnProperty.call(MENSAJES, v);

/** Link wa.me con el mensaje del contexto ya escrito. Solo servidor. */
export const waLink = (contexto: Contexto = "general") =>
  `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(MENSAJES[contexto])}`;
