import { NextRequest, NextResponse } from "next/server";
import { esContexto, waLink } from "@/lib/whatsapp";

// Puerta de salida a WhatsApp. Los botones de la web pública apuntan acá
// (/ir/wa?c=techo) en vez de a wa.me: el número queda del lado del servidor y
// no viaja al HTML ni al bundle del navegador.
//
// El contexto elige el mensaje pre-cargado; si viene cualquier cosa, cae en el
// mensaje general. No se indexa: es un redirect, no una página.

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  const c = req.nextUrl.searchParams.get("c");
  const res = NextResponse.redirect(waLink(esContexto(c) ? c : "general"), 307);
  res.headers.set("x-robots-tag", "noindex, nofollow");
  res.headers.set("cache-control", "no-store");
  return res;
}
