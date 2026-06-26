// Acceso a la base Neon (Postgres) para el catálogo de presupuestos.
// Solo se usa del lado del servidor (server components y server actions).

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import {
  type FilaCatalogo,
  type ItemCatalogo,
  type TipoPresupuesto,
  SEED,
  SEED_ITEMS,
} from "./catalog";

let _sql: NeonQueryFunction<false, false> | null | undefined;

function sqlClient(): NeonQueryFunction<false, false> | null {
  if (_sql === undefined) {
    const url = process.env.DATABASE_URL;
    _sql = url ? neon(url) : null;
  }
  return _sql;
}

export function hayBaseDeDatos(): boolean {
  return !!process.env.DATABASE_URL;
}

const TIPOS_VALIDOS: TipoPresupuesto[] = ["casa_desde_0", "remodelacion"];

type Row = {
  id: number | string;
  tipo: string;
  categoria: string;
  item: string;
  unidad: string;
  cantidad: string | number;
  materiales: string | number;
  mano_obra: string | number;
};

function rowToItem(r: Row): ItemCatalogo {
  return {
    id: String(r.id),
    tipo: (TIPOS_VALIDOS.includes(r.tipo as TipoPresupuesto)
      ? r.tipo
      : "casa_desde_0") as TipoPresupuesto,
    categoria: r.categoria,
    item: r.item,
    unidad: r.unidad,
    cantidad: Number(r.cantidad) || 0,
    materiales: Number(r.materiales) || 0,
    manoObra: Number(r.mano_obra) || 0,
  };
}

/**
 * Catálogo para mostrar. Lee de Neon; si no hay base o falla (p. ej. la tabla
 * todavía no existe), usa el SEED local.
 */
export async function getCatalogo(): Promise<ItemCatalogo[]> {
  const sql = sqlClient();
  if (!sql) return SEED_ITEMS;
  try {
    const rows = (await sql`
      SELECT id, tipo, categoria, item, unidad, cantidad, materiales, mano_obra
      FROM catalogo
      ORDER BY orden, id
    `) as Row[];
    return rows.length ? rows.map(rowToItem) : SEED_ITEMS;
  } catch (err) {
    console.error("[presupuestos] Neon no respondió, uso catálogo local:", err);
    return SEED_ITEMS;
  }
}

/** Catálogo para el panel de edición. */
export async function listCatalogo(): Promise<ItemCatalogo[]> {
  return getCatalogo();
}

function sanear(items: FilaCatalogo[]): FilaCatalogo[] {
  return items
    .map((it) => ({
      tipo: TIPOS_VALIDOS.includes(it.tipo) ? it.tipo : "casa_desde_0",
      categoria: (it.categoria ?? "").trim() || "Sin rubro",
      item: (it.item ?? "").trim(),
      unidad: (it.unidad ?? "").trim() || "u",
      cantidad: Math.max(0, Number(it.cantidad) || 0),
      materiales: Math.max(0, Number(it.materiales) || 0),
      manoObra: Math.max(0, Number(it.manoObra) || 0),
    }))
    .filter((it) => it.item.length > 0);
}

/**
 * Reemplaza TODO el catálogo por la lista recibida, en una transacción.
 * Recrea la tabla (DROP + CREATE) para autosanar el esquema en producción.
 * El orden de la lista define el orden de visualización.
 */
export async function guardarCatalogo(items: FilaCatalogo[]): Promise<number> {
  const sql = sqlClient();
  if (!sql) throw new Error("No hay base de datos configurada (DATABASE_URL).");

  const filas = sanear(items);
  if (filas.length === 0) {
    throw new Error(
      "El catálogo quedaría vacío. Agregá al menos un ítem con nombre."
    );
  }

  await sql.transaction([
    sql`DROP TABLE IF EXISTS catalogo`,
    sql`
      CREATE TABLE catalogo (
        id BIGSERIAL PRIMARY KEY,
        tipo TEXT NOT NULL,
        categoria TEXT NOT NULL,
        item TEXT NOT NULL,
        unidad TEXT NOT NULL DEFAULT 'u',
        cantidad NUMERIC NOT NULL DEFAULT 1,
        materiales NUMERIC NOT NULL DEFAULT 0,
        mano_obra NUMERIC NOT NULL DEFAULT 0,
        orden INTEGER NOT NULL DEFAULT 0,
        actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `,
    ...filas.map(
      (it, i) => sql`
        INSERT INTO catalogo
          (tipo, categoria, item, unidad, cantidad, materiales, mano_obra, orden)
        VALUES
          (${it.tipo}, ${it.categoria}, ${it.item}, ${it.unidad},
           ${it.cantidad}, ${it.materiales}, ${it.manoObra}, ${i})
      `
    ),
  ]);

  return filas.length;
}

/** Restaura el catálogo de ejemplo (SEED). */
export async function restaurarEjemplos(): Promise<number> {
  return guardarCatalogo(SEED);
}
