import { NextRequest, NextResponse } from "next/server";

// Protege /presupuestos con una clave simple (HTTP Basic Auth). El navegador
// pide usuario y contraseña una sola vez y las recuerda.
//
// Credenciales: se pueden cambiar sin tocar el código con las variables de
// entorno PRESUPUESTOS_USER y PRESUPUESTOS_PASS (en Vercel → Settings →
// Environment Variables). Si no están, se usan los valores por defecto.

export const config = {
  matcher: ["/presupuestos", "/presupuestos/:path*"],
};

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

  return new NextResponse("Acceso restringido — FECON Presupuestos", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="FECON Presupuestos", charset="UTF-8"',
    },
  });
}
