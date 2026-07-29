import type { Metadata } from "next";
import { hayBaseDeDatos, listarPostulaciones } from "@/lib/trabajadores/db";
import { TrabajadoresClient } from "./trabajadores-client";

export const metadata: Metadata = {
  title: "FECON · Trabajadores por ciudad",
  robots: { index: false, follow: false },
};

// Siempre fresco: es una bandeja de entrada, no una página cacheable.
export const dynamic = "force-dynamic";

export default async function TrabajadoresPage() {
  const lista = await listarPostulaciones();
  return <TrabajadoresClient inicial={lista} conBase={hayBaseDeDatos()} />;
}
