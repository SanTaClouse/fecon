// Acceso a Neon (Postgres) para la bolsa de trabajo.
// Solo del lado del servidor (server components y server actions).
//
// IMPORTANTE: a diferencia del catálogo de presupuestos, acá NUNCA se hace
// DROP TABLE. Son datos de personas que se anotaron: solo se agrega, se edita
// el estado/nota o se borra una fila puntual desde el panel.

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import {
  type DatosValidados,
  type EstadoPostulacion,
  type Postulacion,
  edadDesde,
} from "./model";

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

function requireSql(): NeonQueryFunction<false, false> {
  const sql = sqlClient();
  if (!sql) throw new Error("No hay base de datos configurada (DATABASE_URL).");
  return sql;
}

let tablaLista = false;

/** Crea la tabla la primera vez. Idempotente y sin destruir nada. */
async function asegurarTabla(sql: NeonQueryFunction<false, false>): Promise<void> {
  if (tablaLista) return;
  await sql`
    CREATE TABLE IF NOT EXISTS trabajadores (
      id BIGSERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      nacimiento DATE,
      telefono TEXT NOT NULL,
      telefono_norm TEXT NOT NULL UNIQUE,
      provincia TEXT NOT NULL,
      ciudad TEXT NOT NULL,
      oficio TEXT NOT NULL,
      experiencia INTEGER NOT NULL DEFAULT 0,
      descripcion TEXT NOT NULL DEFAULT '',
      herramientas BOOLEAN NOT NULL DEFAULT false,
      movilidad BOOLEAN NOT NULL DEFAULT false,
      viaja BOOLEAN NOT NULL DEFAULT false,
      estado TEXT NOT NULL DEFAULT 'nuevo',
      notas TEXT NOT NULL DEFAULT '',
      creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
      actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS trabajadores_zona_idx
      ON trabajadores (provincia, ciudad)
  `;
  tablaLista = true;
}

type Row = {
  id: number | string;
  nombre: string;
  nacimiento: string | Date | null;
  telefono: string;
  telefono_norm: string;
  provincia: string;
  ciudad: string;
  oficio: string;
  experiencia: number | string;
  descripcion: string;
  herramientas: boolean;
  movilidad: boolean;
  viaja: boolean;
  estado: string;
  notas: string;
  creado_en: string | Date;
};

const ESTADOS_VALIDOS: EstadoPostulacion[] = ["nuevo", "contactado", "descartado"];

/** DATE de Postgres → "YYYY-MM-DD" sin correrse de día por zona horaria. */
function soloFecha(v: string | Date | null): string | null {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).slice(0, 10);
}

function rowToPostulacion(r: Row): Postulacion {
  const nacimiento = soloFecha(r.nacimiento);
  return {
    id: String(r.id),
    nombre: r.nombre,
    nacimiento,
    edad: edadDesde(nacimiento),
    telefono: r.telefono,
    telefonoNorm: r.telefono_norm,
    provincia: r.provincia,
    ciudad: r.ciudad,
    oficio: r.oficio,
    experiencia: Number(r.experiencia) || 0,
    descripcion: r.descripcion ?? "",
    herramientas: !!r.herramientas,
    movilidad: !!r.movilidad,
    viaja: !!r.viaja,
    estado: (ESTADOS_VALIDOS.includes(r.estado as EstadoPostulacion)
      ? r.estado
      : "nuevo") as EstadoPostulacion,
    notas: r.notas ?? "",
    creadoEn: (r.creado_en instanceof Date
      ? r.creado_en
      : new Date(r.creado_en)
    ).toISOString(),
  };
}

export type AltaResult = { creado: boolean };

/**
 * Guarda una postulación. Si el mismo teléfono ya estaba anotado, actualiza sus
 * datos en vez de duplicar (mantiene el estado y las notas privadas).
 */
export async function guardarPostulacion(d: DatosValidados): Promise<AltaResult> {
  const sql = requireSql();
  await asegurarTabla(sql);

  const rows = (await sql`
    INSERT INTO trabajadores
      (nombre, nacimiento, telefono, telefono_norm, provincia, ciudad, oficio,
       experiencia, descripcion, herramientas, movilidad, viaja)
    VALUES
      (${d.nombre}, ${d.nacimiento}, ${d.telefono}, ${d.telefonoNorm},
       ${d.provincia}, ${d.ciudad}, ${d.oficio}, ${d.experiencia},
       ${d.descripcion}, ${d.herramientas}, ${d.movilidad}, ${d.viaja})
    ON CONFLICT (telefono_norm) DO UPDATE SET
      nombre = EXCLUDED.nombre,
      nacimiento = EXCLUDED.nacimiento,
      telefono = EXCLUDED.telefono,
      provincia = EXCLUDED.provincia,
      ciudad = EXCLUDED.ciudad,
      oficio = EXCLUDED.oficio,
      experiencia = EXCLUDED.experiencia,
      descripcion = EXCLUDED.descripcion,
      herramientas = EXCLUDED.herramientas,
      movilidad = EXCLUDED.movilidad,
      viaja = EXCLUDED.viaja,
      actualizado_en = now()
    RETURNING (xmax = 0) AS creado
  `) as { creado: boolean }[];

  return { creado: !!rows[0]?.creado };
}

/** Todas las postulaciones, ordenadas por provincia → ciudad → más nueva. */
export async function listarPostulaciones(): Promise<Postulacion[]> {
  const sql = sqlClient();
  if (!sql) return [];
  try {
    await asegurarTabla(sql);
    const rows = (await sql`
      SELECT id, nombre, nacimiento, telefono, telefono_norm, provincia, ciudad,
             oficio, experiencia, descripcion, herramientas, movilidad, viaja,
             estado, notas, creado_en
      FROM trabajadores
      ORDER BY provincia, ciudad, creado_en DESC
    `) as Row[];
    return rows.map(rowToPostulacion);
  } catch (err) {
    console.error("[trabajadores] no se pudo leer la base:", err);
    return [];
  }
}

export async function actualizarEstado(
  id: string,
  estado: EstadoPostulacion
): Promise<void> {
  const sql = requireSql();
  await asegurarTabla(sql);
  if (!ESTADOS_VALIDOS.includes(estado)) throw new Error("Estado inválido.");
  await sql`
    UPDATE trabajadores
    SET estado = ${estado}, actualizado_en = now()
    WHERE id = ${id}
  `;
}

export async function actualizarNotas(id: string, notas: string): Promise<void> {
  const sql = requireSql();
  await asegurarTabla(sql);
  await sql`
    UPDATE trabajadores
    SET notas = ${notas.slice(0, 800)}, actualizado_en = now()
    WHERE id = ${id}
  `;
}

export async function eliminarPostulacion(id: string): Promise<void> {
  const sql = requireSql();
  await asegurarTabla(sql);
  await sql`DELETE FROM trabajadores WHERE id = ${id}`;
}
