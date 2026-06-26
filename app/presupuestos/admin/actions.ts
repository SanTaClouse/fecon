"use server";

import { revalidatePath } from "next/cache";
import type { FilaCatalogo } from "@/lib/presupuestos/catalog";
import { guardarCatalogo, restaurarEjemplos } from "@/lib/presupuestos/db";

export type GuardarResult =
  | { ok: true; count: number }
  | { ok: false; error: string };

function msgError(err: unknown): string {
  return err instanceof Error ? err.message : "Error desconocido";
}

export async function guardarCatalogoAction(
  items: FilaCatalogo[]
): Promise<GuardarResult> {
  try {
    const count = await guardarCatalogo(items);
    revalidatePath("/presupuestos");
    revalidatePath("/presupuestos/admin");
    return { ok: true, count };
  } catch (err) {
    return { ok: false, error: msgError(err) };
  }
}

export async function restaurarEjemplosAction(): Promise<GuardarResult> {
  try {
    const count = await restaurarEjemplos();
    revalidatePath("/presupuestos");
    revalidatePath("/presupuestos/admin");
    return { ok: true, count };
  } catch (err) {
    return { ok: false, error: msgError(err) };
  }
}
