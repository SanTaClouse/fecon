import type { Metadata } from "next";
import { getCatalogo } from "@/lib/presupuestos/catalog";
import { PresupuestoBuilder } from "./presupuesto-builder";

export const metadata: Metadata = {
  title: "FECON · Generador de presupuestos",
  robots: { index: false, follow: false },
};

export default async function PresupuestosPage() {
  const catalogo = await getCatalogo();
  return <PresupuestoBuilder catalogo={catalogo} />;
}
