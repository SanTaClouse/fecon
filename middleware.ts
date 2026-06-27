import { NextRequest, NextResponse } from "next/server";

// Protege /presupuestos con una clave simple (HTTP Basic Auth). El navegador
// pide usuario y contraseña una sola vez y las recuerda.
//
// Credenciales: se pueden cambiar sin tocar el código con las variables de
// entorno PRESUPUESTOS_USER y PRESUPUESTOS_PASS (en Vercel → Settings →
// Environment Variables). Si no están, se usan los valores por defecto.
//
// Excepción: los bots de "link preview" (WhatsApp, Facebook, etc.) reciben una
// mini-página pública SOLO con los tags de OpenGraph (sin la herramienta), así
// el link muestra preview lindo sin exponer nada ni pedir la clave a un bot.

export const config = {
  matcher: ["/presupuestos", "/presupuestos/:path*"],
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
  const USER = process.env.PRESUPUESTOS_USER || "fecon";
  const PASS = process.env.PRESUPUESTOS_PASS || "Fecon2026";

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

  // Bots de preview: página pública solo con OpenGraph (sin la herramienta).
  const ua = req.headers.get("user-agent") || "";
  if (BOT_RE.test(ua)) {
    return new NextResponse(
      previewHtml(req.nextUrl.origin, req.nextUrl.href),
      { status: 200, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  return new NextResponse("Acceso restringido — FECON Presupuestos", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="FECON Presupuestos", charset="UTF-8"',
    },
  });
}
