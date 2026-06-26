import type { MetadataRoute } from "next";

// Permite "Agregar a pantalla de inicio" con nombre e ícono prolijos.
// start_url apunta al generador de presupuestos (pide la clave al abrir).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FECON · Presupuestos",
    short_name: "FECON",
    description:
      "Generador de presupuestos de obra — FECON · Febre Construcciones",
    start_url: "/presupuestos",
    scope: "/",
    display: "standalone",
    background_color: "#FAF6EE",
    theme_color: "#211E1A",
    lang: "es-AR",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      {
        src: "/icon-1080.png",
        type: "image/png",
        sizes: "1080x1080",
        purpose: "any",
      },
    ],
  };
}
