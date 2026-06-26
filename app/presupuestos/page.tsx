import type { Metadata } from "next";
import { getCatalogo } from "@/lib/presupuestos/db";
import { PresupuestoBuilder } from "./presupuesto-builder";

export const metadata: Metadata = {
  title: "FECON · Generador de presupuestos",
  robots: { index: false, follow: false },
};

// Siempre fresco: refleja los precios actuales del catálogo en Neon.
export const dynamic = "force-dynamic";

export default async function PresupuestosPage() {
  const catalogo = await getCatalogo();
  return <PresupuestoBuilder catalogo={catalogo} />;
}
