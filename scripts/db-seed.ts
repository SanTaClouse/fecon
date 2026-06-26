// Inicializa la base Neon: crea la tabla `catalogo` y, si está vacía, la siembra
// con el catálogo de ejemplo (SEED).
//
// Uso (una sola vez, en local):
//   npx tsx scripts/db-seed.ts
//
// Lee la connection string de .env.local (DATABASE_URL_UNPOOLED o DATABASE_URL).

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { SEED } from "../lib/presupuestos/catalog";

// ── Cargar variables de .env.local ──
try {
  const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    let v = m[2];
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
} catch {
  console.warn("No pude leer .env.local; uso las variables del entorno.");
}

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error("✗ Falta DATABASE_URL / DATABASE_URL_UNPOOLED en .env.local");
  process.exit(1);
}

const sql = neon(url);

async function main() {
  await sql`
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
  `;
  console.log("✓ Tabla `catalogo` lista.");

  const rows = (await sql`SELECT count(*)::int AS count FROM catalogo`) as {
    count: number;
  }[];
  if (rows[0].count > 0) {
    console.log(
      `La tabla ya tiene ${rows[0].count} ítems — no se siembra. Editá desde el panel.`
    );
    return;
  }

  await sql.transaction(
    SEED.map(
      (it, i) => sql`
        INSERT INTO catalogo
          (tipo, categoria, item, modo, unidad, precio_unitario, materiales, mano_obra, orden)
        VALUES
          (${it.tipo}, ${it.categoria}, ${it.item}, ${it.modo}, ${it.unidad},
           ${it.precioUnitario}, ${it.materiales}, ${it.manoObra}, ${i})
      `
    )
  );
  console.log(`✓ Sembrados ${SEED.length} ítems en Neon.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("✗ Error sembrando la base:", err);
    process.exit(1);
  });
