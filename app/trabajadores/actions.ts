"use server";

import { revalidatePath } from "next/cache";
import type { EstadoPostulacion } from "@/lib/trabajadores/model";
import {
  actualizarEstado,
  actualizarNotas,
  eliminarPostulacion,
} from "@/lib/trabajadores/db";

export type AccionResult = { ok: true } | { ok: false; error: string };

function msgError(err: unknown): string {
  return err instanceof Error ? err.message : "Error desconocido";
}

export async function cambiarEstadoAction(
  id: string,
  estado: EstadoPostulacion
): Promise<AccionResult> {
  try {
    await actualizarEstado(id, estado);
    revalidatePath("/trabajadores");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: msgError(err) };
  }
}

export async function guardarNotasAction(
  id: string,
  notas: string
): Promise<AccionResult> {
  try {
    await actualizarNotas(id, notas);
    revalidatePath("/trabajadores");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: msgError(err) };
  }
}

export async function eliminarAction(id: string): Promise<AccionResult> {
  try {
    await eliminarPostulacion(id);
    revalidatePath("/trabajadores");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: msgError(err) };
  }
}
