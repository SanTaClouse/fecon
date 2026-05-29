// WhatsApp deep-links. Todos los CTA abren wa.me con un mensaje pre-cargado
// distinto según el contexto (general, techo, remodelación, construcción).

export const WA_PHONE = "5493425194112";
export const WA_DISPLAY = "+54 9 3425 19-4112";
const WA_BASE = `https://wa.me/${WA_PHONE}`;

export const wa = (msg: string) => `${WA_BASE}?text=${encodeURIComponent(msg)}`;

export const WA = {
  general: wa(
    "Hola Martín, vi la web de FECON y quería pedir un presupuesto para mi proyecto."
  ),
  construccion: wa(
    "Hola Martín, me interesa construir una casa llave en mano. ¿Podemos hablar?"
  ),
  remodelacion: wa(
    "Hola Martín, quiero remodelar y me gustaría un presupuesto."
  ),
  techo: wa(
    "Hola Martín, tengo un techo de tejas y quiero que lo revisen / presupuesten."
  ),
};
