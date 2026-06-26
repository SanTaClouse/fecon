// Catálogo de ítems para el generador de presupuestos.
//
// HOY: los datos viven en SEED (acá abajo). Son de EJEMPLO — editá libremente
// categorías, ítems, unidades y precios.
//
// MAÑANA (Google Sheet): cuando quieras que Martín edite precios desde una
// planilla, publicá la hoja como CSV (Archivo → Compartir → Publicar en la web
// → CSV) y guardá esa URL en la variable de entorno PRESUPUESTOS_SHEET_CSV
// (en Vercel: Settings → Environment Variables). La planilla debe tener estas
// columnas en la primera fila:
//
//     tipo | categoria | item | unidad | precio_unitario
//
// y en "tipo" cada fila va con  casa_desde_0  o  remodelacion.
// No hace falta tocar el código: si la variable existe, se usa la planilla;
// si no, se usa el catálogo local de abajo.

export type TipoPresupuesto = "casa_desde_0" | "remodelacion";

export type FilaCatalogo = {
  tipo: TipoPresupuesto;
  categoria: string;
  item: string;
  unidad: string;
  precioUnitario: number;
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
// Precios en pesos (ARS), valores de referencia para que veas el armador
// funcionando. Reemplazalos por los reales.

const c = (
  tipo: TipoPresupuesto,
  categoria: string,
  item: string,
  unidad: string,
  precioUnitario: number
): FilaCatalogo => ({ tipo, categoria, item, unidad, precioUnitario });

const SEED: FilaCatalogo[] = [
  // ===================== CASA DESDE CERO =====================
  c("casa_desde_0", "Trabajos preliminares", "Limpieza y nivelación del terreno", "m²", 3500),
  c("casa_desde_0", "Trabajos preliminares", "Replanteo y marcación de obra", "m²", 4200),
  c("casa_desde_0", "Trabajos preliminares", "Obrador, cerco y conexión provisoria", "global", 850000),

  c("casa_desde_0", "Movimiento de suelos", "Excavación de zapatas y vigas", "m³", 18000),
  c("casa_desde_0", "Movimiento de suelos", "Relleno y compactación", "m³", 14000),

  c("casa_desde_0", "Fundaciones", "Hormigón de zapatas", "m³", 165000),
  c("casa_desde_0", "Fundaciones", "Vigas de fundación / encadenado inferior", "ml", 28000),
  c("casa_desde_0", "Fundaciones", "Platea de hormigón armado", "m²", 42000),

  c("casa_desde_0", "Estructura de H°A°", "Columnas de hormigón armado", "ml", 32000),
  c("casa_desde_0", "Estructura de H°A°", "Vigas de encadenado superior", "ml", 30000),
  c("casa_desde_0", "Estructura de H°A°", "Losa de hormigón", "m²", 58000),

  c("casa_desde_0", "Mampostería", "Muro exterior ladrillo hueco 18", "m²", 26000),
  c("casa_desde_0", "Mampostería", "Tabique interior ladrillo hueco 12", "m²", 19000),

  c("casa_desde_0", "Cubierta / Techo", "Estructura de madera para techo", "m²", 38000),
  c("casa_desde_0", "Cubierta / Techo", "Aislación y membrana", "m²", 16000),
  c("casa_desde_0", "Cubierta / Techo", "Cubierta de tejas colocada", "m²", 49000),

  c("casa_desde_0", "Instalación sanitaria", "Cañería de agua fría y caliente", "boca", 42000),
  c("casa_desde_0", "Instalación sanitaria", "Desagües cloacales y pluviales", "global", 720000),
  c("casa_desde_0", "Instalación sanitaria", "Provisión y colocación de artefactos", "unidad", 95000),

  c("casa_desde_0", "Instalación eléctrica", "Bocas (luz, toma y datos)", "boca", 23000),
  c("casa_desde_0", "Instalación eléctrica", "Tablero principal y puesta a tierra", "unidad", 280000),

  c("casa_desde_0", "Instalación de gas", "Cañería y artefactos de gas", "global", 640000),

  c("casa_desde_0", "Revoques", "Revoque grueso y fino interior", "m²", 12500),
  c("casa_desde_0", "Revoques", "Revoque exterior impermeable", "m²", 15000),

  c("casa_desde_0", "Contrapisos y carpetas", "Contrapiso", "m²", 11000),
  c("casa_desde_0", "Contrapisos y carpetas", "Carpeta de nivelación", "m²", 8500),

  c("casa_desde_0", "Pisos y revestimientos", "Piso porcelanato colocado", "m²", 34000),
  c("casa_desde_0", "Pisos y revestimientos", "Revestimiento de baño/cocina", "m²", 31000),
  c("casa_desde_0", "Pisos y revestimientos", "Zócalos", "ml", 6500),

  c("casa_desde_0", "Cielorrasos", "Cielorraso de placa de yeso", "m²", 21000),

  c("casa_desde_0", "Carpintería", "Puerta de entrada", "unidad", 420000),
  c("casa_desde_0", "Carpintería", "Puertas placa interiores", "unidad", 165000),
  c("casa_desde_0", "Carpintería", "Ventanas de aluminio con vidrio", "m²", 95000),
  c("casa_desde_0", "Carpintería", "Placard a medida", "ml", 240000),

  c("casa_desde_0", "Pintura", "Látex interior (2 manos)", "m²", 5200),
  c("casa_desde_0", "Pintura", "Látex exterior", "m²", 6800),
  c("casa_desde_0", "Pintura", "Esmalte en aberturas", "m²", 7500),

  c("casa_desde_0", "Cocina y terminaciones", "Mesada de granito/cuarzo", "ml", 185000),
  c("casa_desde_0", "Cocina y terminaciones", "Griferías y accesorios", "global", 420000),
  c("casa_desde_0", "Cocina y terminaciones", "Limpieza final de obra", "global", 180000),

  // ===================== REMODELACIÓN =====================
  c("remodelacion", "Demolición y retiro", "Retiro de pisos existentes", "m²", 6500),
  c("remodelacion", "Demolición y retiro", "Demolición de tabiques", "m²", 9000),
  c("remodelacion", "Demolición y retiro", "Picado de revestimientos", "m²", 5500),
  c("remodelacion", "Demolición y retiro", "Retiro de escombros (volquete)", "unidad", 85000),

  c("remodelacion", "Albañilería", "Apertura / cierre de vanos", "unidad", 145000),
  c("remodelacion", "Albañilería", "Tabiques nuevos", "m²", 19000),
  c("remodelacion", "Albañilería", "Reparación de muros y revoques", "m²", 13000),

  c("remodelacion", "Instalación sanitaria", "Renovación de cañerías de agua", "global", 520000),
  c("remodelacion", "Instalación sanitaria", "Reubicación / cambio de artefactos", "unidad", 110000),

  c("remodelacion", "Instalación eléctrica", "Actualización de tablero", "unidad", 240000),
  c("remodelacion", "Instalación eléctrica", "Bocas nuevas (luz y toma)", "boca", 24000),

  c("remodelacion", "Pisos y revestimientos", "Colocación de piso porcelanato", "m²", 34000),
  c("remodelacion", "Pisos y revestimientos", "Revestimiento de baño/cocina", "m²", 31000),
  c("remodelacion", "Pisos y revestimientos", "Carpeta de nivelación autonivelante", "m²", 12000),

  c("remodelacion", "Cielorrasos", "Cielorraso de durlock", "m²", 22000),
  c("remodelacion", "Cielorrasos", "Buña perimetral / molduras", "ml", 7800),

  c("remodelacion", "Carpintería", "Cambio de aberturas", "unidad", 195000),
  c("remodelacion", "Carpintería", "Puertas placa nuevas", "unidad", 165000),
  c("remodelacion", "Carpintería", "Placard / amoblamiento a medida", "ml", 240000),

  c("remodelacion", "Pintura", "Enduido completo de paredes", "m²", 6000),
  c("remodelacion", "Pintura", "Látex interior (2 manos)", "m²", 5200),
  c("remodelacion", "Pintura", "Esmalte en aberturas", "m²", 7500),

  c("remodelacion", "Cocina y baño", "Mesada y bajo mesada", "ml", 210000),
  c("remodelacion", "Cocina y baño", "Mueble bajo mesada", "ml", 160000),
  c("remodelacion", "Cocina y baño", "Colocación de griferías", "unidad", 38000),

  c("remodelacion", "Terminaciones", "Colocación de zócalos", "ml", 6500),
  c("remodelacion", "Terminaciones", "Limpieza final de obra", "global", 140000),
];

// ───────────────────────── Carga del catálogo ─────────────────────────

export async function getCatalogo(): Promise<ItemCatalogo[]> {
  const filas = await cargarFilas();
  return filas.map((f, i) => ({ ...f, id: String(i) }));
}

async function cargarFilas(): Promise<FilaCatalogo[]> {
  const url = process.env.PRESUPUESTOS_SHEET_CSV;
  if (!url) return SEED;
  try {
    // Refresco cada 5 minutos: los cambios en la planilla se ven solos.
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
// Mínimo pero soporta comillas y comas dentro de los campos.

function parseCsv(text: string): FilaCatalogo[] {
  const rows = splitRows(text);
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const iTipo = header.indexOf("tipo");
  const iCat = header.indexOf("categoria");
  const iItem = header.indexOf("item");
  const iUnidad = header.indexOf("unidad");
  const iPrecio = header.indexOf("precio_unitario");
  if ([iTipo, iCat, iItem, iUnidad, iPrecio].some((i) => i < 0)) return [];

  const out: FilaCatalogo[] = [];
  for (let r = 1; r < rows.length; r++) {
    const cols = rows[r];
    const tipo = normTipo(cols[iTipo]);
    const item = (cols[iItem] ?? "").trim();
    if (!tipo || !item) continue;
    out.push({
      tipo,
      categoria: (cols[iCat] ?? "").trim() || "Otros",
      item,
      unidad: (cols[iUnidad] ?? "").trim() || "u",
      precioUnitario: parseNum(cols[iPrecio] ?? "0"),
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
  const s = (raw ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  if (s.startsWith("casa")) return "casa_desde_0";
  if (s.startsWith("remod")) return "remodelacion";
  if (s === "casa_desde_0") return "casa_desde_0";
  if (s === "remodelacion") return "remodelacion";
  return null;
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
