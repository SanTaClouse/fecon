// Tipos y catálogo base del generador de presupuestos.
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
//
// La FUENTE de datos real es la base Neon (ver lib/presupuestos/db.ts). El SEED
// de abajo se usa para: (1) sembrar la base la primera vez, (2) el botón
// "restaurar ejemplos" del panel, y (3) fallback si la base no responde.

export type TipoPresupuesto = "casa_desde_0" | "remodelacion";
export type ModoItem = "medicion" | "tarea";

export type FilaCatalogo = {
  tipo: TipoPresupuesto;
  categoria: string;
  item: string;
  modo: ModoItem;
  unidad: string; // medición: "m²", "ml"… · tarea: "tarea"
  precioUnitario: number; // medición
  materiales: number; // tarea
  manoObra: number; // tarea
};

/** Fila del catálogo con un id estable (el id de la fila en la base). */
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
// Precios en pesos (ARS), valores de referencia. Editables desde el panel.

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

export const SEED: FilaCatalogo[] = [
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

  med("casa_desde_0", "Revoques", "Macillado", "m²", 12500),
  med("casa_desde_0", "Revoques", "Revoque grueso", "m²", 35000),
  med("casa_desde_0", "Revoques", "Revoque exterior impermeable", "m²", 35000),

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

/** SEED como ItemCatalogo (con id sintético) para usar de fallback. */
export const SEED_ITEMS: ItemCatalogo[] = SEED.map((f, i) => ({
  ...f,
  id: `seed-${i}`,
}));
