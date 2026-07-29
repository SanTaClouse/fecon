"use server";

import { revalidatePath } from "next/cache";
import { type FormPostulacion, validar } from "@/lib/trabajadores/model";
import { guardarPostulacion, hayBaseDeDatos } from "@/lib/trabajadores/db";

export type AnotarseResult =
  | { ok: true; actualizado: boolean }
  | { ok: false; error: string };

export async function anotarseAction(
  form: FormPostulacion,
  // Campo trampa: invisible para las personas, los bots lo completan.
  honeypot: string
): Promise<AnotarseResult> {
  // Si el bot cayó en la trampa, fingimos éxito y no guardamos nada.
  if (honeypot.trim() !== "") return { ok: true, actualizado: false };

  if (!hayBaseDeDatos()) {
    return {
      ok: false,
      error: "El formulario no está disponible en este momento. Escribinos por WhatsApp.",
    };
  }

  const v = validar(form);
  if (!v.ok) return { ok: false, error: v.error };

  try {
    const { creado } = await guardarPostulacion(v.datos);
    revalidatePath("/trabajadores");
    return { ok: true, actualizado: !creado };
  } catch (err) {
    console.error("[trabaja-con-nosotros] no se pudo guardar la postulación:", err);
    return {
      ok: false,
      error: "No pudimos guardar tus datos. Probá de nuevo en un rato.",
    };
  }
}
