// Catálogo de ítems para el generador de presupuestos.
//
// Dos MODOS de ítem (clave para que los números sean razonables):
//
//   • "medicion": se cobra por  cantidad × precio unitario.
//       Ej: revoque (m²), bocas de electricidad (boca), pintura (m²).
//       El precio unitario en $ tiene sentido y se muestra.
//
//   • "tarea": se cobra como partida por sector, con  Materiales $ + Mano de
//       obra $ = total. NO se multiplica por cantidad ni tiene "unitario".
//       Ej: instalación de agua/cloaca/gas por sector (baño, cocina, lavadero).
//       Es como Martín lo pasa en su Excel.
//
// HOY los datos viven en SEED (de ejemplo — editá libre). El paso siguiente es
// pasarlos a una base Neon (Postgres) con un panel para editarlos desde la web.

export type TipoPresupuesto = "casa_desde_0" | "remodelacion";
export type ModoItem = "medicion" | "tarea";

export type FilaCatalogo = {
  tipo: TipoPresupuesto;
  categoria: string;
  item: string;
  modo: ModoItem;
  unidad: string; // medición: "m²", "ml"… · tarea: "tarea"
  precioUnitario: number; // medición
  materiales: number; // tarea (valor por defecto sugerido)
  manoObra: number; // tarea (valor por defecto sugerido)
};

/** Fila del catálogo con un id estable (asignado al cargar). */
export type ItemCatalogo = FilaCatalogo & { id: string };

export const TIPOS: {
  value: TipoPresupuesto;
  label: string;
  desc: string;
}[] = [
  {
    value: "casa_desde_0",
    label: "Casa desde cero",
    desc: "Obra nueva — del replanteo del terreno a las terminaciones",
  },
  {
    value: "remodelacion",
    label: "Remodelación",
    desc: "Refacción y puesta en valor de lo existente",
  },
];

// ───────────────────────── Catálogo de ejemplo ─────────────────────────
// Precios en pesos (ARS), valores de referencia. Reemplazalos por los reales.

/** Ítem por medición: cantidad × precio unitario. */
const med = (
  tipo: TipoPresupuesto,
  categoria: string,
  item: string,
  unidad: string,
  precioUnitario: number
): FilaCatalogo => ({
  tipo,
  categoria,
  item,
  modo: "medicion",
  unidad,
  precioUnitario,
  materiales: 0,
  manoObra: 0,
});

/** Ítem por tarea/sector: Materiales + Mano de obra = total. */
const tarea = (
  tipo: TipoPresupuesto,
  categoria: string,
  item: string,
  materiales: number,
  manoObra: number
): FilaCatalogo => ({
  tipo,
  categoria,
  item,
  modo: "tarea",
  unidad: "tarea",
  precioUnitario: 0,
  materiales,
  manoObra,
});

const SEED: FilaCatalogo[] = [
  // ===================== CASA DESDE CERO =====================
  med("casa_desde_0", "Trabajos preliminares", "Limpieza y nivelación del terreno", "m²", 3500),
  med("casa_desde_0", "Trabajos preliminares", "Replanteo y marcación de obra", "m²", 4200),
  tarea("casa_desde_0", "Trabajos preliminares", "Obrador, cerco y conexión provisoria", 520000, 330000),

  med("casa_desde_0", "Movimiento de suelos", "Excavación de zapatas y vigas", "m³", 18000),
  med("casa_desde_0", "Movimiento de suelos", "Relleno y compactación", "m³", 14000),

  med("casa_desde_0", "Fundaciones", "Hormigón de zapatas", "m³", 165000),
  med("casa_desde_0", "Fundaciones", "Vigas de fundación / encadenado inferior", "ml", 28000),
  med("casa_desde_0", "Fundaciones", "Platea de hormigón armado", "m²", 42000),

  med("casa_desde_0", "Estructura de H°A°", "Columnas de hormigón armado", "ml", 32000),
  med("casa_desde_0", "Estructura de H°A°", "Vigas de encadenado superior", "ml", 30000),
  med("casa_desde_0", "Estructura de H°A°", "Losa de hormigón", "m²", 58000),

  med("casa_desde_0", "Mampostería", "Muro exterior ladrillo hueco 18", "m²", 26000),
  med("casa_desde_0", "Mampostería", "Tabique interior ladrillo hueco 12", "m²", 19000),

  med("casa_desde_0", "Cubierta / Techo", "Estructura de madera para techo", "m²", 38000),
  med("casa_desde_0", "Cubierta / Techo", "Aislación y membrana", "m²", 16000),
  med("casa_desde_0", "Cubierta / Techo", "Cubierta de tejas colocada", "m²", 49000),

  // Instalaciones de agua/cloaca/gas → POR TAREA (por sector), no por boca.
  tarea("casa_desde_0", "Instalación sanitaria", "Agua fría y caliente — baño", 480000, 360000),
  tarea("casa_desde_0", "Instalación sanitaria", "Agua fría y caliente — cocina y lavadero", 420000, 300000),
  tarea("casa_desde_0", "Instalación sanitaria", "Desagües cloacales y pluviales — vivienda", 520000, 420000),
  med("casa_desde_0", "Instalación sanitaria", "Provisión y colocación de artefactos", "unidad", 95000),

  med("casa_desde_0", "Instalación eléctrica", "Bocas (luz, toma y datos)", "boca", 23000),
  med("casa_desde_0", "Instalación eléctrica", "Tablero principal y puesta a tierra", "unidad", 280000),

  tarea("casa_desde_0", "Instalación de gas", "Cañería y conexión de artefactos de gas", 360000, 320000),

  med("casa_desde_0", "Revoques", "Revoque grueso y fino interior", "m²", 12500),
  med("casa_desde_0", "Revoques", "Revoque exterior impermeable", "m²", 15000),

  med("casa_desde_0", "Contrapisos y carpetas", "Contrapiso", "m²", 11000),
  med("casa_desde_0", "Contrapisos y carpetas", "Carpeta de nivelación", "m²", 8500),

  med("casa_desde_0", "Pisos y revestimientos", "Piso porcelanato colocado", "m²", 34000),
  med("casa_desde_0", "Pisos y revestimientos", "Revestimiento de baño/cocina", "m²", 31000),
  med("casa_desde_0", "Pisos y revestimientos", "Zócalos", "ml", 6500),

  med("casa_desde_0", "Cielorrasos", "Cielorraso de placa de yeso", "m²", 21000),

  med("casa_desde_0", "Carpintería", "Puerta de entrada", "unidad", 420000),
  med("casa_desde_0", "Carpintería", "Puertas placa interiores", "unidad", 165000),
  med("casa_desde_0", "Carpintería", "Ventanas de aluminio con vidrio", "m²", 95000),
  med("casa_desde_0", "Carpintería", "Placard a medida", "ml", 240000),

  med("casa_desde_0", "Pintura", "Látex interior (2 manos)", "m²", 5200),
  med("casa_desde_0", "Pintura", "Látex exterior", "m²", 6800),
  med("casa_desde_0", "Pintura", "Esmalte en aberturas", "m²", 7500),

  med("casa_desde_0", "Cocina y terminaciones", "Mesada de granito/cuarzo", "ml", 185000),
  tarea("casa_desde_0", "Cocina y terminaciones", "Griferías y accesorios — colocación", 380000, 160000),
  tarea("casa_desde_0", "Cocina y terminaciones", "Limpieza final de obra", 60000, 120000),

  // ===================== REMODELACIÓN =====================
  med("remodelacion", "Demolición y retiro", "Retiro de pisos existentes", "m²", 6500),
  med("remodelacion", "Demolición y retiro", "Demolición de tabiques", "m²", 9000),
  med("remodelacion", "Demolición y retiro", "Picado de revestimientos", "m²", 5500),
  med("remodelacion", "Demolición y retiro", "Retiro de escombros (volquete)", "unidad", 85000),

  med("remodelacion", "Albañilería", "Apertura / cierre de vanos", "unidad", 145000),
  med("remodelacion", "Albañilería", "Tabiques nuevos", "m²", 19000),
  med("remodelacion", "Albañilería", "Reparación de muros y revoques", "m²", 13000),

  // Instalaciones → POR TAREA (por sector).
  tarea("remodelacion", "Instalación sanitaria", "Renovación de agua — baño", 380000, 320000),
  tarea("remodelacion", "Instalación sanitaria", "Renovación de agua — cocina y lavadero", 340000, 280000),
  tarea("remodelacion", "Instalación sanitaria", "Renovación de desagües cloacales", 300000, 320000),

  med("remodelacion", "Instalación eléctrica", "Actualización de tablero", "unidad", 240000),
  med("remodelacion", "Instalación eléctrica", "Bocas nuevas (luz y toma)", "boca", 24000),

  med("remodelacion", "Pisos y revestimientos", "Colocación de piso porcelanato", "m²", 34000),
  med("remodelacion", "Pisos y revestimientos", "Revestimiento de baño/cocina", "m²", 31000),
  med("remodelacion", "Pisos y revestimientos", "Carpeta de nivelación autonivelante", "m²", 12000),

  med("remodelacion", "Cielorrasos", "Cielorraso de durlock", "m²", 22000),
  med("remodelacion", "Cielorrasos", "Buña perimetral / molduras", "ml", 7800),

  med("remodelacion", "Carpintería", "Cambio de aberturas", "unidad", 195000),
  med("remodelacion", "Carpintería", "Puertas placa nuevas", "unidad", 165000),
  med("remodelacion", "Carpintería", "Placard / amoblamiento a medida", "ml", 240000),

  med("remodelacion", "Pintura", "Enduido completo de paredes", "m²", 6000),
  med("remodelacion", "Pintura", "Látex interior (2 manos)", "m²", 5200),
  med("remodelacion", "Pintura", "Esmalte en aberturas", "m²", 7500),

  med("remodelacion", "Cocina y baño", "Mesada y bajo mesada", "ml", 210000),
  med("remodelacion", "Cocina y baño", "Mueble bajo mesada", "ml", 160000),
  tarea("remodelacion", "Cocina y baño", "Colocación de griferías y artefactos", 280000, 180000),

  med("remodelacion", "Terminaciones", "Colocación de zócalos", "ml", 6500),
  tarea("remodelacion", "Terminaciones", "Limpieza final de obra", 50000, 90000),
];

// ───────────────────────── Carga del catálogo ─────────────────────────

export async function getCatalogo(): Promise<ItemCatalogo[]> {
  const filas = await cargarFilas();
  return filas.map((f, i) => ({ ...f, id: String(i) }));
}

async function cargarFilas(): Promise<FilaCatalogo[]> {
  // TODO (paso siguiente): leer desde Neon cuando esté el panel.
  const url = process.env.PRESUPUESTOS_SHEET_CSV;
  if (!url) return SEED;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const filas = parseCsv(await res.text());
    return filas.length ? filas : SEED;
  } catch (err) {
    console.error(
      "[presupuestos] No se pudo leer la planilla, uso el catálogo local:",
      err
    );
    return SEED;
  }
}

// ───────────────────────── Parser de CSV ─────────────────────────
// Columnas: tipo, categoria, item, modo, unidad, precio_unitario, materiales,
// mano_obra. (modo, materiales y mano_obra son opcionales; modo por defecto
// "medicion".)

function parseCsv(text: string): FilaCatalogo[] {
  const rows = splitRows(text);
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (name: string) => header.indexOf(name);
  const iTipo = col("tipo");
  const iCat = col("categoria");
  const iItem = col("item");
  if (iTipo < 0 || iCat < 0 || iItem < 0) return [];
  const iModo = col("modo");
  const iUnidad = col("unidad");
  const iPrecio = col("precio_unitario");
  const iMat = col("materiales");
  const iMano = col("mano_obra");

  const out: FilaCatalogo[] = [];
  for (let r = 1; r < rows.length; r++) {
    const cols = rows[r];
    const at = (i: number) => (i >= 0 ? cols[i] ?? "" : "");
    const tipo = normTipo(at(iTipo));
    const item = at(iItem).trim();
    if (!tipo || !item) continue;
    const modo = normModo(at(iModo));
    out.push({
      tipo,
      categoria: at(iCat).trim() || "Otros",
      item,
      modo,
      unidad: at(iUnidad).trim() || (modo === "tarea" ? "tarea" : "u"),
      precioUnitario: parseNum(at(iPrecio)),
      materiales: parseNum(at(iMat)),
      manoObra: parseNum(at(iMano)),
    });
  }
  return out;
}

function splitRows(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  const src = text.replace(/\r\n?/g, "\n");

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function normTipo(raw: string): TipoPresupuesto | null {
  const s = norm(raw);
  if (s.startsWith("casa")) return "casa_desde_0";
  if (s.startsWith("remod")) return "remodelacion";
  return null;
}

function normModo(raw: string): ModoItem {
  const s = norm(raw);
  if (s.startsWith("tarea") || s.startsWith("partida") || s.startsWith("sector")) {
    return "tarea";
  }
  return "medicion";
}

function norm(raw: string): string {
  return (raw ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function parseNum(raw: string): number {
  let s = (raw ?? "").replace(/[^\d.,-]/g, "").trim();
  if (!s) return 0;
  // Formato es-AR: "1.234.567,89" → punto miles, coma decimal.
  if (s.includes(".") && s.includes(",")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (s.includes(",")) {
    s = s.replace(",", ".");
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}
