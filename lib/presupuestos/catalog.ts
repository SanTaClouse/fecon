// Tipos y catálogo base del generador de presupuestos.
//
// Modelo unificado (igual que la planilla oficial de Martín): cada ítem tiene
// unidad + cantidad (descriptivos) y COSTO MATERIALES + COSTO MANO DE OBRA.
//   COSTO TOTAL del ítem = materiales + mano de obra.
//
// La FUENTE real es la base Neon (lib/presupuestos/db.ts). El SEED se usa para
// sembrar la base, el botón "restaurar ejemplos" y como fallback.

export type TipoPresupuesto = "casa_desde_0" | "remodelacion";

export type FilaCatalogo = {
  tipo: TipoPresupuesto;
  categoria: string; // "rubro"
  item: string;
  unidad: string; // m², ml, m³, boca, unidad, global, Mes…
  cantidad: number; // descriptiva (cantidad por defecto)
  materiales: number; // costo materiales (total)
  manoObra: number; // costo mano de obra (total)
};

/** Fila del catálogo con id estable (el id de la fila en la base). */
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
// Valores de referencia en pesos (ARS). Editables desde el panel.

const it = (
  tipo: TipoPresupuesto,
  categoria: string,
  item: string,
  unidad: string,
  materiales: number,
  manoObra: number,
  cantidad = 1
): FilaCatalogo => ({ tipo, categoria, item, unidad, cantidad, materiales, manoObra });

export const SEED: FilaCatalogo[] = [
  // ===================== CASA DESDE CERO =====================
  it("casa_desde_0", "Trabajos preliminares", "Limpieza y nivelación del terreno", "m²", 1500, 2000),
  it("casa_desde_0", "Trabajos preliminares", "Replanteo y marcación de obra", "m²", 1200, 3000),
  it("casa_desde_0", "Trabajos preliminares", "Obrador, cerco y conexión provisoria", "global", 520000, 330000),

  it("casa_desde_0", "Movimiento de suelos", "Excavación de zapatas y vigas", "m³", 2000, 16000),
  it("casa_desde_0", "Movimiento de suelos", "Relleno y compactación", "m³", 4000, 10000),

  it("casa_desde_0", "Fundaciones", "Hormigón de zapatas", "m³", 110000, 55000),
  it("casa_desde_0", "Fundaciones", "Vigas de fundación / encadenado inferior", "ml", 16000, 12000),
  it("casa_desde_0", "Fundaciones", "Platea de hormigón armado", "m²", 26000, 16000),

  it("casa_desde_0", "Estructura de H°A°", "Columnas de hormigón armado", "ml", 18000, 14000),
  it("casa_desde_0", "Estructura de H°A°", "Vigas de encadenado superior", "ml", 17000, 13000),
  it("casa_desde_0", "Estructura de H°A°", "Losa de hormigón", "m²", 35000, 23000),

  it("casa_desde_0", "Mampostería", "Muro exterior ladrillo hueco 18", "m²", 15000, 11000),
  it("casa_desde_0", "Mampostería", "Tabique interior ladrillo hueco 12", "m²", 10000, 9000),

  it("casa_desde_0", "Cubierta / Techo", "Estructura de madera para techo", "m²", 24000, 14000),
  it("casa_desde_0", "Cubierta / Techo", "Aislación y membrana", "m²", 9000, 7000),
  it("casa_desde_0", "Cubierta / Techo", "Cubierta de tejas colocada", "m²", 28000, 21000),

  it("casa_desde_0", "Instalación sanitaria", "Agua fría y caliente — baño", "global", 480000, 360000),
  it("casa_desde_0", "Instalación sanitaria", "Agua fría y caliente — cocina y lavadero", "global", 420000, 300000),
  it("casa_desde_0", "Instalación sanitaria", "Desagües cloacales y pluviales — vivienda", "global", 520000, 420000),
  it("casa_desde_0", "Instalación sanitaria", "Provisión y colocación de artefactos", "unidad", 70000, 25000),

  it("casa_desde_0", "Instalación eléctrica", "Bocas (luz, toma y datos)", "boca", 12000, 11000),
  it("casa_desde_0", "Instalación eléctrica", "Tablero principal y puesta a tierra", "unidad", 180000, 100000),

  it("casa_desde_0", "Instalación de gas", "Cañería y conexión de artefactos de gas", "global", 360000, 320000),

  it("casa_desde_0", "Revoques", "Macillado", "m²", 4000, 8500),
  it("casa_desde_0", "Revoques", "Revoque grueso", "m²", 15000, 20000),
  it("casa_desde_0", "Revoques", "Revoque exterior impermeable", "m²", 16000, 19000),

  it("casa_desde_0", "Contrapisos y carpetas", "Contrapiso", "m²", 6000, 5000),
  it("casa_desde_0", "Contrapisos y carpetas", "Carpeta de nivelación", "m²", 4000, 4500),

  it("casa_desde_0", "Pisos y revestimientos", "Piso porcelanato colocado", "m²", 22000, 12000),
  it("casa_desde_0", "Pisos y revestimientos", "Revestimiento de baño/cocina", "m²", 19000, 12000),
  it("casa_desde_0", "Pisos y revestimientos", "Zócalos", "ml", 3500, 3000),

  it("casa_desde_0", "Cielorrasos", "Cielorraso de placa de yeso", "m²", 12000, 9000),

  it("casa_desde_0", "Carpintería", "Puerta de entrada", "unidad", 350000, 70000),
  it("casa_desde_0", "Carpintería", "Puertas placa interiores", "unidad", 120000, 45000),
  it("casa_desde_0", "Carpintería", "Ventanas de aluminio con vidrio", "m²", 70000, 25000),
  it("casa_desde_0", "Carpintería", "Placard a medida", "ml", 180000, 60000),

  it("casa_desde_0", "Pintura", "Látex interior (2 manos)", "m²", 1800, 3400),
  it("casa_desde_0", "Pintura", "Látex exterior", "m²", 2600, 4200),
  it("casa_desde_0", "Pintura", "Esmalte en aberturas", "m²", 3000, 4500),

  it("casa_desde_0", "Cocina y terminaciones", "Mesada de granito/cuarzo", "ml", 140000, 45000),
  it("casa_desde_0", "Cocina y terminaciones", "Griferías y accesorios — colocación", "global", 380000, 160000),
  it("casa_desde_0", "Cocina y terminaciones", "Limpieza final de obra", "global", 60000, 120000),

  // ===================== REMODELACIÓN =====================
  it("remodelacion", "Demolición y retiro", "Retiro de pisos existentes", "m²", 500, 6000),
  it("remodelacion", "Demolición y retiro", "Demolición de tabiques", "m²", 500, 8500),
  it("remodelacion", "Demolición y retiro", "Picado de revestimientos", "m²", 500, 5000),
  it("remodelacion", "Demolición y retiro", "Retiro de escombros (volquete)", "unidad", 85000, 0),

  it("remodelacion", "Albañilería", "Apertura / cierre de vanos", "unidad", 60000, 85000),
  it("remodelacion", "Albañilería", "Tabiques nuevos", "m²", 10000, 9000),
  it("remodelacion", "Albañilería", "Reparación de muros y revoques", "m²", 5000, 8000),

  it("remodelacion", "Instalación sanitaria", "Renovación de agua — baño", "global", 380000, 320000),
  it("remodelacion", "Instalación sanitaria", "Renovación de agua — cocina y lavadero", "global", 340000, 280000),
  it("remodelacion", "Instalación sanitaria", "Renovación de desagües cloacales", "global", 300000, 320000),

  it("remodelacion", "Instalación eléctrica", "Actualización de tablero", "unidad", 150000, 90000),
  it("remodelacion", "Instalación eléctrica", "Bocas nuevas (luz y toma)", "boca", 13000, 11000),

  it("remodelacion", "Pisos y revestimientos", "Colocación de piso porcelanato", "m²", 22000, 12000),
  it("remodelacion", "Pisos y revestimientos", "Revestimiento de baño/cocina", "m²", 19000, 12000),
  it("remodelacion", "Pisos y revestimientos", "Carpeta de nivelación autonivelante", "m²", 8000, 4000),

  it("remodelacion", "Cielorrasos", "Cielorraso de durlock", "m²", 13000, 9000),
  it("remodelacion", "Cielorrasos", "Buña perimetral / molduras", "ml", 3800, 4000),

  it("remodelacion", "Carpintería", "Cambio de aberturas", "unidad", 140000, 55000),
  it("remodelacion", "Carpintería", "Puertas placa nuevas", "unidad", 120000, 45000),
  it("remodelacion", "Carpintería", "Placard / amoblamiento a medida", "ml", 180000, 60000),

  it("remodelacion", "Pintura", "Enduido completo de paredes", "m²", 2000, 4000),
  it("remodelacion", "Pintura", "Látex interior (2 manos)", "m²", 1800, 3400),
  it("remodelacion", "Pintura", "Esmalte en aberturas", "m²", 3000, 4500),

  it("remodelacion", "Cocina y baño", "Mesada y bajo mesada", "ml", 150000, 60000),
  it("remodelacion", "Cocina y baño", "Mueble bajo mesada", "ml", 120000, 40000),
  it("remodelacion", "Cocina y baño", "Colocación de griferías y artefactos", "global", 280000, 180000),

  it("remodelacion", "Terminaciones", "Colocación de zócalos", "ml", 3500, 3000),
  it("remodelacion", "Terminaciones", "Limpieza final de obra", "global", 50000, 90000),
];

/** SEED como ItemCatalogo (con id sintético) para usar de fallback. */
export const SEED_ITEMS: ItemCatalogo[] = SEED.map((f, i) => ({
  ...f,
  id: `seed-${i}`,
}));
