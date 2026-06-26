import type { Metadata } from "next";
import { hayBaseDeDatos, listCatalogo } from "@/lib/presupuestos/db";
import { AdminClient } from "./admin-client";

export const metadata: Metadata = {
  title: "FECON · Editar catálogo de presupuestos",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const catalogo = await listCatalogo();
  return <AdminClient catalogo={catalogo} conBase={hayBaseDeDatos()} />;
}
