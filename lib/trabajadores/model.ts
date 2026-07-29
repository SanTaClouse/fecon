// Modelo compartido de la bolsa de trabajo (postulaciones de trabajadores).
// Se usa tanto en el formulario público (/trabaja-con-nosotros) como en el
// panel privado (/trabajadores). No toca la base: solo tipos, listas y
// normalización.

export type EstadoPostulacion = "nuevo" | "contactado" | "descartado";

export const ESTADOS: { value: EstadoPostulacion; label: string }[] = [
  { value: "nuevo", label: "Nuevo" },
  { value: "contactado", label: "Contactado" },
  { value: "descartado", label: "Descartado" },
];

/** Oficios de obra. El último ("Otro") habilita el campo libre. */
export const OFICIOS = [
  "Albañil",
  "Ayudante de albañil",
  "Techista / Tejas",
  "Electricista",
  "Plomero / Gasista",
  "Yesero / Durlock",
  "Pintor",
  "Carpintero",
  "Herrero / Soldador",
  "Colocador de pisos y revestimientos",
  "Hormigón / Losas",
  "Movimiento de suelo / Maquinista",
  "Dirección de obra (MMO / Arq. / Ing.)",
  "Otro",
] as const;

export const PROVINCIAS = [
  "Santa Fe",
  "Entre Ríos",
  "Córdoba",
  "Buenos Aires",
  "CABA",
  "Corrientes",
  "Chaco",
  "Santiago del Estero",
  "San Luis",
  "La Pampa",
  "Mendoza",
  "San Juan",
  "La Rioja",
  "Catamarca",
  "Tucumán",
  "Salta",
  "Jujuy",
  "Formosa",
  "Misiones",
  "Río Negro",
  "Neuquén",
  "Chubut",
  "Santa Cruz",
  "Tierra del Fuego",
] as const;

/** Lo que manda el formulario público (todo string, viene de <form>). */
export type FormPostulacion = {
  nombre: string;
  nacimiento: string; // YYYY-MM-DD
  telefono: string;
  provincia: string;
  ciudad: string;
  oficio: string;
  experiencia: string; // años, como texto
  descripcion: string;
  herramientas: boolean;
  movilidad: boolean;
  viaja: boolean;
};

/** Una postulación ya guardada, como la lee el panel. */
export type Postulacion = {
  id: string;
  nombre: string;
  nacimiento: string | null; // YYYY-MM-DD
  edad: number | null;
  telefono: string;
  telefonoNorm: string;
  provincia: string;
  ciudad: string;
  oficio: string;
  experiencia: number;
  descripcion: string;
  herramientas: boolean;
  movilidad: boolean;
  viaja: boolean;
  estado: EstadoPostulacion;
  notas: string;
  creadoEn: string; // ISO
};

/* ───────────────────────── Normalización ───────────────────────── */

const colapsar = (s: string) => (s ?? "").replace(/\s+/g, " ").trim();

/** "santa   fe " → "Santa Fe" (respeta preposiciones y siglas cortas). */
export function tituloCiudad(s: string): string {
  const menores = new Set(["de", "del", "la", "las", "los", "el", "y"]);
  return colapsar(s)
    .toLocaleLowerCase("es-AR")
    .split(" ")
    .map((w, i) =>
      i > 0 && menores.has(w)
        ? w
        : w.charAt(0).toLocaleUpperCase("es-AR") + w.slice(1)
    )
    .join(" ");
}

/**
 * Deja el teléfono en 10 dígitos (código de área + número, sin 54 / 9 / 0 / 15).
 * Es la clave para no duplicar a la misma persona si se anota dos veces, así
 * que tiene que dar lo mismo escriba "3425194112", "+54 9 342 519-4112" o
 * "0342 15-5194112".
 */
export function normalizarTelefono(raw: string): string {
  let d = (raw ?? "").replace(/\D+/g, "");

  // Prefijo internacional.
  if (d.startsWith("0054")) d = d.slice(4);
  else if (d.startsWith("54")) d = d.slice(2);

  // El "9" de móvil que va después del 54.
  if (d.length > 10 && d.startsWith("9")) d = d.slice(1);

  // El "0" de larga distancia nacional.
  d = d.replace(/^0+/, "");

  // El "15" del formato local: va justo después del código de área, que en
  // Argentina tiene 2, 3 o 4 dígitos (área + número siempre suman 10).
  if (d.length === 12) {
    for (const largoArea of [2, 3, 4]) {
      if (d.slice(largoArea, largoArea + 2) === "15") {
        d = d.slice(0, largoArea) + d.slice(largoArea + 2);
        break;
      }
    }
  }

  return d.slice(-10);
}

// Marcas de acento combinantes (U+0300–U+036F), las que deja normalize("NFD").
const MARCAS_ACENTO = new RegExp("[\\u0300-\\u036f]", "g");

/**
 * Clave para agrupar ciudades: ignora acentos, mayúsculas y puntuación, así
 * "Paraná", "parana" y "PARANÁ" caen en el mismo grupo del panel.
 */
export function claveCiudad(ciudad: string): string {
  return (ciudad ?? "")
    .normalize("NFD")
    .replace(MARCAS_ACENTO, "")
    .toLocaleLowerCase("es-AR")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Link de WhatsApp para contactar a la persona desde el panel. */
export function waTrabajador(telefonoNorm: string, mensaje: string): string {
  return `https://wa.me/549${telefonoNorm}?text=${encodeURIComponent(mensaje)}`;
}

/** "3425194112" → "342 519-4112" */
export function telefonoLegible(t: string): string {
  if (t.length !== 10) return t;
  return `${t.slice(0, 3)} ${t.slice(3, 6)}-${t.slice(6)}`;
}

export function edadDesde(nacimiento: string | null): number | null {
  if (!nacimiento) return null;
  const n = new Date(`${nacimiento}T00:00:00`);
  if (Number.isNaN(n.getTime())) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - n.getFullYear();
  const m = hoy.getMonth() - n.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < n.getDate())) edad--;
  return edad;
}

/* ───────────────────────── Validación ───────────────────────── */

/** Datos ya limpios y listos para insertar en la base. */
export type DatosValidados = {
  nombre: string;
  nacimiento: string;
  edad: number;
  telefono: string;
  telefonoNorm: string;
  provincia: string;
  ciudad: string;
  oficio: string;
  experiencia: number;
  descripcion: string;
  herramientas: boolean;
  movilidad: boolean;
  viaja: boolean;
};

export type Validacion =
  | { ok: true; datos: DatosValidados }
  | { ok: false; error: string };

const MIN_EDAD = 16;
const MAX_EDAD = 90;

export function validar(f: FormPostulacion): Validacion {
  const nombre = colapsar(f.nombre);
  if (nombre.length < 3) return { ok: false, error: "Escribí tu nombre y apellido." };
  if (nombre.length > 80) return { ok: false, error: "El nombre es demasiado largo." };

  const edad = edadDesde(f.nacimiento);
  if (edad === null) return { ok: false, error: "Poné tu fecha de nacimiento." };
  if (edad < MIN_EDAD)
    return { ok: false, error: `Tenés que tener al menos ${MIN_EDAD} años para anotarte.` };
  if (edad > MAX_EDAD) return { ok: false, error: "Revisá la fecha de nacimiento." };

  const telefonoNorm = normalizarTelefono(f.telefono);
  if (telefonoNorm.length !== 10)
    return {
      ok: false,
      error: "El WhatsApp tiene que ser código de área + número (10 dígitos). Ej: 342 519-4112.",
    };

  const provincia = colapsar(f.provincia);
  if (!(PROVINCIAS as readonly string[]).includes(provincia))
    return { ok: false, error: "Elegí tu provincia." };

  const ciudad = tituloCiudad(f.ciudad);
  if (ciudad.length < 3) return { ok: false, error: "Escribí tu ciudad o localidad." };
  if (ciudad.length > 60) return { ok: false, error: "El nombre de la ciudad es demasiado largo." };

  const oficio = colapsar(f.oficio);
  if (oficio.length < 3) return { ok: false, error: "Elegí o escribí tu oficio." };
  if (oficio.length > 60) return { ok: false, error: "El oficio es demasiado largo." };

  const experiencia = Math.min(70, Math.max(0, Math.floor(Number(f.experiencia) || 0)));
  if (experiencia > edad - 12)
    return { ok: false, error: "Revisá los años de experiencia: no coinciden con tu edad." };

  const descripcion = colapsar(f.descripcion).slice(0, 600);

  return {
    ok: true,
    datos: {
      nombre,
      nacimiento: f.nacimiento,
      telefono: colapsar(f.telefono).slice(0, 40),
      telefonoNorm,
      provincia,
      ciudad,
      oficio,
      experiencia,
      descripcion,
      herramientas: !!f.herramientas,
      movilidad: !!f.movilidad,
      viaja: !!f.viaja,
      edad,
    },
  };
}
