import type { Metadata } from "next";
import { PostulacionForm } from "./postulacion-form";

const TITULO = "FECON · Trabajá con nosotros";
const DESC =
  "Dejá tus datos y tu oficio. Armamos una base de trabajadores por ciudad para tenerte en cuenta cuando salga una obra en tu zona.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESC,
  alternates: { canonical: "/trabaja-con-nosotros" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/trabaja-con-nosotros",
    siteName: "FECON · Febre Construcciones",
    title: TITULO,
    description: DESC,
  },
  twitter: { card: "summary_large_image", title: TITULO, description: DESC },
  // Es una convocatoria que se comparte por link, pero se indexa igual por si
  // alguien la googlea.
  robots: { index: true, follow: true },
};

// La página es estática (carga instantánea desde el CDN): el formulario manda
// los datos por server action, así que no hace falta render por request.
export default function TrabajaConNosotrosPage() {
  return <PostulacionForm />;
}
