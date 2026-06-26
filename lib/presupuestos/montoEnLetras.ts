// Convierte un monto en pesos a su expresión en letras, estilo presupuesto.
// Ej: 23960318.68 → "VEINTITRÉS MILLONES NOVECIENTOS SESENTA MIL
//      TRESCIENTOS DIECIOCHO 68/100"

const UNIDADES = [
  "",
  "uno",
  "dos",
  "tres",
  "cuatro",
  "cinco",
  "seis",
  "siete",
  "ocho",
  "nueve",
  "diez",
  "once",
  "doce",
  "trece",
  "catorce",
  "quince",
  "dieciséis",
  "diecisiete",
  "dieciocho",
  "diecinueve",
  "veinte",
  "veintiuno",
  "veintidós",
  "veintitrés",
  "veinticuatro",
  "veinticinco",
  "veintiséis",
  "veintisiete",
  "veintiocho",
  "veintinueve",
];
const DECENAS = [
  "",
  "",
  "",
  "treinta",
  "cuarenta",
  "cincuenta",
  "sesenta",
  "setenta",
  "ochenta",
  "noventa",
];
const CENTENAS = [
  "",
  "ciento",
  "doscientos",
  "trescientos",
  "cuatrocientos",
  "quinientos",
  "seiscientos",
  "setecientos",
  "ochocientos",
  "novecientos",
];

/** "uno"/"veintiuno" → "un"/"veintiún" cuando precede a mil / millones. */
function apocope(palabras: string): string {
  if (palabras.endsWith("veintiuno")) return palabras.slice(0, -9) + "veintiún";
  if (palabras.endsWith("uno")) return palabras.slice(0, -3) + "un";
  return palabras;
}

/** 0..999 en letras ("" para 0). */
function centenas(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "cien";
  let out = "";
  const c = Math.floor(n / 100);
  const resto = n % 100;
  if (c) out += CENTENAS[c] + " ";
  if (resto <= 29) out += UNIDADES[resto];
  else {
    const d = Math.floor(resto / 10);
    const u = resto % 10;
    out += DECENAS[d];
    if (u) out += " y " + UNIDADES[u];
  }
  return out.trim();
}

function convertir(n: number): string {
  if (n === 0) return "cero";
  const partes: string[] = [];
  const millones = Math.floor(n / 1_000_000);
  const resto = n % 1_000_000;
  const miles = Math.floor(resto / 1000);
  const cientos = resto % 1000;

  if (millones === 1) partes.push("un millón");
  else if (millones > 1) partes.push(apocope(convertir(millones)) + " millones");

  if (miles === 1) partes.push("mil");
  else if (miles > 1) partes.push(apocope(centenas(miles)) + " mil");

  if (cientos > 0) partes.push(centenas(cientos));

  return partes.join(" ").trim();
}

/** Monto en letras en MAYÚSCULAS con los centavos como NN/100. */
export function montoEnLetras(monto: number): string {
  const m = Math.max(0, Math.round(monto * 100) / 100);
  const entero = Math.floor(m);
  const centavos = Math.round((m - entero) * 100);
  const cc = String(centavos).padStart(2, "0");
  return `${convertir(entero).toUpperCase()} ${cc}/100`;
}
