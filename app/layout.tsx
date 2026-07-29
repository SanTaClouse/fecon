import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Schibsted_Grotesk,
  Space_Mono,
} from "next/font/google";
import "./globals.css";

// Fuentes vía next/font para evitar CLS.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const text = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-text",
  display: "swap",
});
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

// OJO: tiene que ser el dominio CANÓNICO, con www. El apex (fecon.com.ar)
// responde 308 hacia acá, y los bots de preview —WhatsApp entre ellos— no
// siguen el redirect cuando bajan la og:image: ven el 308 y no muestran nada.
// De este valor salen og:url, og:image y el canonical de todas las páginas.
const SITE = "https://www.fecon.com.ar";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "FECON · Constructora en Santa Fe — casas, remodelaciones y techos de tejas",
  description:
    "Febre Construcciones (FECON): constructora en Santa Fe con 16 años de oficio. Casas llave en mano, remodelaciones integrales y especialistas en techos de tejas. Equipo propio y trato directo con el dueño. Pedí presupuesto por WhatsApp.",
  keywords: [
    "constructora Santa Fe",
    "techos de tejas Santa Fe",
    "casas llave en mano",
    "remodelaciones Santa Fe",
    "FECON",
    "Febre Construcciones",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE,
    siteName: "FECON · Febre Construcciones",
    title: "FECON · Constructora en Santa Fe — techos de tejas y casas de cero",
    description:
      "16 años de oficio. Casas llave en mano, remodelaciones y especialistas en techos de tejas en Santa Fe. Equipo propio, trato directo con el dueño.",
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    title: "FECON",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#211E1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es-AR"
      className={`${display.variable} ${text.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
