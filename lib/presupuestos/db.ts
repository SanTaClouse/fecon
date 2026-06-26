// Acceso a la base Neon (Postgres) para el catálogo de presupuestos.
// Solo se usa del lado del servidor (server components y server actions).

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import {
  type FilaCatalogo,
  type ItemCatalogo,
  type ModoItem,
  type TipoPresupuesto,
  SEED,
  SEED_ITEMS,
} from "./catalog";

let _sql: NeonQueryFunction<false, false> | null | undefined;

/** Cliente SQL de Neon (o null si no hay DATABASE_URL configurada). */
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
const MODOS_VALIDOS: ModoItem[] = ["medicion", "tarea"];

type Row = {
  id: number | string;
  tipo: string;
  categoria: string;
  item: string;
  modo: string;
  unidad: string;
  precio_unitario: string | number;
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
    modo: (MODOS_VALIDOS.includes(r.modo as ModoItem)
      ? r.modo
      : "medicion") as ModoItem,
    unidad: r.unidad,
    precioUnitario: Number(r.precio_unitario) || 0,
    materiales: Number(r.materiales) || 0,
    manoObra: Number(r.mano_obra) || 0,
  };
}

/**
 * Catálogo para mostrar. Lee de Neon; si no hay base o falla, usa el SEED local
 * (así el sitio nunca queda sin catálogo).
 */
export async function getCatalogo(): Promise<ItemCatalogo[]> {
  const sql = sqlClient();
  if (!sql) return SEED_ITEMS;
  try {
    const rows = (await sql`
      SELECT id, tipo, categoria, item, modo, unidad,
             precio_unitario, materiales, mano_obra
      FROM catalogo
      ORDER BY orden, id
    `) as Row[];
    return rows.length ? rows.map(rowToItem) : SEED_ITEMS;
  } catch (err) {
    console.error("[presupuestos] Neon no respondió, uso catálogo local:", err);
    return SEED_ITEMS;
  }
}

/** Catálogo para el panel de edición (igual que getCatalogo). */
export async function listCatalogo(): Promise<ItemCatalogo[]> {
  return getCatalogo();
}

/** Limpia y normaliza las filas que llegan del panel antes de guardar. */
function sanear(items: FilaCatalogo[]): FilaCatalogo[] {
  return items
    .map((it) => {
      const tipo = TIPOS_VALIDOS.includes(it.tipo) ? it.tipo : "casa_desde_0";
      const modo = MODOS_VALIDOS.includes(it.modo) ? it.modo : "medicion";
      return {
        tipo,
        categoria: (it.categoria ?? "").trim() || "Sin categoría",
        item: (it.item ?? "").trim(),
        modo,
        unidad: (it.unidad ?? "").trim() || (modo === "tarea" ? "tarea" : "u"),
        precioUnitario: Math.max(0, Number(it.precioUnitario) || 0),
        materiales: Math.max(0, Number(it.materiales) || 0),
        manoObra: Math.max(0, Number(it.manoObra) || 0),
      };
    })
    .filter((it) => it.item.length > 0); // descarta filas sin nombre
}

/**
 * Reemplaza TODO el catálogo por la lista recibida, en una transacción
 * (todo o nada). El orden de la lista define el orden de visualización.
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
    // Crea la tabla si aún no existe (auto-bootstrap en producción).
    sql`
      CREATE TABLE IF NOT EXISTS catalogo (
        id BIGSERIAL PRIMARY KEY,
        tipo TEXT NOT NULL,
        categoria TEXT NOT NULL,
        item TEXT NOT NULL,
        modo TEXT NOT NULL DEFAULT 'medicion',
        unidad TEXT NOT NULL DEFAULT 'u',
        precio_unitario NUMERIC NOT NULL DEFAULT 0,
        materiales NUMERIC NOT NULL DEFAULT 0,
        mano_obra NUMERIC NOT NULL DEFAULT 0,
        orden INTEGER NOT NULL DEFAULT 0,
        actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `,
    sql`DELETE FROM catalogo`,
    ...filas.map(
      (it, i) => sql`
        INSERT INTO catalogo
          (tipo, categoria, item, modo, unidad, precio_unitario, materiales, mano_obra, orden)
        VALUES
          (${it.tipo}, ${it.categoria}, ${it.item}, ${it.modo}, ${it.unidad},
           ${it.precioUnitario}, ${it.materiales}, ${it.manoObra}, ${i})
      `
    ),
  ]);

  return filas.length;
}

/** Restaura el catálogo de ejemplo (SEED). */
export async function restaurarEjemplos(): Promise<number> {
  return guardarCatalogo(SEED);
}
