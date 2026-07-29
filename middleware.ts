import { NextRequest, NextResponse } from "next/server";

// Protege las zonas privadas con una clave simple (HTTP Basic Auth). El
// navegador pide usuario y contraseña una sola vez y las recuerda.
//
// Zonas privadas:
//   /presupuestos   → generador y edición del catálogo
//   /trabajadores   → base de gente anotada (¡datos personales!)
//
// El formulario público /trabaja-con-nosotros NO pasa por acá: cualquiera tiene
// que poder anotarse desde el link del video. Ojo al tocar el matcher: la regla
// "/trabajadores" es exacta, así que no alcanza a la ruta pública.
//
// Credenciales: SIEMPRE salen de las variables de entorno PRESUPUESTOS_USER y
// PRESUPUESTOS_PASS (Vercel → Settings → Environment Variables). No hay valor
// por defecto a propósito: el repo es público, así que una clave escrita acá
// sería una clave publicada. Si faltan las variables, no entra nadie.
//
// Excepción: en /presupuestos, los bots de "link preview" (WhatsApp, Facebook,
// etc.) reciben una mini-página pública SOLO con los tags de OpenGraph (sin la
// herramienta), así el link muestra preview lindo sin exponer nada ni pedir la
// clave a un bot. En /trabajadores no hay excepción: nunca se muestra nada.

export const config = {
  matcher: [
    "/presupuestos",
    "/presupuestos/:path*",
    "/trabajadores",
    "/trabajadores/:path*",
  ],
};

const BOT_RE =
  /(facebookexternalhit|facebot|WhatsApp|Twitterbot|Slackbot|Discordbot|TelegramBot|LinkedInBot|Pinterest|redditbot|Googlebot|bingbot|Applebot|vkShare|Embedly|Iframely|SkypeUriPreview|W3C_Validator)/i;

function previewHtml(origin: string, url: string): string {
  const title = "FECON · Presupuestos";
  const desc = "Generador de presupuestos de obra — FECON · Febre Construcciones";
  const img = `${origin}/opengraph-image`;
  return `<!DOCTYPE html><html lang="es-AR"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:image" content="${img}"/>
<meta property="og:url" content="${url}"/>
<meta property="og:site_name" content="FECON · Febre Construcciones"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${title}"/>
<meta name="twitter:description" content="${desc}"/>
<meta name="twitter:image" content="${img}"/>
</head><body style="font-family:sans-serif;background:#211E1A;color:#FAF6EE;text-align:center;padding:48px">
Acceso privado — FECON Presupuestos
</body></html>`;
}

export function middleware(req: NextRequest) {
  const USER = process.env.PRESUPUESTOS_USER;
  const PASS = process.env.PRESUPUESTOS_PASS;

  // Sin credenciales configuradas no se entra, pero se explica por qué: es
  // preferible quedarse afuera un minuto a dejar la puerta abierta.
  if (!USER || !PASS) {
    return new NextResponse(
      "Falta configurar PRESUPUESTOS_USER y PRESUPUESTOS_PASS en las variables " +
        "de entorno (Vercel → Settings → Environment Variables). Hasta " +
        "entonces esta sección queda cerrada.",
      { status: 503, headers: { "cache-control": "no-store" } }
    );
  }

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const decoded = atob(auth.slice(6));
    const sep = decoded.indexOf(":");
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (user === USER && pass === PASS) {
      return NextResponse.next();
    }
  }

  const esPresupuestos = req.nextUrl.pathname.startsWith("/presupuestos");

  // Bots de preview: página pública solo con OpenGraph (sin la herramienta).
  // Solo en /presupuestos — la base de trabajadores no se muestra ni en preview.
  const ua = req.headers.get("user-agent") || "";
  if (esPresupuestos && BOT_RE.test(ua)) {
    return new NextResponse(
      previewHtml(req.nextUrl.origin, req.nextUrl.href),
      { status: 200, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  const zona = esPresupuestos ? "Presupuestos" : "Trabajadores";
  // Un solo realm ("FECON Privado") para las dos zonas: así el navegador pide
  // la clave una vez sola y sirve para ambas.
  return new NextResponse(`Acceso restringido — FECON ${zona}`, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="FECON Privado", charset="UTF-8"',
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
